// import { Actor, KeyValueStore, log } from "apify";
// await Actor.init()
// let kvsList = await Actor.openKeyValueStore("pinterest-json-TESTING-JSON-KVS", { forceCloud: false })

// console.log({ kvsList });

// async function readFromKVS(kvsList: KeyValueStore) {
//     let items: any[] = []
//     let data = kvsList.forEachKey(async (key) => {
//         console.log({ key });

//         let item = await kvsList.getValue(key)
//         items.push(item)
//     })
//     return items
// }


// let board_set: any = {}

// log.info("reading from kvs");

// let data = await readFromKVS(kvsList)

// console.log("analyzing pin data");
// data.map((item: any) => {

//     board_set[item.board.name] = (board_set[item.board.name] ?? 0) + 1
//     // }
//     if (!board_set[item.board.name])
//         board_set['unknown'] = (board_set['unknown'] ?? 0) + 1

//     board_set['total'] = (board_set['total'] ?? 0) + 1
// })
// board_set['boardCount'] = Object.values(board_set).length

// console.log({ board_set });

// await Actor.exit()

import { Actor, ApifyClient, Configuration, KeyValueStore, log } from "apify";
import * as fs from 'fs/promises'
await Actor.init()


async function readFromKVS(kvsList: KeyValueStore) {
    let items: any[] = []
    await kvsList.forEachKey(async (key) => {
        console.log({ key });
        let item = await kvsList.getValue(key)

        items.push(item)
    })
    return items
}

log.info("reading from kvs");
// let data = await (await fetch('https://api.apify.com/v2/datasets/V7QJhN6EFuGC1gWWB/items?token=apify_api_ZCzs8DZCa7Ey3bmFEvNDxggV0BOJM303JP74')).json()
// read data from local directory files
let data: any[] = []

// fs.readdir('/Users/umit/Desktop/Github Test/PinterestCrawl/pinterest-crawler/storage/key_value_stores/pinterest-json-TESTING-JSON-KVS', (err, files) => {
//     if (!err) log.info(`err: ${err}`)

//     log.info(`files: ${files.length}`)
//     console.log("HELLO");

//     console.log({ files });

//     files.map((file) => {
//         log.info(`file: ${file}`)
//         data.push(JSON.parse(fs.readFileSync(`/Users/umit/Desktop/Github Test/PinterestCrawl/pinterest-crawler/storage/key_value_stores/pinterest-json-TESTING-JSON-KVS/${file}`, 'utf8')))
//     })
// })
let dirnmae = process.argv[2]

async function readFiles(dir: string) {
    let files_dir = await fs.readdir(dir)
    files_dir.map(async (f) => {

        let json = await fs.readFile(dir + '/' + f, 'utf-8')

        data.push(JSON.parse(json))
    })
    return data
}

await readFiles('/Users/umit/Desktop/Github\ Test/PinterestCrawl/pinterest-crawler/storage/key_value_stores/pinterest-json-TESTING-JSON')
console.log("Data");

console.log('Read data from local files ' + data.length);

// let data = await (await fetch('')).json()
let board_set: any = {}


// let data = await readFromKVS(kvsList)

console.log("analyzing pin data");
log.info(`${data.length} pins found`)

data.map((item: any) => {

    board_set[item.board.name] = (board_set[item.board.name] ?? 0) + 1
    // }
    if (!board_set[item.board.name])
        board_set['unknown'] = (board_set['unknown'] ?? 0) + 1

    board_set['total'] = (board_set['total'] ?? 0) + 1
})
board_set['boardCount'] = Object.values(board_set).length

console.log({ board_set });

await Actor.exit()
