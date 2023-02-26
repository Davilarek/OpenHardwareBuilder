function setup() {
    const generatorsWorker = new Worker("./generators.js");

    let mirroredPdfParserURL = "";
    Object.defineProperty(window, "PDF_PARSER_SERVICE_URL", {
        set: function (url) {
            generatorsWorker.postMessage(JSON.stringify(
                {
                    "event": "SET window.PDF_PARSER_SERVICE_URL",
                    "data": url
                }
            ));
            mirroredPdfParserURL = url;
        },
        get: function () {
            return mirroredPdfParserURL;
        }
    });
    generatorsWorker.onmessage = function (data) {
        // const parsedData = JSON.parse(data.data);
        // /**
        //  * @type {string}
        //  */
        // const event = parsedData.event;
        // /**
        //  * @type {string}
        //  */
        // const actionData = parsedData.data;

        // if (event.startsWith("FUNC ")) {
        //     const funcName = event.split("FUNC ")[1];
        //     if (actionData.startsWith("|")) {
        //         const secondFuncData = actionData.split("|")[1];
        //         const out = (Function('"use strict";return (' + funcName + "(" + secondFuncData + ")" + ')')());
        //     }
        //     else {
        //         const out = (Function('"use strict";return (' + funcName + "(" + "\"" + actionData + "\"" + ")" + ')')());
        //     }
        // } else if (event.startsWith("SET ")) {
        //     const varName = event.split("SET ")[1];
        //     const out = (Function('"use strict";return (' + varName + "=" + "\"" + actionData + "\"" + ')')());
        // }
        execActionWithData(data);
    }

    /**
     * @type {HTMLInputElement}
     */
    const input = document.getElementById("inputData");
    /**
     * @type {HTMLButtonElement}
     */
    const searchButton = document.getElementById("searchButton");
    /**
     * @type {HTMLSelectElement}
     */
    const productBandDropdown = document.getElementById("productBandDropdown");

    const isProductOK = document.getElementById("isOk");

    const yesProductOK = document.getElementById("yesOk");
    const notProductOK = document.getElementById("notOk");

    const pdfParserServiceUrlInput = document.getElementById("pdf-parser-service-url");

    const loadingScreen = document.getElementById("loading");

    function generateLoadingAnimation(frames, frameChar, outputElement) {
        const totalFrames = frames;
        let currentFrame = 0;

        return setInterval(() => {
            // const animFrame = currentFrame % frames;
            // const anim = Array.from({ length: frames }, (_, i) => {
            //     return i === animFrame ? frameChar : ' ';
            // }).join('');
            // outputElement.textContent = anim;
            currentFrame++;
            if (currentFrame < totalFrames + 1) {
                outputElement.innerHTML = "";
                for (let index = 0; index < currentFrame; index++) {
                    // outputElement.innerHTML += "&nbsp;";
                    outputElement.innerHTML += "-";
                }
                outputElement.innerHTML += frameChar;
                for (let index = 0; index < totalFrames - currentFrame; index++) {
                    // outputElement.innerHTML += "&nbsp;";
                    outputElement.innerHTML = outputElement.innerHTML + "-";
                }
            }
            else
                currentFrame = -1;
        }, 100);
    }

    pdfParserServiceUrlInput.oninput = function () {
        window.PDF_PARSER_SERVICE_URL = pdfParserServiceUrlInput.value;
        try {
            if (new URL(pdfParserServiceUrlInput.value) && isValidHttpUrl(pdfParserServiceUrlInput.value)) {
                searchButton.disabled = false;
        } catch (error) {
            searchButton.disabled = true;
        }
    }

    searchButton.onclick = function (e, i) {
        if (i == undefined) i = 0;
        const brand = productBandDropdown.options[productBandDropdown.selectedIndex].text;
        // const toEval = "find" + brand + "SupportUrl(\"" + input.value + "\", \"" + i + "\")";
        const toEval = `simpleGET(window.PDF_PARSER_SERVICE_URL + "search?productBrand=` + brand + `&productName=" + "` + input.value + `" + "&i=" + ` + i + `).responseText`;
        window.writeToConsole("Evaluating search functions...");
        const url = (Function('"use strict";return (' + toEval + ')')());
        window.writeToConsole("Got product url...");
        isProductOK.style.display = "initial";
        isProductOK.getElementsByTagName("a")[0].href = url;
        isProductOK.getElementsByTagName("a")[0].textContent = url;
        window.writeToConsole("Found");

        yesProductOK.onclick = function () {
            window.writeToConsole("Executing search for product manuals...");
            // parsePDF(getPDFManual(url));
            generatorsWorker.postMessage(JSON.stringify(
                {
                    "event": "FUNC parsePDF",
                    "data": "|getPDFManual(\"" + url + "\")"
                }
            ));

            isProductOK.style.display = "none";
            loadingScreen.style.display = "initial";
            let loadingScreenInterval = generateLoadingAnimation(10, '*', loadingScreen.getElementsByTagName("p")[1]);

            // let parsePDF1 = parsePDF;
            // let getPDFManual1 = getPDFManual;

            // const blobData = ([
            //     "this.window = {};",
            //     "mainThis = this;",
            //     `this.window.writeToConsole = function (data) {
            //         mainThis.postMessage(JSON.stringify({
            //                 "event": "writeToConsole",
            //                 "data": data
            //             }));
            //         };`,
            //     // '(',
            //     "this.parsePDF1 = " + parsePDF1.toString() + "\n",
            //     "this.getPDFManual1 = " + getPDFManual1.toString() + "\n",
            //     // ')()',
            //     '(',
            //     function () {
            //         parsePDF1(getPDFManual1(url));
            //     }.toString(),
            //     ')()']
            // );

            // console.log(blobData);
            // debugger;

            // var blobURL = URL.createObjectURL(new Blob(blobData, { type: 'application/javascript' })),
            //     worker = new Worker(blobURL);

            // URL.revokeObjectURL(blobURL);
        }
        notProductOK.onclick = function () {
            searchButton.onclick(null, i + 1);
        }
    }
}
function parsingCompleted(data) {
    const loadingScreen = document.getElementById("loading");
    loadingScreen.style.display = "none";

    // TODO: add hardware building page (details are in data)
    window.writeToConsole(data);
}
setup();