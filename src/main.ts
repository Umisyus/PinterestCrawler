import {log} from 'crawlee';
import {Actor} from 'apify';
import {getProfileBoards} from "./getProfileBoards"
import {fetchBoardPins} from "./fetchPins";
import {Board, BoardPinData} from "./BoardData";
import {savetoDS} from "./util";

await Actor.init()

const keyValueStore = await Actor.openKeyValueStore('pin-images')
const dataset = await Actor.openDataset("pin-json-dataset")

const {threshold, profileName} = await Actor.getInput<any>() ?? {threshold: 100, profileName: 'dracana96'}
if (!profileName) throw new Error('No username specified! Please specify a username to crawl.')
const BOOKMARK_END = "-end-";

log.info(`threshold: ${threshold}, profileName: ${profileName}`);

let pins = new Array<BoardPinData>();


let boards = (await getProfileBoards(profileName)).filter(b => b.privacy !== "secret")

for (let i = 0; i < boards.length; i++) {

    let nextBookmark = '';
    let preBookmark = '';

    while (nextBookmark !== BOOKMARK_END) {

        await fetchBoardPins(profileName, boards[i], nextBookmark)
            .then((boardP) => {
                if (boardP === null || boardP === undefined || boardP.pins === null || boardP.pins === undefined) {
                    log.info("Error: Failed parsing pins for " + boards[i])
                    // throw new Error("Error getting pins")
                }

                if (boardP !== null) {
                    pins.push(...boardP.pins)
                    console.info({pins})
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

    log.info("Complete " + boards[i].name)

}
log.info(`Total of ${dataset.getInfo().then(d => d?.itemCount)} items collected.`)