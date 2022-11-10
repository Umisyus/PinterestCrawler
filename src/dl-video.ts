import { launch_login } from "./crawler.js";
import path from "path";
import fs from "fs";
import { Board, Pin } from "./types";
export async function downloadVideo(pin_link: string, pin_title: string) {
    // Downlaod video from Pinterest
    return await launch_login().then(async (page) => {
        let __dirname = path.dirname(process.argv[1]);

        let PINTEREST_DATA_DIR = path.resolve(`${__dirname + '/' + '..' + '/' + 'src' + '/' + 'storage/pinterest-boards/'}`)

        let dir = path.resolve(`${PINTEREST_DATA_DIR}/`)


        // goto pin link
        await page.goto(pin_link);
        // get video link
        let vid = await page.$eval('video', (el) => el.src);
        // download video

        let img_name = pin_title
        let dl_path = `${dir}/${img_name}.mp4`


        await page.goto(vid)
        let [download] = await Promise.all([
            page.waitForEvent('download'),
            page.evaluate(([vid, img_name]) => {
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
                return downloadImage(vid, img_name);
            },
                [vid, img_name]),
        ])

        await download.saveAs(path.resolve(dl_path))

        console.log("Downloaded video");
        console.log(`Downloaded to: ${await download.path()}`);
        let data = (await fs.promises.readFile(dl_path));
        let stream = await download.createReadStream();
        return { video_path: dl_path, data, stream };
    })
}

