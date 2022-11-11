import { launch_login } from "./crawler.js";
import path from "path";
import fs from "fs";
import { Board, Pin } from "./types";
import { Page } from "playwright";
export async function downloadVideo(pin_link: string, pin_title: string, page: Page) {
    // Downlaod video from Pinterest
    let videoPage = await page.context().newPage()

    let __dirname = path.dirname(process.argv[1]);

    let PINTEREST_DATA_DIR = path.resolve(`${__dirname + '/' + '..' + '/' + 'src' + '/' + 'storage/pinterest-board/'}`)

    let dir = path.resolve(`${PINTEREST_DATA_DIR}/`)

    // goto pin link
    await videoPage.goto(pin_link, { waitUntil: "domcontentloaded" });
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
    let video_data: string;
    // Get video data pieces
    // request interception for .ts files from
    // https://v2.pinimg.com/videos/mc/hls/1d/3e/52/1d3e52206f9dc2242d5a7f17e1fe701e_360w_20210611T044510_00003.ts
    await videoPage.route('**/*', async (route, req) => {

        if (route.request().url().includes('v2.pinimg.com')) {
            console.log(`[${route.request().method()}] >> ${route.request().url()}`);

            route.continue();
            video_data += await (await req.response())?.body()

        } else {
            route.abort();
        }
    })

    // let [download] = await Promise.all([
    //     videoPage.waitForEvent('download'),
    //     videoPage.evaluate(([vid_link, img_name]) => {
    //         // @ts-ignore
    //         function downloadImage(url, fileName) {
    //             let a = document.createElement("a");
    //             a.href = url ?? window.location.href;
    //             a.download = fileName;
    //             document.body.appendChild(a);
    //             a.click();
    //             document.body.removeChild(a);
    //         };
    //         // @ts-ignore
    //         return downloadImage(vid_link, img_name);
    //     },
    //         [vid_link, img_name]),
    // ])

    // await download.saveAs(path.resolve(dl_path))

    // console.log("Downloaded video");
    // console.log(`Downloaded to: ${await download.path()}`);
    // let data = (await fs.promises.readFile(dl_path));
    // let stream = await download.createReadStream();

    await videoPage.close();
    // return { video_path: dl_path, data, stream };
}


