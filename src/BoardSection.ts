import { BoardSectionPin, BoardSectionResponse, DatumType, SectionData } from "./types/BoardSectionResponse.js";
import { Board } from "./types/BoardData.js";
import { getBoardSlug } from "./getProfileBoards.js";


async function getBoardSectionPins(profileName: string, boardSlug: string, sectionSlug: string, sectionId: string, bookmark?: string) {
    // Compose a source URL path used in query and header
    const sourceUrl = `/${profileName}/${boardSlug}/${sectionSlug}/`;

    // Compose the data object for the 'data' query param with optional bookmark
    const dataObj = {
        options: {
            page_size: 25,
            prepend: false,
            section_id: sectionId,
            bookmarks: bookmark
        },
        context: {}
    };

    // Construct the full URL
    const url = `https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(dataObj))}&_=${Date.now()}`;

    // Compose headers with dynamic parts
    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
        "Accept": "application/json, text/javascript, */*, q=0.01",
        "Accept-Language": "en",
        "X-Requested-With": "XMLHttpRequest",
        "X-APP-VERSION": "c267e1e",
        "X-Pinterest-AppState": "active",
        "X-Pinterest-Source-Url": sourceUrl,
        "X-Pinterest-PWS-Handler": `www/${profileName}/${boardSlug}/${sectionSlug}.js`,
        "screen-dpr": "1",
        "X-B3-TraceId": "48fbba6dc51594cf",
        "X-B3-SpanId": "2f6f558a3fd64d00",
        "X-B3-ParentSpanId": "48fbba6dc51594cf",
        "X-B3-Flags": "0",
        "Alt-Used": "ca.pinterest.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    };

    // Perform the fetch
    const response = await fetch(url, {
        credentials: "include",
        headers,
        referrer: "https://ca.pinterest.com/",
        method: "GET",
        mode: "cors"
    });

    // Parse and return the pins array from the response
    const json = await response.json();
    const pins = (json as BoardSectionResponse).resource_response.data;

    return pins;
}

export async function fetchBoardSectionPins(profileName: string, boardName: string, sectionName: string, sectionId: string, bookmark?: string) {
    const sourceUrl = `/${profileName}/${boardName}/${sectionName}/`;
    const dataObj = {
        options: {
            page_size: 25,
            prepend: false,
            section_id: sectionId,
            bookmarks: bookmark ? [bookmark] : []
        },
        context: {}
    };
    const url = `https://ca.pinterest.com/resource/BoardSectionPinsResource/get?source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(dataObj))}&_=${Date.now()}`;

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0',
            Accept: 'application/json, text/javascript, */*, q=0.01',
            'Accept-Language': 'en',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            Referer: 'https://ca.pinterest.com/',
            'X-Requested-With': 'XMLHttpRequest',
            'X-APP-VERSION': '4e42856',
            'X-Pinterest-AppState': 'active',
            'X-Pinterest-Source-Url': sourceUrl,
            'X-Pinterest-PWS-Handler': `www/${profileName}/${boardName}/${sectionName}.js`,
            'screen-dpr': '1',
            'X-B3-TraceId': '1ddec6b8d84d7f25',
            'X-B3-SpanId': '75986f02bf8a5eb5',
            'X-B3-ParentSpanId': '1ddec6b8d84d7f25',
            'X-B3-Flags': '0',
            DNT: '1',
            'Alt-Used': 'ca.pinterest.com',
            Connection: 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
        }
    };

    const data = await fetch(url, options)
        .then(response => response.json())
        .catch(err => console.error(err));
    return {
        data: (data as BoardSectionResponse).resource_response.data,
        bookmark: (data as BoardSectionResponse).resource?.options.bookmarks ?? [""]
    }

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
    let input = encodeURIComponent(JSON.stringify({ "options": { "board_id": board.id }, "context": {} }))
    let sections = await fetch("https://ca.pinterest.com/resource/BoardSectionsResource/get/?source_url=%2Fdracana96%2Fconcept-art%2F&data=" + input, options);
    data = (await sections.json() as unknown as BoardSectionResponse).resource_response.data as unknown as SectionData[]
    if (data !== undefined) {
        return data
    }
    return []
}


/**
 * Fetch a single page of pins for a board section using bookmark.
 */
export async function fetchBoardSectionPinsPage(
    profileName: string,
    board: Board,
    section: SectionData,
    bookmark: string
): Promise<{ data: BoardSectionPin[]; bookmark: string[] } | null> {
    const sourceUrl = `/${profileName}/${getBoardSlug(board.url)}/${section.slug}/`;

    const data = {
        options: {
            page_size: 25,
            prepend: false,
            section_id: section.id,
            bookmarks: bookmark ? [bookmark] : []
        },
        context: {}
    };

    const url = `https://ca.pinterest.com/resource/BoardSectionPinsResource/get/?source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(data))}&_=${Date.now()}`;

    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:142.0) Gecko/20100101 Firefox/142.0",
        "Accept": "application/json, text/javascript, */*, q=0.01",
        "Accept-Language": "en",
        "X-Requested-With": "XMLHttpRequest",
        "X-APP-VERSION": "c267e1e",
        "X-Pinterest-AppState": "active",
        "X-Pinterest-Source-Url": sourceUrl,
        "X-Pinterest-PWS-Handler": `www/${profileName}/${getBoardSlug(board.url)}/${section.slug}.js`,
        "screen-dpr": "1",
        "X-B3-TraceId": "48fbba6dc51594cf",
        "X-B3-SpanId": "2f6f558a3fd64d00",
        "X-B3-ParentSpanId": "48fbba6dc51594cf",
        "X-B3-Flags": "0",
        "Alt-Used": "ca.pinterest.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    };

    try {
        const response = await fetch(url, {
            credentials: "include",
            headers,
            method: "GET",
            mode: "cors",
            referrer: "https://ca.pinterest.com/"
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const json: BoardSectionResponse = await response.json();

        if (json && json.resource_response && json.resource_response.data) {
            return {
                data: json.resource_response.data,
                bookmark: json.resource?.options.bookmarks ?? []
            };
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }

    return null;
}

/**
 * Paginate through all pins in a board section by bookmark,
 * collecting, and returning all pins.
 */
export async function fetchAllBoardSectionPins(
    profileName: string,
    board: Board,
    section: SectionData
): Promise<BoardSectionPin[]> {
    const results: BoardSectionPin[] = [];
    const BOOKMARK_END = "-end-";
    let nextBookmark = "";
    let preBookmark = "";

    while (nextBookmark !== BOOKMARK_END) {
        const page = await fetchBoardSectionPinsPage(profileName, board, section, nextBookmark);

        if (!page || !page.data) {
            console.info("No data or error occurred when fetching page");
            break;
        }

        // FILTER STORY
        results.push(...page.data
            .filter(p => p.type !== DatumType.Story)
        );

        preBookmark = nextBookmark;
        nextBookmark = page.bookmark?.[0] ?? "";

        if (nextBookmark === preBookmark) {
            break; // Prevent infinite loop if bookmark does not change
        }
    }
    return results;
}

export { getBoardSectionPins, getBoardSections }