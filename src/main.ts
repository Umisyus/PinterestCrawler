import { Dataset, Dictionary, KeyValueStore, log } from 'crawlee';
import { Actor } from 'apify';
import fetch from 'node-fetch'
import cheerio from 'cheerio'

// Initialize the Apify SDK
await Actor.init()

// Get input of the actor.

let { threshold = 10, profileName, json_dataset = `pinterest_json`, MAX_TIME = 65_000 }
    //= {threshold:10,profileName:`dracana96`,json_dataset:`pins_json`}
    = await Actor.getInput<any>();

try {
    log.info(`threshold: ${threshold}, profileName: ${profileName}`)
    if (new URL(profileName)) profileName = await parseFromPage(profileName)

    if (profileName == undefined || profileName == null || profileName === '') {
        throw new Error('profileName was invalid! Please specify a valid profileName to crawl.')
    }
    const regex = /[\s\,\/\:]/ig;

    let fmt_ds_name = (s: string) =>
        s
            .replace(regex, '-')
            .replace(/-{2,}/, '_')
            .replace(/-$/, '')
            .replace(/^-/, '')
            .replace(/_/g, '-')

    let d_str = fmt_ds_name(json_dataset)

    await getData(profileName, threshold, d_str)

} catch (e) {
    console.error(e);
    await Actor.exit({ exitCode: 1 })
}

// Exit successfully
await Actor.exit();

async function getData(userName: string, THRESHOLD = 100, json_dataset_name: string) {
    // NODE VERSION
    console.log(`Saving to: ${json_dataset}`);

    const ds = await Actor.openKeyValueStore(json_dataset_name)
    const ds_s = await Actor.openDataset(json_dataset_name)

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
    let go: boolean = true

    const startTime = Date.now()
    let isTimedOut = () => Date.now() - startTime > MAX_TIME

    do {
        let response_json = <any> await (await fetch(query)).json();
        let bookmark = response_json.resource.options.bookmarks[0];

        // Add the boardless pins to the list
        if (bl_stop == false) {
            let bl_response_json = <any> await (await bl_fetch(bl_query)).json();
            let bl_bookmark = bl_response_json.resource.options.bookmarks[0];
            query = pins_url_bookmark(userName, bookmark)
            bl_query = boardless_pins_url_bookmark(userName, bl_bookmark)

            let [...bl_pins] = bl_response_json.resource_response.data
            bl_list.push(...bl_pins)

            if (bl_list.length >= THRESHOLD || bl_bookmark.includes('end')) {
                console.log('end');
                log.info(`Total # of boardless pins: ${bl_list.length}`);

                await saveToKVS(bl_list, ds)
                await saveToDataset(bl_list, ds_s)
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
            await saveToDataset(list, ds_s)
            await saveToDataset(list, await Actor.openDataset())

            go = false
            console.log("Saving Complete.");
            break
        }

        // Refresh the query with the new bookmark
        response_json = <any> await (await fetch(query)).json();
        bookmark = response_json.resource.options.bookmarks[0];
        query = pins_url_bookmark(userName, bookmark)

        if (go !== true) {
            break
        }

    } while (go == true || isTimedOut())

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
async function saveToDataset(data: any[], ds: Dataset<Dictionary>) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await ds.pushData(element)
    }
}
async function bl_fetch(bl_query: string) {

    return await fetch(`${bl_query}`);

}

async function parseFromPage(profileName: any): Promise<string | null> {
    try {
        let profile_url = new URL(profileName).href
        if (profile_url.includes('it')) {
            profile_url = (await fetch(profile_url)).url
        }

        const bd = await (await fetch(profile_url)).text()

        const $ = cheerio.load(bd);
        const id_xpath = ('//span[contains(text(),"Art")]')
        // Remove the @ sign from the profile handle
        return $('span').first().text().replace('@', '');

    } catch (error) {
        log.error("FAILED TO PARSE PROFILE ID FROM HTML.");
        return null
    }
}
