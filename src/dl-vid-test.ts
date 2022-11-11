import { launch_login } from "./crawler.js";
import path from "path";
import { Page } from "playwright";
import * as Playwright from "playwright";
import * as fs from "fs";

let dir = ""
export async function downloadVideo(pin_link: string, pin_title: string, page: Page) {
    // Downlaod video from Pinterest
    let videoPage = await page.context().newPage()

    let __dirname = path.dirname(process.argv[1]);

    let PINTEREST_DATA_DIR = path.resolve(`${__dirname + '/' + '..' + '/' + 'src' + '/' + 'storage/pinterest-board/'}`)

    dir = path.resolve(`${PINTEREST_DATA_DIR}/`)

    // goto pin link
    // get video link
    // let vid = await videoPage.$eval('video', (el) => el.src);
    // reemove blob from link
    // let vid_link = vid.replace('blob:', '');
    // let vid_link = vid

    // download video
    // let img_name = pin_title
    // let dl_path = `${dir}/${img_name}_video.mp4`


    // await videoPage.goto(vid_link)

    // await page.click('video')
    let video_data: any[] = [];
    // Get video data pieces
    // request interception for .ts files from
    // https://v2.pinimg.com/videos/mc/hls/1d/3e/52/1d3e52206f9dc2242d5a7f17e1fe701e_360w_20210611T044510_00003.ts
    await videoPage.route('**/*', async (route, req) => {
        let requestUrl = route.request().url()
        switch (!!requestUrl) {
            case requestUrl.includes('.ts'):
                console.log("Video data piece found");
                let resp = (await req.response())
                if (resp) {
                    console.log("Response found");

                    let body = await resp.body()
                    video_data.push(body)
                }
                else {
                    console.log("No response body found");
                }
                break;
            case requestUrl.includes('.mp4'):

                console.log("Video Located!!!", await (await req.response())?.body());
                console.log(requestUrl);

                page.waitForResponse(requestUrl)

                let response = (await route.request().response())
                let respTxt = response?.text

                console.log("Response text: ", respTxt);
                await page.goto(requestUrl)

                let { download_path } = await directDownload(requestUrl, page)
                console.log("Downloaded to: ", download_path);

                break;
            default:
                break;
        }
        // if (route.request().url().includes('.ts') || route.request().url().includes('.mp4') || route.request().url().includes('v2.pinimg.com')) {
        //     console.log(`[${route.request().method()}] >> ${route.request().url()}`);

        //     // Copy respone body (video chunks) to video_data
        //     let resp = (await req.response())
        //     if (resp) {
        //         let body = await resp.body()
        //         video_data.push(body)
        //     }

        //     // video_data = await (await req.response())?.body() ?? ''
        // }
        route.continue();
    })

    await videoPage.goto(pin_link, { timeout: 0 });
    await videoPage.waitForTimeout(1_000)
    // button with text
    await page.locator('button', { hasText: "Watch again" }).isVisible() === true

    debugger
console.log("Done");


    await videoPage.context().close();
    // return { video_path: dl_path, data, stream };
}

launch_login().then(async (page) =>
    downloadVideo('https://www.pinterest.ca/pin/646477721514096441/', 'pinterest-video', page))


async function directDownload(link: string, page: Playwright.Page, dl_path: string = dir) {
    let [download] = await Promise.all([
        page.waitForEvent('download'),
        page.evaluate(([link, img_name]) => {
            // @ts-ignore
            function downloadImage(url, fileName) {
                let a = document.createElement("a");
                a.href = url ?? window.location.href;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            // @ts-ignore
            return downloadImage(link, img_name);
        },
            [link, "broswer-download"]),
    ])
    let sugg_name = download.suggestedFilename()
    let download_path = path.resolve(`${dl_path}/${sugg_name}`)
    await download.saveAs(path.resolve(download_path))

    console.log("Downloaded to: ", download_path);
    console.log(`Downloaded to: ${await download.path()}`);
    let data = (await fs.promises.readFile(download_path));
    let stream = await download.createReadStream();

    return { download_path, data, stream };
}
