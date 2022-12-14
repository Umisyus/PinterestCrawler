// // Pinterest Crawler
import * as playwright from 'playwright';
// import fs from 'fs/promises';
// import { randomUUID } from 'crypto';
// import path from 'path';
import { Pin } from './types';

// // https://stackoverflow.com/a/53527984
// (async () => {
//     let __dirname = path.dirname(process.argv[1])

//     let fileName = __dirname + '/' + "crawl-test-script.js";
//     let scriptString = fs.readFile(fileName, 'utf8')

//     const browser = await playwright.chromium.launch({
//         headless: false,
//         devtools: true,
//         // slowMo: 500,
//         executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
//     });

//     const page = await browser.newPage();
//     await page.goto('https://www.pinterest.ca/dracana96/cute-funny-animals/', { waitUntil: 'domcontentloaded' });
//     await page.setViewportSize({
//         width: 1200,
//         height: 800
//     });


//     await page.waitForLoadState('networkidle');
//     await page.waitForTimeout(2000);

//     /* MAIN SCRIPT */
//     let images: Pin[] = await autoScroll(page);

//     console.log({ images });
//     let todays_date = () => {
//         // https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
//         var dateObj = new Date();
//         var month = dateObj.getUTCMonth() + 1; //months from 1-12
//         var day = dateObj.getUTCDate();
//         var year = dateObj.getUTCFullYear();

//         return year + "-" + month + "-" + day;
//     }

//     /* SAVE */
//     // write results to json file
//     // await fs.writeFile(`results-${todays_date()}_${randomUUID()}.json`, JSON.stringify({ images }))

//     await browser.close();
// })();

export async function autoScroll(page: playwright.Page): Promise<Pin[]> {
    return await page.evaluate(async () => {
        return await new Promise(async resolve => {

            async function crawl_function() {

                let selectors = {
                    // h3 with text "like this" or "like this" or "Find some ideas for this board"
                    more_like_this_text_h2_element_selector: "//h2[contains(text(), 'More ideas like') or contains(text(),'this')]",
                    find_more_ideas_for_this_board_h3_text_element_selector: "//h3[contains(text(), 'Find more') or contains(text(),'this')]",

                    pins_xpath_selector: "//div[@data-test-id='pin']",
                    pins_selector: 'div[data-test-id="pin"]',
                    video_pin_selector_1: 'div[data-test-id="pinrep-video"]',
                    video_pin_selector_2: 'div[data-test-id="PinTypeIdentifier"]',
                    video_pin_selector_3: 'div[data-test-id="pincard-video-without-link"]',
                    pin_bottom_selector: 'div[data-test-id="pointer-events-wrapper"]',
                    pin_title_selector: 'div[data-test-id="pointer-events-wrapper"] a',
                    pin_img_xpath: '//div[@data-test-id="pin"]//img', // or 'img'
                }

                // script to run in browser #117

                // V 109
                // @ts-ignore
                function parsePins(...pins) {
                    // @ts-ignore
                    return [...pins].map(i => {
                        if (i == undefined || i == null) throw Error("Failed to parse pin")

                        let img = i.querySelector('img') ?? null
                        let original_img_link = ""

                        if (img !== null) {
                            // If there's no srcset, then the image is probably from a video
                            if (img.srcset !== "") {
                                // original_img_link = img.srcset ? img.srcset.split(' ')[6] : ""
                                let srcset = img.srcset.split(' ')
                                original_img_link = srcset[srcset.length - 2] ?? ""
                            }
                        }
                        // @ts-ignore
                        let is_video = (() => [
                            selectors.video_pin_selector_1,
                            selectors.video_pin_selector_2,
                            selectors.video_pin_selector_3
                        ]
                            .some(s => i.querySelector(s) ? true : false))()

                        let pin_link = i.querySelector('a').href ?? ""
                        // @ts-ignore
                        let title = (i) => {
                            let title = [...i.querySelectorAll('a')][1].innerText ?? null
                            let pinAuthor = i.querySelector('span') == null ?
                                "Unknown" : i.querySelector('span').textContent

                            return title ? `${title} by ${pinAuthor} ` : `Untitled Pin by ${pinAuthor} `
                        }
                        // @ts-ignore
                        title = title(i)
                        is_video = is_video

                        if (original_img_link == "") {
                            // if video, return title, pin_link, is_video no image link
                            return { title, pin_link, is_video: true, image: "" }
                        }


                        if ((is_video == false) && (original_img_link !== undefined)) {
                            return { title, pin_link, is_video: false, image: original_img_link }
                            // console.log(`${ title }, ${ pin_link }, ${ is_video } `)
                        }
                        return { title, pin_link, is_video, image_link: original_img_link }
                    })
                }


                // @ts-ignore
                function $$(selector, context) {
                    context = context || document;
                    var elements = context.querySelectorAll(selector);
                    return Array.prototype.slice.call(elements);
                }

                // @ts-ignore
                function isVisible(el) {
                    console.log(el);
                    if (!el || (el === null || el === undefined)) return false;
                    return el.getBoundingClientRect().top <= window.innerHeight;
                }
                // @ts-ignore
                function $x(xp, el = document) {
                    // @ts-ignore
                    let snapshot = null
                    if (el !== undefined && el !== null) {
                        snapshot = document.evaluate(
                            xp, el, null,
                            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
                        );
                    }
                    snapshot = document.evaluate(
                        xp, document, null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
                    );

                    return [...new Array(snapshot.snapshotLength)]
                        // @ts-ignore
                        .map((_, i) => snapshot.snapshotItem(i))
                        ;
                };

                /* TODO: Make async callbacks for more data??? */
                return await new Promise((resolve) => {
                    // Quick browser test code
                    let pins = new Array()
                    let pinsMap = new Map()
                    /* SCROLLING MAY END */

                    setTimeout(() => { }, 1000)

                    // Find the "More ideas like this" text element or the "Find more ideas for this board" text element
                    // let h3 = $x("//h3[contains(text(),'Find')]")
                    // let h2 = $x("//h2[contains(text(),'like this')]")
                    let h3 = []

                    let timer = setInterval(() => {
                        h3 = $x("//h3[contains(text(),'Find')] | //h2[contains(text(),'More')]")
                        // let vis =  h3.getBoundingClientRect().top <= window.innerHeight
                        // let vis2 = h2.getBoundingClientRect().top <= window.innerHeight
                        // let vis = isVisible(h3)
                        // let vis2 = isVisible(h2)

                        let isVis = h3.some(i => isVisible(i))

                        // Scroll down
                        window.scrollBy(0, 200)

                        // @ts-ignore
                        pins.push(...[...$$('div[data-test-id="pin"]')])
                        // @ts-ignore
                        // If we see the "More ideas like this" text element or the "Find more ideas for this board" text element
                        // we can stop scrolling
                        if (isVis) {
                            clearInterval(timer)

                            // Parse results
                            let parsedPins = parsePins(...pins)
                            // @ts-ignore
                            // Add them to a Map to make them unique by pin_link
                            // check if pin_link is empty, add them to another array and add them to the map later

                            parsedPins = parsedPins
                                // @ts-ignore
                                .filter(p => p !== undefined)
                                .filter(p => p.pin_link !== undefined && p.pin_link !== null && p.pin_link !== "")

                            // @ts-ignore
                            parsedPins.forEach(p => pinsMap.set(p.pin_link, p))

                            console.log(pinsMap)

                            // return pins data
                            debugger
                            resolve([...pinsMap.values()])
                        }
                    }, 2000)

                });

            }

            let res = await crawl_function()
            // @ts-ignore
            resolve([...res])
        })
    }) as Pin[];
}
