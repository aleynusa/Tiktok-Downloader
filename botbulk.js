const fs = require('fs');
const { ttdl } = require('btch-downloader');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const crypto = require('crypto');

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

const fortest = async () => {
    try {
        const fileURLs = fs.readFileSync('./url.txt', 'utf-8').split('\r\n');
        return fileURLs;
    } catch (error) {
        console.log('Error reading file URLs:', error);
        return [];
    }
}

const getLink = async (url) => {
    try {
        const res = await ttdl(url);
        return res.video[0];
    } catch (error) {
        console.log('Link Error:', error);
        return null;
    }
}

const downloadVT = async (getTiktokURL) => {
    try {
        const randomString = generateRandomString(5);
        const response = await fetch(getTiktokURL);
        const totalBytes = response.headers.get('content-length');
        let downloadedBytes = 0;

        const downloadDirectory = path.join(__dirname, 'video');

        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory);
        }

        const writeStream = fs.createWriteStream(path.join(downloadDirectory, randomString + '.mp4'));

        response.body.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            const percentComplete = (downloadedBytes / totalBytes) * 100;
            process.stdout.clearLine(); 
            process.stdout.cursorTo(0); 
            process.stdout.write(`Sedang Mendownload Video ${percentComplete.toFixed(2)}%`);
        });

        response.body.pipe(writeStream);

        await new Promise((resolve) => {
            writeStream.on('finish', resolve);
        });

        process.stdout.write('\n'); 
        // console.log(`Video downloaded successfully`);
    } catch (error) {
        console.log(error);
    }
};

(async () => {
    const fileURLs = await fortest();

    for (const url of fileURLs) {
        const videoURL = await getLink(url);
        if (videoURL) {
            await downloadVT(videoURL);
        }
    }
})();
