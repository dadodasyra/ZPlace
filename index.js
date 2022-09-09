let fs = require('fs'),
    PNG = require('pngjs').PNG;
const XMLHttpRequest = require('xhr2');

const config = require('./config.json');

let currentColorMapping = [];
const url = "https://place-api.zevent.fr/graphql";
let totalPrice = 0;

let data = {
    'operationName': "setPixels",
    "variables": {
        "pixels": [

        ],
    },
    "query":"mutation setPixels($pixels: [PixelInput!]!) {\n  setPixels(pixels: $pixels)\n}"
};

fs.createReadStream(config.imagePath)
    .pipe(new PNG())
    .on('parsed', function() {
        let imgData = this.data;
        let width = this.width;
        let height = this.height;

        let xhrColor = new XMLHttpRequest();
        xhrColor.open("POST", url);
        xhrColor.setRequestHeader("Accept", "application/json");
        xhrColor.setRequestHeader("Content-Type", "application/json");
        xhrColor.send('{"operationName":"getAvailableColors","variables":{},"query":"query getAvailableColors {\\n  getAvailableColors {\\n    colorCode\\n    name\\n    __typename\\n  }\\n}"}');

        xhrColor.onreadystatechange = async function () {
            if (xhrColor.readyState === 4) {
                console.log(JSON.parse(xhrColor.responseText))
                let colors = JSON.parse(xhrColor.responseText).data.getAvailableColors;
                let colorsRGB = await colors.map((color) => {
                    return hexToRgb(color.colorCode);
                });

                if (config.currentImage !== "") {
                    await fs.createReadStream(config.currentImage)
                        .pipe(new PNG())
                        .on('parsed', function () {
                            console.log("Parsing global image")
                            for (let y = 0; y < this.height; y++) {
                                for (let x = 0; x < this.width; x++) {
                                    if (x % 100 === 0 || y % 100 === 0) console.log("Parsing global image : x" + x + " y" + y)
                                    let idx = (this.width * y + x) << 2;
                                    currentColorMapping[idx] = {r: this.data[idx], g: this.data[idx + 1], b: this.data[idx + 2]};
                                }
                            }
                            console.log("Parsing global image done")
                        });
                }

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let idx = (width * y + x) << 2;

                        if (imgData[idx + 3] !== 0) {
                            let currentLevel = 1;
                            let xhr = new XMLHttpRequest();
                            xhr.open("POST", url);
                            xhr.setRequestHeader("Accept", "application/json");
                            xhr.setRequestHeader("Content-Type", "application/json");

                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    let response = JSON.parse(xhr.responseText);
                                    let pixelObject = response.data.getPixelLevel;
                                    let level = pixelObject.level;
                                    let x = pixelObject.x;
                                    let y = pixelObject.y;
                                    let idx = (width * y + x) << 2;

                                    let xmlHttpRequest = new XMLHttpRequest();
                                    xmlHttpRequest.open("POST", url);

                                    xmlHttpRequest.setRequestHeader("Authorization", "Bearer " + config.token);
                                    xmlHttpRequest.setRequestHeader("Content-Type", "application/json");

                                    xmlHttpRequest.onreadystatechange = function () {
                                        if (xmlHttpRequest.readyState === 4) {
                                            console.log("Response for x " + x + " y " + y + " with level " + level + " : " + xmlHttpRequest.responseText);
                                        }
                                    }

                                    let rgb = {r: imgData[idx], g: imgData[idx + 1], b: imgData[idx + 2]};
                                    let closestColorIndex = getClosestColorIndex(idx, colorsRGB, rgb);
                                    let currentColor = currentColorMapping[idx];

                                    if (rgb["r"] !== currentColor["r"] && rgb["g"] !== currentColor["g"] && rgb["b"] !== currentColor["b"]) {
                                        totalPrice += level;

                                        console.log("Placing pixel at x " + x + " y " + y + " with level " + level + " and color " + closestColorIndex + ", current price : " + totalPrice);
                                        data["variables"]["pixels"] = [{
                                            "x": x,
                                            "y": y,
                                            "color": closestColorIndex,
                                            "currentLevel": currentLevel
                                        }];
                                        if (config.placing) xmlHttpRequest.send(JSON.stringify(data));
                                    } else console.log("Pixel at x " + x + " y " + y + " is already placed with color " + closestColorIndex+", current price : " + totalPrice);
                                }
                            };

                            let pixelLevelData = {
                                "operationName": "getPixelLevel",
                                "variables": {"pixel": {"x": x, "y": y}},
                                "query": "query getPixelLevel($pixel: PixelUpgradeInput!) {\n  getPixelLevel(pixel: $pixel) {\n    x\n    y\n    level\n    coloredBy\n    upgradedBy\n    __typename\n  }\n}"
                            };
                            xhr.send(JSON.stringify(pixelLevelData));
                        }
                    }
                }
            }
        };
    });

function getClosestColorIndex(idx, colorsRGB, rgb) {
    //find the closest color in the palette colorsRGB which contains {{r,g,b}}
    let closestColor = colorsRGB.reduce((prev, curr) => {
        return (getDistance(prev, rgb["r"], rgb["g"], rgb["b"]) < getDistance(curr, rgb["r"], rgb["g"], rgb["b"]) ? prev : curr)
    });

    //find closestColor index in colorsRGB which contains {{r,g,b}}
    return colorsRGB.findIndex((color) => {
        return color.r === closestColor.r && color.g === closestColor.g && color.b === closestColor.b;
    }) + 1;
}

function getDistance(color1, r, g, b) {
    return Math.sqrt(Math.pow(color1.r - r, 2) + Math.pow(color1.g - g, 2) + Math.pow(color1.b - b, 2));
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}