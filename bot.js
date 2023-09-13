const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
const prompt = require("prompt-sync")();
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');


const geturlVT = async () => {
    try {
        let tiktokURL = await prompt('Input Link Video Tiktok  : ');
        const result = await TiktokDL(tiktokURL);
        // console.log(result); // 
        return result.result.video[0];
    } catch (error) {
        console.log(error);
    }
};

const downloadVT = async (getTiktokURL) => {
    try {
        const response = await fetch(getTiktokURL);
        const arrayBuffer = await response.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        const downloadDirectory = path.join(__dirname, 'video');

        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory);
        }

        fs.writeFileSync(path.join(downloadDirectory, "video.mp4"), buffer);
        console.log("Video downloaded successfully!");
    } catch (error) {
        console.log(error);
    }
};

// ...

(async () => {
    let tiktokURL = await geturlVT();
    if (tiktokURL) {
        await downloadVT(tiktokURL);
    }
})();
