// get all boards
import fetch from "node-fetch";
import {Board, BoardFeedResource, BoardPinData} from "./types/BoardData.js";
import * as url from "node:url";

export async function getProfileBoards(profileName: string) {
    let url = `https://ca.pinterest.com/resource/BoardsResource/get/?source_url=%2F${profileName}%2F_saved%2F&data=%7B%22options%22%3A%7B%22privacy_filter%22%3A%22all%22%2C%22sort%22%3A%22last_pinned_to%22%2C%22field_set_key%22%3A%22profile_grid_item%22%2C%22filter_stories%22%3Afalse%2C%22username%22%3A%22${profileName}%22%2C%22page_size%22%3A25%2C%22group_by%22%3A%22visibility%22%2C%22include_archived%22%3Atrue%2C%22redux_normalize_feed%22%3Atrue%2C%22filter_all_pins%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1757105217784`;
    let b: Board[] = [];

    const result = (await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*, q=0.01",
            "accept-language": "en-US,en;q=0.7",
            "priority": "u=1, i",
            "screen-dpr": "1.5625",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Brave\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-full-version-list": "\"Not;A=Brand\";v=\"99.0.0.0\", \"Brave\";v=\"139.0.0.0\", \"Chromium\";v=\"139.0.0.0\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": "\"\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-ch-ua-platform-version": "\"19.0.0\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-app-version": "b83c95f",
            "x-b3-flags": "0",
            "x-b3-parentspanid": "55a04647bc1e3668",
            "x-b3-spanid": "6ea1896480f439cf",
            "x-b3-traceid": "55a04647bc1e3668",
            "x-pinterest-appstate": "active",
            "x-pinterest-pws-handler": "www/[username]/_saved.js",
            "x-pinterest-source-url": `/${profileName}/_saved/`,
            "x-requested-with": "XMLHttpRequest"
        },
        "body": null,
        "method": "GET"
    })
        .then(async p => await p.json()).then(json => {
            return (json as BoardFeedResource).resource_response.data as unknown as Board[]
        }));
    b.push(...result)
    // Remove the story element, keep board elements
    b.shift()
    return b;
}

export function getBoardSlug(url: String) {
    return url.split('/', 3).filter(Boolean).pop()!
}
