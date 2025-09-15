//  Get pins of User
import {Datum} from "./types/PinData";
import fetch from "node-fetch";
import {Board, BoardFeedResource} from "./types/BoardData.js";
import {log} from "crawlee";

export const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
        Accept: 'application/json, text/javascript, */*, q=0.01',
        'Accept-Language': 'en',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'X-Requested-With': 'XMLHttpRequest',
        'X-APP-VERSION': '29ea70d',
        'X-Pinterest-AppState': 'active',
        'X-Pinterest-Source-Url': `//`,
        'X-Pinterest-PWS-Handler': 'www/[username].js',
        'screen-dpr': '1',
        'X-B3-TraceId': '20de15f19c649fd0',
        'X-B3-SpanId': '76747fa92d46e48e',
        'X-B3-ParentSpanId': '20de15f19c649fd0',
        'X-B3-Flags': '0',
        DNT: '1',
        'Alt-Used': 'ca.pinterest.com',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
    }
};

export async function fetchProfilePins(profileName: string): Promise<Datum | void> {


    return (await fetch(`https://ca.pinterest.com/resource/UserPinsResource/get?source_url=%2F${profileName}%2F%5E&data=%7B%0A%09%22options%22%3A%20%7B%0A%09%09%22add_vase%22%3A%20true%2C%0A%09%09%22field_set_key%22%3A%20%22mobile_grid_item%22%2C%0A%09%09%22is_own_profile_pins%22%3A%20false%2C%0A%09%09%22username%22%3A%20%22${profileName}%22%0A%09%7D%2C%0A%09%22context%22%3A%20%7B%7D%0A%7D&_=1757029653269`, options)
        .then(response => response.json() as unknown as Datum)
        .catch(err => console.error(err)));
}


export async function fetchBoardPins(profileName: string, board: Board, bookmark: string) {
    const options = {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "Accept-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-APP-VERSION": "d10b87e",
            "X-Pinterest-AppState": "background",
            "X-Pinterest-Source-Url": `${board.url}`,
            "X-Pinterest-PWS-Handler": "www/[username]/[slug].js",
            "screen-dpr": "1",
            "X-B3-TraceId": "1247eee7428b11df",
            "X-B3-SpanId": "6aa981531749129f",
            "X-B3-ParentSpanId": "1247eee7428b11df",
            "X-B3-Flags": "0",
            "Alt-Used": "ca.pinterest.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://ca.pinterest.com/",
        "method": "GET",
        "mode": "cors"
    }
    // Get last
    const boardName = board.name.split('/').filter(Boolean).pop();
    let boardData;
    let returnData = null;

    let pageSize = 200;

    boardData = await fetch(`https://ca.pinterest.com/resource/BoardFeedResource/get/?source_url=%2F${profileName}%2F${boardName}%2F&data=%7B%22options%22%3A%7B%22add_vase%22%3Atrue%2C%22board_id%22%3A%22${board.id}%22%2C%22field_set_key%22%3A%22react_grid_pin%22%2C%22filter_section_pins%22%3Afalse%2C%22is_react%22%3Atrue%2C%22prepend%22%3Afalse%2C%22page_size%22%3A${pageSize}%2C%22bookmarks%22%3A%5B%22${bookmark}%22%5D%2C%22rerankMethod%22%3A%22repin%22%7D%2C%22context%22%3A%7B%7D%7D&_=1757364346192`, options)
        .then(async r => await r.json() as BoardFeedResource)
        .then((o: BoardFeedResource) => o)
        .catch((e: Error) => {
            log.error("Failed to get pins from board: " + board.name, e);
        })
    if (boardData !== undefined) {
        returnData = {
            bookmark: boardData.resource.options.bookmarks,
            pins: boardData.resource_response.data
        }
    } else {
        log.error(`Error getting ${boardName} data!`)
    }
    return returnData
}