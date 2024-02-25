const cv = require('opencv4nodejs');
const fs = require('fs');
const Dropbox = require('dropbox').Dropbox;
const { setInterval } = require('timers');

const start_time = Date.now();

function takeSnapshot() {
    const num = Math.floor(Math.random() * 100) + 1;
    const videoCapture = new cv.VideoCapture(0);
    let result = true;
    while (result) {
        const frame = videoCapture.read();
        const imgName = `img${num}.png`;
        cv.imwrite(imgName, frame);
        result = false;
        return imgName;
    }
    console.log("Snapshot taken");
    videoCapture.release();
}

function uploadFile(imgName) {
    const accessToken = "tDk1b7Q0FFUAAAAAAAAAAX_yltGRd4uWP0yGZRFgHrQprT0Fm-aPbX9Pxfu7P__p";
    const fileFrom = imgName;
    const fileTo = `/Python/${imgName}`;
    const dbx = new Dropbox({ accessToken });
    fs.readFile(fileFrom, (err, contents) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        dbx.filesUpload({ path: fileTo, contents, mode: 'overwrite' })
            .then(() => console.log("File Uploaded"))
            .catch(err => console.error('Error uploading file:', err));
    });
}

function main() {
    setInterval(() => {
        if (Date.now() - start_time >= 5000) {
            const name = takeSnapshot();
            uploadFile(name);
        }
    }, 1000);
}

main();
