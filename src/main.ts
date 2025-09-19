import {log} from 'crawlee';
import {Actor} from 'apify';
import {getProfileBoards} from "./getProfileBoards"
import {fetchBoardPins, options} from "./fetchPins";
import {BoardFeedResource, BoardPinData} from "./types/BoardData.js";
import {savetoDS} from "./util";
import {
    fetchAllBoardSectionPins,
    fetchBoardSectionPinsPage,
    getBoardSections
} from "./BoardSection";
import {PinData} from "./types/PinData";

const DEFAULT_PAGE_SIZE = 50
await Actor.init()

const keyValueStore = await Actor.openKeyValueStore('pin-images')
const dataset = await Actor.openDataset("pin-json-dataset")

const input = await Actor.getInput<any>()
let profileName = input.profileName
let limit = input.limit
let urls = input.urls as string[]

console.log({input})

for (const url of urls) {
    await getWithBookmark({url, bookmark: '', limit, options})
        .then(r => console.info({r}))

}

async function saveBoardPins() {
    if (!profileName) throw new Error('No username specified! Please specify a username to crawl.')

    const BOOKMARK_END = "-end-";

    log.info(`threshold: ${limit}, profileName: ${profileName}`);


    let pins = new Array<BoardPinData>();

    let boards = (await getProfileBoards(profileName)).filter(b => b.privacy !== "secret")

    for (let i = 0; i < boards.length; i++) {

        let nextBookmark = '';
        let preBookmark = '';

        // Get board pins
        while (nextBookmark !== BOOKMARK_END) {

            await fetchBoardPins(profileName, boards[i], nextBookmark)
                .then((boardP) => {
                    if (boardP === null || boardP === undefined || boardP.pins === null || boardP.pins === undefined) {
                        log.info("Error: Failed parsing pins for " + boards[i])
                    }

                    if (boardP !== null) {
                        pins.push(...boardP.pins)
                        log.info(`Pin count: ${pins.length}`)
                        preBookmark = nextBookmark
                        nextBookmark = boardP.bookmark[0]
                    }
                })
            if (!!nextBookmark && nextBookmark.length > 0 && nextBookmark == preBookmark)
                break;
        }

        await savetoDS(pins, dataset)
        // Clear all pins, bookmarks
        pins = []
        nextBookmark = ""
        preBookmark = ""

        let sections = await getBoardSections(boards[i])
        let sL = sections.length;

        if (sL > 0) {
            log.info(`Found ${sL} section(s)`)

            for (const section of sections) {
                let p = await fetchAllBoardSectionPins(profileName, boards[i], section);
                log.info(`Saving pins for section: ${section.title}...`)

                if ((p !== null && p !== undefined) && Array.isArray(p) && p.length > 0)
                    await savetoDS(Array.from(p), dataset)
            }
        }

        log.info("Complete " + boards[i].name)

    }
    log.info(`Total of ${await dataset.getInfo().then(d => d?.itemCount)} items collected.`)
}

// await saveBoardPins();


// const profileName = "dracana96";
//
// (async () => {
//     let pins = new Set()
//     for (const pin of (await fetchUserPinsPage({profileName, bookmark: "", options, pageSize: 50,limit:50})
//         .then(async (up) => {
//             return await fetchAllUserPinsByBookmark({
//                 options,
//                 profileName,
//                 bookmark: up?.bookmark[0] ?? "",
//             });
//         }))) {
//         pins.add(pin)
//     }
//     console.info({pins})
// })()

// AI WROTE THIS
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

/**
 * Fetch all user pins, paginating by bookmark.
 */
async function fetchAllUserPinsByBookmark(
    {profileName, options, bookmark, limit}: {
        profileName: string,
        options: RequestInit,
        bookmark?: string | undefined,
        limit?: number
    }
): Promise<PinData[]> {
    const ALL_PINS: PinData[] = [];
    let nextBookmark = bookmark ?? "";
    let prevBookmark = "";

    while (true) {
        const page = await fetchUserPinsPage({profileName: profileName, bookmark: nextBookmark, options: options});
        if (!page || !page.data) break;
        ALL_PINS.push(...page.data);

        prevBookmark = nextBookmark;
        nextBookmark = page.bookmark?.[0] ?? "";
        if (!nextBookmark || nextBookmark === prevBookmark) break;
        if (limit)
            if (ALL_PINS.length >= limit) break;
    }
    return ALL_PINS;
}

// Write a generic function to query with bookmarks
export async function getWithBookmark(
    {bookmark, url, options, limit}: { bookmark: string, url: string, options: RequestInit, limit?: number }) {
    const ALL_ITEMS: any[] = [];

    let nextBookmark = bookmark ?? "";
    let prevBookmark = "";
    const BOOKMARK_END = "-end-";
    let page: any;
    while (true) {

        let split = url.split('/').filter(Boolean);
        if (split.at(2) === "pin") {
            log.warning("Detected pin url, currently these are not supported. skipping...")
            break;
        }
        if (split.length == 3) {
            // Get User Pins
            page = await fetchUserPinsPage({profileName, bookmark:nextBookmark, options, pageSize: DEFAULT_PAGE_SIZE + 200})
        }
        if (split.length == 4) {
            // Get Board
            const boardName = split.at(3)
            let boards = await getProfileBoards(profileName)
            const board = boards.find(b => b.name === boardName)
            if (!board) {
                log.error(`Board not found: ${boardName} for user: ${profileName} at url: ${url}`)
                break;
            }
            page = await fetchBoardPins(profileName, board, bookmark)
            page.data = page.pins
        }
        // Get Board Section
        if (split.length == 5) {
            let boardName = split.at(3)!
            let sectionName = split.at(4)!
            let boards = await getProfileBoards(profileName);

            let board = boards.find((b => b.name.toLocaleLowerCase() === boardName.toLocaleLowerCase()));

            if (board) {
                let sections = await getBoardSections(board);
                let section = sections.find(s => s.slug === sectionName);
                if (section) {
                    page = await fetchBoardSectionPinsPage(profileName, board, section, bookmark)
                } else {
                    log.error(`Section not found: ${sectionName} for board: ${boardName} for user: ${profileName} at url: ${url}`)
                }
            } else {
                log.error(`Board not found: ${boardName} for user: ${profileName} at url: ${url}`)
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

