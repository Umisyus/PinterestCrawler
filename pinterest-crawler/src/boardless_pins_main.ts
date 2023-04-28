

// This is the main Node.js source code file of your actor.
// An actor is a program that takes an input and produces an output.
import { Dataset, log } from 'crawlee';
import fetch from 'node-fetch'
// For more information, see https://sdk.apify.com
import { Actor } from 'apify';
// For more information, see https://crawlee.dev
// import { CheerioCrawler } from 'crawlee';

// Initialize the Apify SDK

async function getData(userName = 'dracana96', THRESHOLD = 150) {
    // NODE VERSION

    const ds = await Actor.openKeyValueStore('pinterest-json')
    console.log(userName)
    let pins_url_bookmark = (userName: string, bookmark: string) => `https://www.pinterest.ca/resource/UserPinsResource/get/?source_url=%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22is_own_profile_pins%22%3Atrue%2C%22username%22%3A%22${userName}%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%2C%22bookmarks%22%3A%5B%22${bookmark}%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1670393784068`

    let query = pins_url_bookmark(userName, "")
    let list = []
    function boardless_pins_url_bookmark(userName: string, bookmark: string) {
        return `https://www.pinterest.ca/resource/BoardlessPinsResource/get/?source_url=%2F${userName}%2F&data=%7B%22options%22%3A%7B%22redux_normalize_feed%22%3Atrue,%22bookmarks%22%3A%5B%22${bookmark}%22%5D,%22userId%22%3A%22646477858918931565%22%7D,%22context%22%3A%7B%7D%7D&_=1671685984351`
    }
    async function bl_fetch(bl_query: string) {

        return await fetch(`${bl_query}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0',
                'Accept': 'application/json, text/javascript, */*, q=0.01',
                'Accept-Language': 'en',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.pinterest.ca/',
                'X-Requested-With': 'XMLHttpRequest',
                'X-APP-VERSION': '489864f',
                'X-Pinterest-AppState': 'active',
                'X-Pinterest-ExperimentHash': '9d5327b1423201aed0cceaa141c04f6e08893d7eee0cd44d34599d78f753f39736628fbb4a45a358d71e3792045f241f9a7f2a74b7316ed460741426c025e506',
                'X-Pinterest-Source-Url': '/dracana96/',
                'X-Pinterest-PWS-Handler': 'www/[username].js',
                'DNT': '1',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Connection': 'keep-alive',
                'Cookie': 'csrftoken=dc9668f0ca00bdf43f604fac15681313; _pinterest_sess=TWc9PSY5RWRYNTdTOHFJR2YxWHlQRTdsWk1FRmE0Umo4Q3B2Rk5IRzdab0lQOVlkUjF4VHY1TUQvT2djV1R0RkVaajhWemVVTGlzR0Rza2pOMDFDL0d2b0FVSVZYYzd4S0JGcGpuNU1ScWxEVnJrN1J5VWNvemdCOVNDS1V4SnhXTVFiR2JXY0lpeDFLVzE4UzhneFpxNGI2cFlXejJmamkrTWZJV05oUkdRYlhEbks0anB4bU1sOTVrdTJCOG1RNEdpV1dvWTlSQlhUQ1BUYWZXTTRjY3B5S3N3K0ZuenE3U1BpQitOR2JHTjBtRlVJdXVLNXNtZXZaRUVWV0FVVmF5QTJuMjVPbWMwam9WSVRhMUVCNVFpVEJRZzB6dTgwQ1dXd0pNL1hBd2s1enNONXhvbHRCakZxVVF6MmNRN2FPdXd5NDN6dTBDU1Npb1h2SVVybmlvQ2txUUE0MW9DRngwZVJjUm5ZMk1UZVl3eThaWjVKYVpmSVMveDFoRHJJckowZzVZbkgxdGcrd2hxMWxRcmQ3R0ZMVTEzR003UjQ3anZtcFQxZWhLTHN5M1R1dThaQWpjY2tGSjlPSEE0RmkyMDNOQlVKRURLaXJGbWhkbElIMjZ4ZDBLY2drNE45bnpKZkhkVm5lNkZRRTVWcG44K0dsdUpWZmNSclJZSXV2MmViMk5qUzFsbkVBUmN3UVpSVkVIVllEOFc5eEtzTktxMENLenBsd1JLamF0dUZDbGpCMUFpb0pnZ0MwR04rSnVEcHczTU5ldGsvQXhBVkp0c2hJb3RaSEdLejBtTzNLRlMzODRhRU0vYUhzT3VPK2hVVmhtVDkyK3doemNoaEJ6WEh5dEhCSW0vSkVLdE1EcnRtcXRkbWpFMnh1S3FQM0FWK0huVGUyeFAwbTJKRm5PbmY5c1hZR2RrZlhaT3pJUFlzUTRMcmlDeU9jVzUvU3EwcTFYdkpPdHIxdkVacktPdE9wZ0M0akhsMk9wa0NJVFZNU0kyT0pQa1UveVlBVW0vTkpOQkVjOGR3ZFZ3bHNROU51ZFcrSWZBPT0mWUxYT2k1WEw1VVJsTm94MnNYYjZwengwUWFrPQ==; _auth=1; g_state={"i_l":0}; cm_sub=allowed; _routing_id="714450c7-b75e-48db-b6ad-51be3cb55c36"; sessionFunnelEventLogged=1',
                'TE': 'trailers'
            }
        });

    }
    let bl_query = boardless_pins_url_bookmark(userName, "")
    let bl_list: any[] = []
    let bl_stop = false;
    do {

        if (bl_stop !== true) {
            console.log(bl_query)

            let bl_response_json = <any> await (await bl_fetch(bl_query)).json();
            let bl_bookmark = bl_response_json.resource.options.bookmarks[0];
            bl_query = boardless_pins_url_bookmark(userName, bl_bookmark)

            let [...bl_pins] = bl_response_json.resource_response.data
            bl_list.push(...bl_pins)
            if (bl_list.length >= THRESHOLD || bl_bookmark.includes('end')) {
                console.log('end');
                log.info(`Total # of boardless pins: ${bl_list.length}`);

                bl_list.forEach(async (pin: any) => {
                    await ds.setValue(pin.id, pin)
                })

                bl_stop = true;
                log.info('Saved boardless pins to dataset')
            }

            console.log("saved BOARDLESS PINS to DATASET");

        }



        console.log(query)
        let response_json = <any> await (await fetch(query)).json();
        let bookmark = response_json.resource.options.bookmarks[0];
        query = pins_url_bookmark(userName, bookmark)

        let [...pins] = response_json.resource_response.data
        list.push(...pins)

        log.info(`running total: ${list.length}`);

        list.map(pin => log.debug(pin.grid_title))

        if (list.length >= THRESHOLD || bookmark.includes('end')) {
            console.log('end');
            log.info(`Total # of pins: ${list.length}`);

            list.forEach(async (pin: any) => {
                await ds.setValue(pin.id, pin)
            })

            console.log("saved to file");
            break;
        }
    } while (true)

    log.info('Done, will now exit...')
}

// Get input of the actor (here only for demonstration purposes).
await Actor.init()

let { threshold, profileName } = {threshold: 100000, profileName: 'dracana96'}
//  await Actor.getInput()

log.info(`threshold: ${threshold}, profileName: ${profileName}`)
if (!profileName) throw new Error('No username specified! Please specify a username to crawl.')

await getData(profileName, threshold)

// Exit successfully
await Actor.exit();
