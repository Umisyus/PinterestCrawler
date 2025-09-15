import {log} from 'crawlee';
import {Actor} from 'apify';
import {getProfileBoards} from "./getProfileBoards"
import {fetchBoardPins, options} from "./fetchPins";
import {BoardFeedResource, BoardPinData} from "./types/BoardData.js";
import {savetoDS} from "./util";
import {fetchAllBoardSectionPins, getBoardSections} from "./BoardSection";
import {PinData} from "./types/PinData";
import * as INPUT_SCHEMA from "INPUT-SCHEMA.json"

await Actor.init()
const keyValueStore = await Actor.openKeyValueStore('pin-images')
const dataset = await Actor.openDataset("pin-json-dataset")


const input = await Actor.getInput<any>()
let profileName = input.profileName
let limit = input.limit

console.log({input})

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

        sections.forEach(async (section) => {
            let p = await fetchAllBoardSectionPins(profileName, boards[i], section);
            log.info(`Saving pins for section: ${section.title}...`)

            if ((p !== null && p !== undefined) && Array.isArray(p) && p.length > 0)
                await savetoDS(Array.from(p), dataset)
        })
    }

    log.info("Complete " + boards[i].name)

}
log.info(`Total of ${await dataset.getInfo().then(d => d?.itemCount)} items collected.`)


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
            console.error(`HTTP error: ${response.status}`);
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


await Actor.exit()

