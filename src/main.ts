import { log } from 'crawlee';
import { Actor } from 'apify';
import { getProfileBoards } from "./getProfileBoards.js"
import { fetchBoardPins, options } from "./fetchPins.js";
import { BoardFeedResource } from "./types/BoardData.js";
import { savetoDS } from "./util.js"
import { fetchBoardSectionPinsPage, getBoardSections } from "./BoardSection.js";
import { PinItType } from "./types/PinItType.js";
import * as cheerio from "cheerio";

const DEFAULT_PAGE_SIZE = 50
await Actor.init()

const dataset = await Actor.openDataset("pin-json-dataset")

const input = await Actor.getInput<any>()
log.info(`Input: ${JSON.stringify(input)}`)
let profileName: string | undefined = input.profileName
let limit = input.limit
let urls: string[] = input.urls ?? []
let totalCount = 0
let msg = `At least one URL is required if a profile name is not provided`


if (urls.length == 0 && (!profileName || profileName.trim().length == 0)) {
    await Actor.exit(msg, { exitCode: 1 })
}
console.log({ input })

if (urls.length > 0) {
    for (const url of urls) {
        await getWithBookmark({ url, bookmark: '', limit, options })
            .then(async r => {
                await savetoDS(r, dataset);
                totalCount += r.length
                log.info(`Fetched and saved a total ${totalCount} pin items`)
            })
    }
}

if (profileName!.length > 0)
    await getWithBookmark({ url: `http://pintrest.com/${profileName}/`, bookmark: '', limit, options })
        .then(async profileData => {
            await savetoDS(profileData, dataset);
            totalCount += profileData.length
            log.info(`Fetched and saved a total ${totalCount} profile pin items`)
        })

log.info(`REPORT: Fetched total ${await dataset.getInfo().then(i => i!.itemCount)} items`)

/**
 * Fetch one page of user pins using the Pinterest "UserPinsResource" endpoint.
 */
async function fetchUserPinsPage(
    { profileName, bookmark, options, pageSize }: {
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
    let html = await (await fetch(url, { redirect: "follow", ...options })).text();

    // Create a document from the HTML
    let $ = cheerio.load(html);
    let scriptTag = $('script[data-relay-response="true"]').first();
    let text = scriptTag.text()
    // Extract the JSON data from the script tag
    if (scriptTag.length == 1)
        return (JSON.parse(text) as unknown as PinItType).response.data.v3GetPinQuery.data

    return null
}

// Write a generic function to query with bookmarks
async function getWithBookmark(
    { bookmark, url, options, limit }: { bookmark: string, url: string, options: RequestInit, limit?: number }) {
    const ALL_ITEMS: any[] = [];

    let profileName_ = profileName ?? url.split('/').filter(Boolean).at(1)!;
    let nextBookmark = bookmark ?? "";
    let prevBookmark = "";
    const BOOKMARK_END = "-end-";
    let page: any;
    while (true) {

        let split = url.split('/').filter(Boolean);
        const hasPin = checkLinkHasPin(url);
        if (hasPin) {
            let result = await fetchPinFromUrl(url, options)
                .then(r => ALL_ITEMS.push(r));

            if (result > 0)
                log.info(`Fetched pin data for url: ${url}  \n ${JSON.stringify(result)}`);
            else
                log.error(`Failed to fetch pin data for url: ${url}`)
            break;
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

        if (page == null || undefined) {
            log.info(`No data for url: ${url}`)
            break;
        }
    }


    return ALL_ITEMS;

}

await Actor.exit()

export { }

function checkLinkHasPin(url: string) {
    const split = url.split('/').filter(Boolean);
    const seg2 = split.at(2);
    const seg1 = split.at(1);
    return (seg2 && seg2.startsWith("pin")) ||
        (seg1 && seg1.startsWith("pin.it"));
}
