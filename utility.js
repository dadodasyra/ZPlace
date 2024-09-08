const fs = require('fs');
const PNG = require('pngjs').PNG;
const XMLHttpRequest = require('xhr2');

const INPUT_IMAGE_PATH = 'input.png'; // Path to the input PNG file
const OUTPUT_IMAGE_PATH = 'output.png'; // Path to the output PNG file
const ZPLACE_API_URL = "https://place-api.zevent.fr/graphql";

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getDistance(color1, r, g, b) {
    return Math.sqrt(Math.pow(color1.r - r, 2) + Math.pow(color1.g - g, 2) + Math.pow(color1.b - b, 2));
}

function getClosestColorIndex(colorsRGB, rgb) {
    let closestColor = colorsRGB.reduce((prev, curr) => {
        return (getDistance(prev, rgb.r, rgb.g, rgb.b) < getDistance(curr, rgb.r, rgb.g, rgb.b) ? prev : curr);
    });

    return colorsRGB.findIndex((color) => {
        return color.r === closestColor.r && color.g === closestColor.g && color.b === closestColor.b;
    });
}

function parseColors(callback) {
    let xhrColor = new XMLHttpRequest();
    xhrColor.open("POST", ZPLACE_API_URL);
    xhrColor.setRequestHeader("Accept", "application/json");
    xhrColor.setRequestHeader("Content-Type", "application/json");
    xhrColor.send('{"operationName":"getAvailableColors","variables":{},"query":"query getAvailableColors {\\n  getAvailableColors {\\n    colorCode\\n    name\\n    __typename\\n  }\\n}"}');

    xhrColor.onreadystatechange = function () {
        if (xhrColor.readyState === 4) {
            let colors = JSON.parse(xhrColor.responseText).data.getAvailableColors;
            let colorsRGB = colors.map((color) => hexToRgb(color.colorCode));
            callback(colorsRGB);
        }
    };
}

function modifyImageColors(colorsRGB) {
    fs.createReadStream(INPUT_IMAGE_PATH)
        .pipe(new PNG())
        .on('parsed', function () {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let idx = (this.width * y + x) << 2;
                    let rgb = { r: this.data[idx], g: this.data[idx + 1], b: this.data[idx + 2] };
                    let closestColorIndex = getClosestColorIndex(colorsRGB, rgb);
                    let closestColor = colorsRGB[closestColorIndex];

                    this.data[idx] = closestColor.r;
                    this.data[idx + 1] = closestColor.g;
                    this.data[idx + 2] = closestColor.b;
                }
            }

            this.pack().pipe(fs.createWriteStream(OUTPUT_IMAGE_PATH));
        });
}

parseColors(modifyImageColors);