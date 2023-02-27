/// <reference path="utils.js" />

importScripts("./utils.js");
importScripts("./backports.js");

window = {};
window.PDF_PARSER_SERVICE_URL = "";

let mainThis = this;
this.window.writeToConsole = function (data) {
    mainThis.postMessage(JSON.stringify({
        "event": "FUNC window.writeToConsole",
        "data": data
    }));
};

// /**
//  * 
//  * @param {string} url 
//  * @returns {XMLHttpRequest}
//  */
// const simpleGET = function (url, headers) {
//     var httpRequest = new XMLHttpRequest();

//     httpRequest.open("GET", url, false);
//     if (headers)
//         for (var header in headers) {
//             httpRequest.setRequestHeader(header, headers[header]);
//         }
//     httpRequest.send();
//     return httpRequest;
// }

function getPDFManual(supportPage) {
    // const url = "http://www.whateverorigin.org/get?url=" + supportPage;
    // let htmlData = "";
    // for (let index = 0; index < 5; index++) {
    //     try {
    //         const data = simpleGET(url).responseText;
    //         const parsedData = JSON.parse(data).contents;
    //         htmlData = parsedData;
    //         break;
    //     } catch (error) {
    //     }
    // }

    // // if (supportPage)
    window.writeToConsole("Detecting product url...");
    console.log(supportPage);

    // if (supportPage.startsWith("https://rog.asus.com")) {
    //     // url: https://rog.asus.com/support/webapi/product/GetPDManual?website=pl&model=ROG-STRIX-X670E-E-GAMING-WIFI&pdid=20994&mode=&LevelTagId=204970&country=&region=&systemCode=rog
    //     //      https://rog.asus.com/support/webapi/product/GetPDManual?website=pl&model=rog-strix-x670e-e-gaming-wifi&systemCode=rog
    //     ///                                                                              rog-strix-x670e-e-gaming-wifi-model
    //     // example:                       https://rog.asus.com/pl/motherboards/rog-strix/rog-strix-x670e-e-gaming-wifi-model/
    //     const baseURL = "https://rog.asus.com/support/webapi/product/GetPDManual?website=global&model=" + supportPage.split("/")[supportPage.split("/").length - 2].split("-model")[0] + "&pdid=20994&mode=&LevelTagId=204970&country=&region=&systemCode=rog";
    //     for (let index = 0; index < 5; index++) {
    //         try {
    //             window.writeToConsole("Trying to get product manual list...");
    //             const final = simpleGET("http://www.whateverorigin.org/get?url=" + encodeURIComponent(baseURL));
    //             const availableManuals = JSON.parse(JSON.parse(final.responseText).contents).Result.Obj[0].Files;
    //             const parsed = availableManuals.filter(x => x.Title.endsWith("( English Edition )") && x.Title.includes("User"))[0].DownloadUrl.Global.replaceAll(" ", "%20") + "helpdesk_manual/";
    //             window.writeToConsole("Found manual url!");
    //             return parsed;
    //         } catch (error) {
    //             window.writeToConsole((index + 1) + " failed out of " + 5);
    //             console.log(error);
    //             console.log(index + " failed out of " + 5);
    //         }
    //     }
    // }
    // else if (supportPage.startsWith("https://www.asus.com")) {
    //     // url: https://www.asus.com/support/api/product.asmx/GetPDManual?website=global&model=Pro-WS-WRX80E-SAGE-SE-WIFI-II&pdhashedid=tvn5bjd8hnpzzhyy&pdid=&region=&country=&siteID=www&sitelang=
    //     // const baseURL = "https://www.asus.com/support/api/product.asmx/GetPDManual?website=global&model=" + supportPage.split("/")[supportPage.split("/").length - 2].split("-model")[0] + "&pdhashedid=tvn5bjd8hnpzzhyy&pdid=&region=&country=&siteID=www&sitelang=";
    //     const baseURL = "https://www.asus.com/support/api/product.asmx/GetPDManual?website=global&model=" + supportPage.split("/")[supportPage.split("/").length - 2].split("-model")[0] + "&pdhashedid=&pdid=99999&region=&country=&siteID=www&sitelang=";
    //     for (let index = 0; index < 5; index++) {
    //         try {
    //             window.writeToConsole("Trying to get product manual list...");
    //             const final = simpleGET("http://www.whateverorigin.org/get?url=" + encodeURIComponent(baseURL));
    //             const availableManuals = JSON.parse(JSON.parse(final.responseText).contents).Result.Obj[0].Files;
    //             // const parsed = availableManuals.filter(x => x.Title.endsWith("( English Edition )") && x.Title.includes("User"))[0].DownloadUrl.Global.replaceAll(" ", "%20") + "helpdesk_manual/";
    //             const parsed = availableManuals.filter(x => (x.Title.endsWith("( English Edition )") || x.Title.endsWith("(English)")) && x.Title.includes("User"))[0].DownloadUrl.Global.replaceAll(" ", "%20") + "helpdesk_manual/";
    //             window.writeToConsole("Found manual url!");
    //             return parsed;
    //         } catch (error) {
    //             window.writeToConsole((index + 1) + " failed out of " + 5);
    //             console.log(error);
    //             console.log(index + " failed out of " + 5);
    //         }
    //     }
    // }

    window.writeToConsole("Trying to get product manual list...");
    const final = simpleGET(window.PDF_PARSER_SERVICE_URL + "getPDF?url=" + encodeURIComponent(supportPage)).responseText;
    if (final.includes(".pdf")) {
        window.writeToConsole("Found manual url!");
        return final;
    }
}

function parsePDF(url) {
    console.log("searching on " + url);
    //     /**
    //  * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
    //  *
    //  * @param {Integer} pageNum Specifies the number of the page
    //  * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
    //  **/
    //     function getPageText(pageNum, PDFDocumentInstance) {
    //         // Return a Promise that is solved once the text of the page is retrieven
    //         return new Promise(function (resolve, reject) {
    //             PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
    //                 // The main trick to obtain the text of the PDF page, use the getTextContent method
    //                 pdfPage.getTextContent().then(function (textContent) {
    //                     var textItems = textContent.items;
    //                     var finalString = "";

    //                     // Concatenate the string of the item to the final string
    //                     for (var i = 0; i < textItems.length; i++) {
    //                         var item = textItems[i];

    //                         finalString += item.str + " ";
    //                     }

    //                     // Solve promise with the text retrieven from the page
    //                     resolve(finalString);
    //                 });
    //             });
    //         });
    //     }

    /**
     * Extract the test from the PDF
     */

    // var PDF_URL = '/path/to/example.pdf';
    // const whateveroriginUrl = "http://www.whateverorigin.org/get?url=" + url;
    // const whateveroriginData = simpleGET(whateveroriginUrl);
    // const pdfData = JSON.parse(whateveroriginData.responseText).contents;
    // var blob = new Blob([pdfData], {
    //     type: 'application/pdf'
    // });
    // // pdfjsLib.getDocument({ data: new Uint8Array(pdfData) }).then(function (PDFDocumentInstance) {
    // pdfjsLib.getDocument(URL.createObjectURL(blob)).then(function (PDFDocumentInstance) {

    //     var totalPages = PDFDocumentInstance.pdfInfo.numPages;
    //     var pageNumber = 1;

    //     // Extract the text
    //     getPageText(pageNumber, PDFDocumentInstance).then(function (textPage) {
    //         // Show the text of the page in the console
    //         console.log(textPage);
    //     });

    // }, function (reason) {
    //     // PDF loading error
    //     console.error(reason);
    // });

    // const whateveroriginUrl = "https://api.allorigins.win/get?url=" + url;
    // advancedGET(whateveroriginUrl, whateveroriginData => {
    //     // const whateveroriginData = simpleGET(whateveroriginUrl);
    //     const allData = whateveroriginData.responseText;
    //     const fixedData = allData + `"}`;
    //     const pdfData = JSON.parse(fixedData).contents;
    //     // var blob = new Blob([pdfData], {
    //     //     type: 'application/pdf'
    //     // });
    //     // pdfjsLib.getDocument({ data: new Uint8Array(pdfData) }).then(function (PDFDocumentInstance) {
    //     // pdfjsLib.getDocument({ data: pdfData }).then(function (PDFDocumentInstance) {

    //     //     var totalPages = PDFDocumentInstance.pdfInfo.numPages;
    //     //     var pageNumber = 1;

    //     //     // Extract the text
    //     //     getPageText(pageNumber, PDFDocumentInstance).then(function (textPage) {
    //     //         // Show the text of the page in the console
    //     //         console.log(textPage);
    //     //     });

    //     // }, function (reason) {
    //     //     // PDF loading error
    //     //     console.error(reason);
    //     // });

    //     var pdfAsArray = convertDataURIToBinary(pdfData);
    //     download(pdfAsArray, "test.pdf");
    //     console.log(pdfjsLib.getDocument(pdfAsArray));
    //     // }, undefined, 20000);
    // });

    window.writeToConsole("Using PDF parser service...");
    const data = simpleGET(window.PDF_PARSER_SERVICE_URL + "get?url=" + encodeURIComponent(url)).responseText;
    // console.log(data);
    window.writeToConsole("Got PDF data");
    extractProductData(data);
}

/**
 * @param {string} productManual 
 */
function extractProductData(productManual) {
    function extractTerms(inputString) {
        const stringWithoutLineBreaks = inputString.replace(/\n/g, " ");
        const terms = stringWithoutLineBreaks.split(",").map(term => term.trim()).filter(term => term !== "");
        return terms;
    }

    function extractTermsFromDocument(document) {
        const sections = [];
        let currentSection = [];
        const lines = document.split("\n");
        lines.forEach(line => {
            if (/^[A-Z]/.test(line)) {
                if (currentSection.length > 0) {
                    sections.push(currentSection);
                    currentSection = [];
                }
            }
            currentSection.push(line.trim());
        });

        if (currentSection.length > 0) {
            sections.push(currentSection);
        }

        const extractedTerms = sections.map(section => extractTerms(section.join("\n")));

        return extractedTerms;
    }

    // const extractedTerms = extractTermsFromDocument(productManual).flat();
    const extractedTerms = productManual.split("\n").filter(x => x != "" && x != " ");
    console.log(extractedTerms);

    const searchForCPUTypes = ["LGA", "Socket"];
    const searchForMBTypes = ["ATX", "mATX", "EATX"];
    const splitters = ["Memory", "Chipset", "Expansion Slots", "Storage", "Ethernet", "USB", "Audio"];

    let lastElement = "";
    const doStuff = {};
    const productData = {};
    for (let index = 0; index < extractedTerms.length; index++) {
        // const element = extractedTerms[index].join(" - ");
        const element = extractedTerms[index];

        if (doStuff[index]) {
            switch (doStuff[index]) {
                case "ignore":
                    continue;
                default:
                    break;
            }
        }
        if (element.startsWith("CPU")) {
            doStuff[index + 1] = "ignore";
            const nextElement = extractedTerms[index + 1];
            // let cpuData = searchForCPUTypes.some(x => element.includes(x)) ? element : doStuff[index + 1];
            let cpuData = searchForCPUTypes.some(x => nextElement.includes(x)) ? nextElement : element;
            // let cpuData = element.includes("LGA") ? element : doStuff[index + 1];
            // if (cpuData.includes("LGA") || cpuData.includes("Intel Socket")) {
            if (cpuData.includes("LGA") && (cpuData.includes("Intel Socket") || true)) {
                if (!productData.cpuData)
                    productData.cpuData = {};
                productData.cpuData.socketType = "LGA";
                productData.cpuData.socketName = cpuData.split("LGA")[1].split(" ")[0];
            }
            if (cpuData.includes("Socket") && !cpuData.includes("LGA")) {
                if (!productData.cpuData)
                    productData.cpuData = {};
                productData.cpuData.socketType = "Socket";
                productData.cpuData.socketName = cpuData.split("Socket ")[1].split(" ")[0];
            }
        }
        // if (element.startsWith("USB")) {
        if (searchForMBTypes.some(x => element.includesWord(x))) {
            productData.productType = "Motherboard";
            productData.motherBoardData = {};
            productData.motherBoardData.type = searchForMBTypes.filter(x => element.includesWord(x))[0];
        }

        lastElement = element;
    }

    window.writeToConsole("Process completed. Got product details.");
    console.log(productData);

    mainThis.postMessage(JSON.stringify({
        "event": "FUNC parsingCompleted",
        "data": JSON.stringify(productData)
    }));
}

/**
 * 
 * @param {string} data 
 */
this.onmessage = function (data) {
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
};