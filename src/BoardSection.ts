import {BoardSectionResponse, SectionData} from "./BoardSectionResponse";
import {Board} from "./BoardData";

async function getBoardSectionPins(profileName: string, board: Board, section: SectionData, bookmark: string) {

    const options = {
        method: 'GET',
        headers: {
            cookie: 'csrftoken=90b8426d075425197a2294661b6e14d3; _pinterest_sess=TWc9PSZDZEhTbGZVbGIxeXBTcnhNOHd5cUg1VUIxMzUyNHhaU1I5YjNoZWFmdTZHbFZrRFBkNGVlM2xkbytrbFRtNU1peUFrdFZSTXJaN2RuOU5VTVA1QUloMDBiNW41elU1ZklzZEVSVFpaYmxwbz0maDBNWmg0dEh2ZFloRWJFWStubG8yM0NkNXUwPQ%3D%3D; _auth=0',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0',
            Accept: 'application/json, text/javascript, */*, q=0.01',
            'Accept-Language': 'en',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            Referer: 'https://ca.pinterest.com/',
            'X-Requested-With': 'XMLHttpRequest',
            'X-APP-VERSION': '4e42856',
            'X-Pinterest-AppState': 'active',
            'X-Pinterest-Source-Url': '/dracana96/concept-art/creatures/',
            'X-Pinterest-PWS-Handler': 'www/[username]/[slug]/[section_slug].js',
            'screen-dpr': '1',
            'X-B3-TraceId': '1ddec6b8d84d7f25',
            'X-B3-SpanId': '75986f02bf8a5eb5',
            'X-B3-ParentSpanId': '1ddec6b8d84d7f25',
            'X-B3-Flags': '0',
            DNT: '1',
            'Alt-Used': 'ca.pinterest.com',
            Connection: 'keep-alive',
            Cookie: 'csrftoken=088b2b9080a0a920a3160a70638838f7; _pinterest_sess=TWc9PSYxRjljVW56K3dISm12MjN1MVRtWldreC91SVljbmJGNHl2eTZrTmIxZVg4WU9FaW9qT29aRzh3MUJYTHpZdnF3NWF5YkRDL3gzOEQwSkdJS20xUUo1WC9ieFNNbzkzNE1ZOXY4eGQvOFVkUT0mcGRCOEJJYVZ4b2xuYU85QmJmcXVSVjRpdDVFPQ==; _auth=0; _routing_id="46715fc0-cba3-40e0-8cbb-2418ef0d22e5"; sessionFunnelEventLogged=1',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
        }
    };

    let json: SectionData[] = await fetch('https://ca.pinterest.com/resource/BoardSectionPinsResource/get?source_url=%2Fdracana96%2Fconcept-art%2Fcreatures%2F&data=%7B%22options%22%3A%7B%22page_size%22%3A25%2C%22prepend%22%3Afalse%2C%22section_id%22%3A%225240292013187850544%22%2C%22bookmarks%22%3A%5B%22LT42NDY0Nzc3MjE1MTUzMzk2NTN8NDl8NDZ8NzYyMTIzNzI5NDczMTE3OCpHUUwqfGExNTllMjYwNzI3YzlhZDlhYWRlZGMxODA1N2UyOTVjNjM3OTQ0MTVlNmU2YzZmZTMyMzI4N2M0NTcyYmVmYTd8TkVXfA%3D%3D%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1757561989525', options)
        .then(response => response.json())
        .then(response => response)
        .catch(err => console.error(err));
    if (json && "resource_response" in json) {
        const data = (json as unknown as BoardSectionResponse).resource_response.data;
        return data
    }
    return []
// // Fetch
//
//     let headers = {
//         // "credentials": "include",
//         "headers": {
//             "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
//             "Accept": "application/json, text/javascript, */*, q=0.01",
//             "Accept-Language": "en",
//             "X-Requested-With": "XMLHttpRequest",
//             "X-APP-VERSION": "4e42856",
//             "X-Pinterest-AppState": "active",
//             "X-Pinterest-Source-Url": "/dracana96/concept-art/creatures/",
//             "X-Pinterest-PWS-Handler": "www/[username]/[slug]/[section_slug].js",
//             "screen-dpr": "1",
//             "X-B3-TraceId": "1ddec6b8d84d7f25",
//             "X-B3-SpanId": "75986f02bf8a5eb5",
//             "X-B3-ParentSpanId": "1ddec6b8d84d7f25",
//             "X-B3-Flags": "0",
//             "Alt-Used": "ca.pinterest.com",
//             "Sec-Fetch-Dest": "empty",
//             "Sec-Fetch-Mode": "cors",
//             "Sec-Fetch-Site": "same-origin",
//             DNT: '1',
//             Connection: 'keep-alive',
//             'Accept-Encoding': 'gzip, deflate, br, zstd',
//             cookie: 'csrftoken=90b8426d075425197a2294661b6e14d3; _pinterest_sess=TWc9PSZDZEhTbGZVbGIxeXBTcnhNOHd5cUg1VUIxMzUyNHhaU1I5YjNoZWFmdTZHbFZrRFBkNGVlM2xkbytrbFRtNU1peUFrdFZSTXJaN2RuOU5VTVA1QUloMDBiNW41elU1ZklzZEVSVFpaYmxwbz0maDBNWmg0dEh2ZFloRWJFWStubG8yM0NkNXUwPQ%3D%3D; _auth=0',
//
//         },
//         "referrer": "https://ca.pinterest.com/",
//         "method": "GET",
//         // "mode": "cors"
//     };
//
//
//     let input = encodeURIComponent(JSON.stringify(
//         {
//             "page_size": 25,
//             "prepend": false,
//             "section_id": section.id,
//             "bookmarks": [`${bookmark}`]
//         }));
//
//     let resp = await fetch(`https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=%2F${profileName}%2F${getBoardSlug(board.url)}%2F${section.title}%2F&data=` + input + "&_=1757561989525", headers);
//     let json = await resp.json() as BoardSectionResponse
//     if (json && "resource_response" in json) {
//         if ("json.resource_response.data" in json) {
//             return json.resource_response.data as unknown as BoardSectionPin[]
//         }
//     }
}

async function getBoardSections(board: Board) {
    let options = {
        // "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
            "Accept": "application/json, text/javascript, */*, q=0.01",
            "Accept-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-APP-VERSION": "4e42856",
            "X-Pinterest-AppState": "background",
            "X-Pinterest-Source-Url": "/dracana96/concept-art/",
            "X-Pinterest-PWS-Handler": "www/[username]/[slug].js",
            "screen-dpr": "1",
            "X-B3-TraceId": "0a810140b4ffb0d4",
            "X-B3-SpanId": "67796b20f01c32e4",
            "X-B3-ParentSpanId": "0a810140b4ffb0d4",
            "X-B3-Flags": "0",
            "Alt-Used": "ca.pinterest.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=0"
        },
        "referrer": "https://ca.pinterest.com/",
        "method": "GET",
        // "mode": "cors"
    }
    let data: SectionData[]
    let input = encodeURIComponent(JSON.stringify({"options": {"board_id": board.id}, "context": {}}))
    let sections = await fetch("https://ca.pinterest.com/resource/BoardSectionsResource/get/?source_url=%2Fdracana96%2Fconcept-art%2F&data=" + input, options);
    data = (await sections.json() as unknown as BoardSectionResponse).resource_response.data
    if (data !== undefined) {
        return data
    }
    return []
}

let bookmark = "";
let profileName = "";
//
// (async () => {
//
//     let boards = await getProfileBoards(profileName);
//
//     let sections = await getBoardSections(boards[0]);
//
//     let pins = await getBoardSectionPins(profileName, boards[0], sections[0], bookmark);
//
//     console.info({pins})
// })()

export {getBoardSectionPins, getBoardSections}