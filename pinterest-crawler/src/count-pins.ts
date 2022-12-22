import { Actor } from "apify";
await Actor.init()
let ds = await Actor.openDataset("pinterest-json")
let data = (await ds.getData()).items
let board_set: any = {}
console.log("analyzing pin data");

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
