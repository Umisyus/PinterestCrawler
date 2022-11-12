import path from "path";
import fsPromises from "fs/promises";
import fs from "fs";
import { Page } from "playwright";
import Playwright from "playwright";

import { launch_login } from "./crawler.js";
import Ffmpeg from "fluent-ffmpeg";
// const watch_text_selector = '//*[@id="__PWS_ROOT__"]/div[1]/div[2]/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div[1]/div/div/div[2]/div/div[2]/div/div/h3'
const watch_text_selector = 'h3'
let dir = ''
export async function downloadVideo(pin_link: string, pin_title: string, page: Page) {
    // Downlaod video from Pinterest
    let videoPage = await page.context().newPage()

    let __dirname = path.dirname(process.argv[1]);

    let PINTEREST_DATA_DIR = path.resolve(`${__dirname + '/' + '..' + '/' + 'src' + '/' + 'storage/pinterest-board/'}`)

    dir = path.resolve(`${PINTEREST_DATA_DIR}/`)

    let video_data: Buffer[] = [];
    let expected_video_data: {} = {}

    // Get video data pieces
    // request interception for .ts files from
    // https://v2.pinimg.com/videos/mc/hls/1d/3e/52/1d3e52206f9dc2242d5a7f17e1fe701e_360w_20210611T044510_00003.ts
    await videoPage.route('**/*', async (route, req) => {
        let isFragmented = true
        let breakCounter = 0
        // do {
        let requestUrl = route.request().url()
        route.continue();
        switch (!!requestUrl) {
            case requestUrl.includes('.ts'):

                console.log("Video data piece found");

                let resp = (await req.response().catch((err) => console.log(err)))

                // let text = await resp?.text()
                // // video_data.push(text)
                // console.log({ text });

                if (resp) {
                    console.log("Response found");

                    let body = await resp.body()
                        .catch((err) => console.log(err))
                    let text = await resp.text()
                        .catch((err) => console.log(err))

                    if (body) {
                        console.log({ body });
                        video_data.push(body)
                        isFragmented = true

                        if (video_data.filter((data, i, video_data) => video_data.indexOf(data) !== i)) {
                            console.log("Video data pieces collected");
                            isFragmented = false
                            break
                        }
                    }

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

                let { download_path, data, stream } = await directDownload(requestUrl, dir, pin_title, page)
                console.log("Downloaded to: ", download_path);
                expected_video_data = { download_path, data, stream }
                isFragmented = false
                break
                // return { download_path, data, stream };
                break;
            default:
                console.log("No video data found");
                breakCounter++
                break;
        }
        // }
        // while (isFragmented == true && breakCounter < 20)
    })

    console.log("Goto pin link");
    await videoPage.goto(pin_link, { timeout: 60_000 })
        .catch((err) => console.log(`Could not go to pin link:`, `${err}`));

    await page.$eval('video', (el => el.play()))
        .catch((err) => console.log(`No video element found!`, `${err}`))

    let is_watch_text = false;
    do {
        await videoPage.waitForTimeout(1_000)
        // Watch video until text appears
        is_watch_text = await videoPage.getByRole("button", { name: 'Watch again' }).isVisible()
        //  await (await page.$(watch_text_selector))?.isVisible()

        // button with text
    } while (is_watch_text == false);

    debugger

    if (is_watch_text) {
        let data = {}
        console.log({ video_data });
        if (video_data.length > 0) {


            video_data.map(async (data: Buffer, i) => {
                let fpath: string = `${dir}/video_data-part-${i}.ts`
                await fsPromises.writeFile(fpath, data, { encoding: 'utf8' })
                    .then(() => console.log("File written successfully to: ", fpath))
                    .catch((err) => console.log(`Failed to write file: ${err}`))
                // merge video files
            });
            // Read vid parts
            let vid_files = await fsPromises.readdir(dir)
            // Merge video files
            let { filePath: mergedFilePath, stream } = await mergeVideoFiles(vid_files, dir, pin_title + '.mp4')
            // Provide merged video file
            expected_video_data = { download_path: mergedFilePath, stream }
            // return { ...res }
        }
        else {
            console.log("No video data found");
        }
    }
    console.log("Done");

    // console.log('Closing video page');

    // await videoPage.context().close();

    console.log("Video data: ", expected_video_data);

    return expected_video_data ?? {}
}

async function directDownload(link: string, fileName: string = 'pinterest-video.mp4', dl_path: string = dir, page: Playwright.Page) {
    let [download] = await Promise.all([
        page.waitForEvent('download'),
        //@ts-ignore
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
            [link, fileName]),
    ])

    let sugg_name = download.suggestedFilename()
    let download_path = path.resolve(`${dl_path}/${sugg_name}`)
    await download.saveAs(path.resolve(download_path))

    console.log("Downloaded to: ", download_path);
    console.log(`Downloaded to: ${await download.path()}`);
    let data = (await fsPromises.readFile(download_path));
    let stream = await download.createReadStream();

    return { download_path, data, stream };
}


async function mergeVideoFiles(videoDataPaths: string[], outPath: string, videoFileName: string = 'merged_video.mp4') {
    const mergedFilePath = path.resolve(`${outPath}/${videoFileName}`);

    const ffmpeg = Ffmpeg({ source: videoDataPaths[0], niceness: 19 })

    for (const vid of videoDataPaths) {
        console.log("Adding video file: ", vid);
        ffmpeg.input(vid)
    }

    console.log("Merging video files...");
    ffmpeg.mergeToFile(mergedFilePath)

    if (await isFile(mergedFilePath)) {
        console.log("Video file merged successfully to: ", mergedFilePath);
        let vidStream = fs.createReadStream(mergedFilePath)

        return { filePath: mergedFilePath, stream: vidStream }
    }

    console.log("Failed to merge video files");

    return { filePath: null, stream: null }
}
async function isFile(path: string) {
    return (await fsPromises.stat(path)).isFile()
}

await launch_login().then(async (page) => {
    // page.context().storageState({ path: '../storage/storageState.json' })
    const pin_link = "https://www.pinterest.ca/pin/646477721513976288/";
    const fileName = 'pinterest-video-pin';
    await downloadVideo(pin_link, fileName, page)
        .catch((err) => console.log(`Failed to download video:`, `${err}`))
        .finally(async () => {
            await page.context().close();
        })
})
