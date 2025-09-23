import {log} from 'crawlee';
import {Actor} from 'apify';
import {getBoardSlug, getProfileBoards} from "./getProfileBoards"
import {fetchBoardPins, options} from "./fetchPins";
import {BoardFeedResource, BoardPinData} from "./types/BoardData.js";
import {savetoDS} from "./util";
import {fetchBoardSectionPinsPage, getBoardSections} from "./BoardSection";
import {PinItType, V3GetPinQueryData} from "./types/PinItType";
import * as cheerio from "cheerio";
import {PinData} from "./types/PinData";
import {BoardSectionPin} from "./types/BoardSectionResponse";

const DEFAULT_PAGE_SIZE = 50
await Actor.init()

const keyValueStore = await Actor.openKeyValueStore('pin-images')
const dataset = await Actor.openDataset("pin-json-dataset")

const input = await Actor.getInput<any>()
log.info(`Input: ${JSON.stringify(input)}`)
let profileName: string | undefined = input.profileName
let limit = input.limit
let urls: string[] = input.urls ?? []
let totalCount = 0
let msg = `At least one URL is required if a profile name is not provided`


if (urls.length == 0 && (!profileName || profileName.length == 0)) {
    await Actor.exit(msg, {exitCode: 1})
}
console.log({input})

if (urls.length > 0) {
    log.info('Processing urls...')
    for (const url of urls) {
        await getWithBookmark({url, bookmark: '', limit, options})
            .then(async r => {
                if (r !== undefined && r.length > 0) {
                    await savetoDS(r, dataset);
                    totalCount += r.length
                    log.info(`Fetched and saved a total ${totalCount} pin items`)
                } else log.warning(`No pin items were found for url: ${url}`)

            })
    }
}
if (profileName) {
    if (profileName.length > 0) {
        await getWithBookmark({url: `http://pintrest.com/${profileName}/`, bookmark: '', limit, options})
            .then(async profileData => {
                if (profileData)
                    //     await savetoDS(profileData, dataset);
                    totalCount += profileData.length
                log.info(`Fetched and saved a total ${totalCount} profile pin items`)
            })
    }
}

log.info(`REPORT: Fetched total ${await dataset.getInfo().then(i => i!.itemCount)} items`)

/**
 * Fetch one page of user pins using the Pinterest "UserPinsResource" endpoint.
 */
async function fetchUserPinsPage(
    {profileName, bookmark, options, pageSize}: {
        profileName: string,
        bookmark: string,
        options?: RequestInit,
        pageSize?: number,
    },
): Promise<{ data: any[]; bookmark: string[] } | null> {
    const sourceUrl = `/${profileName}/^`;
    const queryData = {
        options: {
            add_vase: true,
            field_set_key: "mobile_grid_item",
            is_own_profile_pins: false,
            page_size: pageSize ?? 50,
            username: profileName,
            bookmarks: bookmark ? [bookmark] : []
        },
        context: {}
    };
    const dataParam = encodeURIComponent(JSON.stringify(queryData));
    const url = `https://ca.pinterest.com/resource/UserPinsResource/get?source_url=${encodeURIComponent(sourceUrl)}&data=${dataParam}&_=${Date.now()}`;

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            console.error(`HTTP error: ${response.status}, ${response.statusText}`);
            return null;
        }
        const json: BoardFeedResource = await response.json();
        if (json && json.resource_response && json.resource_response.data) {
            return {
                data: json.resource_response.data,
                bookmark: json.resource?.options.bookmarks ?? [""]
            };
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
    return null;
}

async function fetchPinFromUrl(url: string, options: RequestInit) {
    let html = await (await fetch(url, {redirect: "follow", ...options})).text();

    // Create a document from the HTML
    let $ = cheerio.load(html);
    let scriptTag = $('script[data-relay-response="true"]').first();
    let text = scriptTag.text()
    // Extract the JSON data from the script tag
    if (scriptTag.length == 1)
        return (JSON.parse(text) as unknown as PinItType).response.data.v3GetPinQuery.data

    return null
}

function normalizePins(ALL_ITEMS: any[]) {
    return ALL_ITEMS.map((o: any | V3GetPinQueryData | BoardPinData | PinItType | PinData | BoardSectionPin) => {
        let url!: string;
        let video: string | undefined = undefined;

        if (o.images !== undefined)
            if (o.images.url !== undefined)
                url = o.images.url
        if ("images" in o && o.images instanceof Object && Object.keys(o.images).length > 0) {
            // @ts-ignore
            url = o.images[Object.keys(o['images']).at(-1)].url
        }
        if ("imageSpec_orig" in o)
            url = o.imageSpec_orig?.url

        if (!url) {
            throw new Error('Pin url not found! Was it a valid pin? ' + JSON.stringify(o));
        }

        if (o.videos) {
            if (o.videos.videoUrls && o.videos.videoUrls instanceof Array)
                if (o.videos.videoUrls.length > 0)
                    video = o.videos.videoUrls.sort().at(0)
        }

        return {
            name: o.grid_title ?? o.entity_id ?? o.id,
            id: o.id ?? o.entity_id,
            url,
            board: "board" in o ? getBoardSlug(o.board.url) : null,
            section: "section" in o ? o?.section?.title : null,
            video: video ?? null
        };
    });
}

// Write a generic function to query with bookmarks
export async function getWithBookmark(
    {bookmark, url, options, limit}: { bookmark: string, url: string, options: RequestInit, limit?: number }) {
    const ALL_ITEMS: any[] = [];

    let profileName_ = profileName ?? url.split('/').filter(Boolean).at(2)!;
    let nextBookmark = bookmark ?? "";
    let prevBookmark = "";
    const BOOKMARK_END = "-end-";
    let page: any;

    while (true) {
        /*
        Depending on URL structure, try to guess the type of request
        [user profile, board, section or individual pin]
        */

        // Get pin from HTML
        let split = url.split('/').filter(Boolean);
        const hasPin = checkLinkHasPin(url);
        if (hasPin) {
            let result = await fetchPinFromUrl(url, options)
                .then(r => ALL_ITEMS.push(r))

            if (result > 0) {
                log.info(`Fetched pin data for url: ${url}  \n ${JSON.stringify(result)}`)
                break;
            } else {
                log.error(`Failed to fetch pin data for url: ${url}`)
                break;
            }
        }
        if (split.length == 3) {
            // Get User Pins
            page = await fetchUserPinsPage({
                profileName: profileName_,
                bookmark: nextBookmark,
                options,
                pageSize: DEFAULT_PAGE_SIZE + 200
            })
        }
        if (split.length == 4) {
            // Get Board
            const boardName = split.at(3)
            let boards = await getProfileBoards(profileName_)
            const board = boards.find(b => b.name === boardName)
            if (!board) {
                log.error(`Board not found: ${boardName} for user: ${profileName_} at url: ${url}`)
                break;
            }
            page = await fetchBoardPins(profileName_, board, nextBookmark)
            page.data = page.pins
        }
        // Get Board Section
        if (split.length == 5) {
            let boardName = split.at(3)!
            let sectionName = split.at(4)!
            let boards = await getProfileBoards(profileName_);

            let board = boards.find((b => b.name.toLocaleLowerCase() === boardName.toLocaleLowerCase()));

            if (board) {
                let sections = await getBoardSections(board);
                let section = sections.find(s => s.slug === sectionName);
                if (section) {
                    page = await fetchBoardSectionPinsPage(profileName_, board, section, nextBookmark)
                } else {
                    log.error(`Section not found: ${sectionName} for board: ${boardName} for user: ${profileName_} at url: ${url}`)
                }
            } else {
                log.error(`Board not found: ${boardName} for user: ${profileName_} at url: ${url}`)
            }
        }

        if (!page || !page.data) break;
        ALL_ITEMS.push(...page.data);

        prevBookmark = nextBookmark;
        nextBookmark = page.bookmark?.[0] ?? "";
        if (nextBookmark === prevBookmark) break;
        if (nextBookmark === BOOKMARK_END) break;

        if (limit)
            if (ALL_ITEMS.length >= limit) break;

        if (!page) {
            log.info(`No data for url: ${url}`)
            break;
        }
    }


    return normalizePins(ALL_ITEMS.filter(o => o.type !== "story"))
}

await Actor.exit()

export {}

function checkLinkHasPin(url: string) {
    const split = url.split('/').filter(Boolean);
    const seg2 = split.at(2);
    const seg1 = split.at(1);
    return (seg2 && seg2.startsWith("pin")) ||
        (seg1 && seg1.startsWith("pin.it"));
}
