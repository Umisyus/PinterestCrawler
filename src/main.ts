import { KeyValueStore, log } from 'crawlee';
import { Actor } from 'apify';
import fetch from 'node-fetch'

// Initialize the Apify SDK
 await Actor.init()

// Get input of the actor.

let { threshold, profileName, json_dataset } = await Actor.getInput<any>();
console.log(profileName, threshold);

log.info(`threshold: ${threshold}, profileName: ${profileName}`)
if (!profileName) throw new Error('No username specified! Please specify a username to crawl.')

const regex = /[\s\,\/\:]/ig;

let s = new Date().toLocaleString()
  s.replace(regex, '-')
  .replace(/-{2,}/,'_')
  .replace(/-$/,'')
  .replace(/^-/,'')


await getData(profileName, threshold, json_dataset ?? 'pinterest-json ' + s)

// Exit successfully
await Actor.exit();

async function getData(userName:string, THRESHOLD = 100, json_dataset:string) {
    // NODE VERSION
console.log(`Saving to: ${json_dataset}`);

    const ds = await Actor.openKeyValueStore(json_dataset)

    console.log(userName)
    let pins_url_bookmark = (userName: string, bookmark: string) => `https://www.pinterest.ca/resource/UserPinsResource/get/?source_url=%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22is_own_profile_pins%22%3Atrue%2C%22username%22%3A%22${userName}%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%2C%22bookmarks%22%3A%5B%22${bookmark}%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1670393784068`
    function boardless_pins_url_bookmark(userName: string, bookmark: string) {
        return `https://www.pinterest.ca/resource/BoardlessPinsResource/get/?source_url=%2F${userName}%2F&data=%7B%22options%22%3A%7B%22redux_normalize_feed%22%3Atrue,%22bookmarks%22%3A%5B%22${bookmark}%22%5D,%22userId%22%3A%22646477858918931565%22%7D,%22context%22%3A%7B%7D%7D&_=1671685984351`
    }

    let query = pins_url_bookmark(userName, "")
    let bl_query = boardless_pins_url_bookmark(userName, "")
    let list: any[] = []
    let bl_list = []
    let bl_stop = false;
    let go = true
    do {
        let response_json = <any>await (await fetch(query)).json();
        let bookmark = response_json.resource.options.bookmarks[0];

        // Add the boardless pins to the list
        if (bl_stop == false) {
            let bl_response_json = <any>await (await bl_fetch(bl_query)).json();
            let bl_bookmark = bl_response_json.resource.options.bookmarks[0];
            query = pins_url_bookmark(userName, bookmark)
            bl_query = boardless_pins_url_bookmark(userName, bl_bookmark)

            let [...bl_pins] = bl_response_json.resource_response.data
            bl_list.push(...bl_pins)

            if (bl_list.length >= THRESHOLD || bl_bookmark.includes('end')) {
                console.log('end');
                log.info(`Total # of boardless pins: ${bl_list.length}`);

                await saveToKVS(bl_list, ds)

                bl_stop = true;
                log.info('Saved boardless pins to dataset')
            }

        }

        // Add the pins to the list
        let [...pins] = response_json.resource_response.data
        list.push(...pins)
        log.info(`Running total: ${list.length}`);

        if (list.length >= THRESHOLD || bookmark.includes('end')) {
            log.info(`Total # of pins: ${list.length}`);

            await saveToKVS(list, ds)
                .then(() => {
                    go = false
                    console.log("Saving Complete.");
                })
        }

        // Refresh the query with the new bookmark
        response_json = <any>await (await fetch(query)).json();
        bookmark = response_json.resource.options.bookmarks[0];
        query = pins_url_bookmark(userName, bookmark)
    } while (go)

    const normalPinsLen = list.length;
    const boardlessPinsLen = bl_list.length;

    log.info(`Total # of pins: ${normalPinsLen}`);
    log.info(`Total # of boardless pins: ${boardlessPinsLen}`);

    log.info(`GRAND TOTAL: ${normalPinsLen + boardlessPinsLen}`)
    log.info(`Saved pins to dataset ${ds.name ?? ds.id} successfully!`)
    log.info('Done, will now exit...')
}

async function saveToKVS(data: any[], ds: KeyValueStore) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await ds.setValue(element.id, element)
    }
}
async function bl_fetch(bl_query: string) {

    return await fetch(`${bl_query}`, {
        headers: {
            // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0',
            // 'Accept': 'application/json, text/javascript, */*, q=0.01',
            // 'Accept-Language': 'en',
            // 'Accept-Encoding': 'gzip, deflate, br',
            // 'Referer': 'https://www.pinterest.ca/',
            // 'X-Requested-With': 'XMLHttpRequest',
            // 'X-APP-VERSION': '489864f',
            // 'X-Pinterest-AppState': 'active',
            // 'X-Pinterest-PWS-Handler': 'www/[username].js',
            // 'DNT': '1',
            // 'Sec-Fetch-Dest': 'empty',
            // 'Sec-Fetch-Mode': 'cors',
            // 'Sec-Fetch-Site': 'same-origin',
            // 'Connection': 'keep-alive',
            // 'TE': 'trailers'
        }
    });

}
