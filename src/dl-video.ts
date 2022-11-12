import path from "path";
import fs from "fs/promises";
import { createReadStream } from 'fs';
import { Page } from "playwright";
import Playwright from "playwright";
import concat from 'ffmpeg-concat';
import glob from 'glob';
// const watch_text_selector = '//*[@id="__PWS_ROOT__"]/div[1]/div[2]/div/div/div/div/div[2]/div/div/div/div/div[2]/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div[1]/div/div/div[2]/div/div[2]/div/div/h3'
const watch_text_selector = 'h3'
let dir = ''
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
    let video_data: Buffer[] = [];
    // Get video data pieces
    // request interception for .ts files from
    // https://v2.pinimg.com/videos/mc/hls/1d/3e/52/1d3e52206f9dc2242d5a7f17e1fe701e_360w_20210611T044510_00003.ts
    await videoPage.route('**/*', async (route, req) => {
        let requestUrl: string = route.request().url()
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
                    let text = await resp.text()
                    console.log({ body });

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

                let { download_path, data, stream } = await directDownload(requestUrl, page)
                console.log("Downloaded to: ", download_path);
                return { download_path, data, stream };
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
    })

    await videoPage.goto(pin_link, { timeout: 0 });

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

        let res = video_data.map(async (data: Buffer, i) => {
            let fpath = `${dir}/video_data-part-${i}.ts`
            await fs.writeFile(fpath, data, { encoding: 'utf8' })
                .then(() => console.log("File written successfully to: ", fpath))
                .catch((err) => console.log(`Failed to write file: ${err}`))
            // merge video files
            let vid_files = await fs.readdir(dir)
            let video_file_data = await mergeVideoFiles(vid_files, dir, "pinterest-video.mp4")
            // console.log("Downloaded video data part: ", fpath);
            return { download_path: fpath, data: video_file_data }
        });
        return { ...res }
    }
    await videoPage.context().close();

}


async function directDownload(link: string, page: Playwright.Page, dl_path: string = dir) {
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
            [link, "broswer-download"]),
    ])

    let sugg_name = download.suggestedFilename()
    let download_path = path.resolve(`${dl_path}/${sugg_name}`)
    await download.saveAs(path.resolve(download_path))

    console.log("Downloaded to: ", download_path);
    console.log(`Downloaded to: ${await download.path()}`);
    let data = (await fs.readFile(download_path));
    let stream = await download.createReadStream();

    return { download_path, data, stream };
}


async function mergeVideoFiles(videoDataDir: string[], outDir: string, fileName: string = 'merged_video.mp4') {


    //an array of video path to concatenate
    // read all files
    let videos = videoDataDir

    const output = fileName

    //a function to merge an array of videos with custom music
    //and a transition fadegrayscale of 500ms duration between videos.
    async function oneTransitionMergeVideos() {
        await concat({
            output: `${outDir}/${output}`,
            videos,
            // audio: "/home/username/Downloads/music/music.m4a",
        })
    }
    await oneTransitionMergeVideos()
}

