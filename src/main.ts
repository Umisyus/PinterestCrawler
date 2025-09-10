import {log, sleep} from 'crawlee';
import {Actor} from 'apify';
import {getProfileBoards} from "./getProfileBoards"
import {fetchBoardPins} from "./fetchPins";
import {BoardPinData} from "./BoardData";

await Actor.init()

const keyValueStore = await Actor.openKeyValueStore('pin-images')
const dataset = await Actor.openDataset("pin-json-dataset")

const {threshold, profileName} = await Actor.getInput<any>() ?? {threshold: 100, profileName: 'dracana96'}
if (!profileName) throw new Error('No username specified! Please specify a username to crawl.')

log.info(`threshold: ${threshold}, profileName: ${profileName}`);

let pins = new Array<BoardPinData>();


let boards = (await getProfileBoards(profileName));

let boardPins = new Set()

let bookmark = ""
for (let i = 0; i < boards.length; i++) {
    {
        await fetchBoardPins(profileName, boards[i].title, bookmark).then(boardP => {
            console.info({boardPins})
            pins.push(...boardP)
        })

    }
    log.info("Complete")
}



