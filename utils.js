/**
 * 
 * @param {HTMLElement} el 
 * @param {string} filename 
 */
const importHTML = function (el, filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + filename, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const domParser = new DOMParser();
            const parsed = domParser.parseFromString(xhr.responseText, "text/html");
            el.appendChild(parsed.children[0].children[1].children[0]);
        }
    };
    xhr.send();
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {string} filename 
 */
const importJS = function (el, filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './' + filename, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            const script = document.createElement('script');
            script.innerHTML = xhr.responseText;
            el.appendChild(script);
        }
    };
    xhr.send();
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {string} filenameHTML 
 * @param {string} filenameJS 
 */
const importHTMLandJS = function (el, filenameHTML, filenameJS) {
    importHTML(el, filenameHTML);
    importJS(el, filenameJS);
}

/**
 * 
 * @param {string} url 
 * @returns {XMLHttpRequest}
 */
const simpleGET = function (url, headers) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.open("GET", url, false);
    if (headers)
        for (var header in headers) {
            httpRequest.setRequestHeader(header, headers[header]);
        }
    httpRequest.send();
    return httpRequest;
}

const advancedGET = function (url, cb, headers, hangAfter) {
    var xhr = new XMLHttpRequest();
    if (headers)
        for (var header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(xhr);
        }
        if (xhr.readyState === 3) {
            if (hangAfter && !xhr.stopThisThing) {
                setTimeout(() => {
                    cb(xhr);
                    xhr.onreadystatechange = undefined;
                    xhr.abort();
                }, hangAfter);
                xhr.stopThisThing = true;
            }
        }
    };

    xhr.send();
}

var BASE64_MARKER = ';base64,';
/**
 * https://stackoverflow.com/a/12094943/15229136
 * @param {*} dataURI 
 * @returns 
 */
function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

function download(data, filename) {
    var formBlob = new Blob([data], { type: 'text/plain' })

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = window.URL.createObjectURL(formBlob);
    a.download = filename;
    a.click();
}

// window = Object.assign({
//     simpleGET: simpleGET,
//     importHTML: importHTML,
// }, window);

function execActionWithData(data) {
    const parsedData = JSON.parse(data.data);
    /**
     * @type {string}
     */
    const event = parsedData.event;
    /**
     * @type {string}
     */
    const actionData = parsedData.data;

    if (event.startsWith("FUNC ")) {
        const funcName = event.split("FUNC ")[1];
        if (actionData.startsWith("|")) {
            const secondFuncData = actionData.split("|")[1];
            const out = (Function('"use strict";return (' + funcName + "(" + secondFuncData + ")" + ')')());
        }
        else {
            const out = (Function('"use strict";return (' + funcName + "(" + "`" + actionData + "`" + ")" + ')')());
        }
    } else if (event.startsWith("SET ")) {
        const varName = event.split("SET ")[1];
        const out = (Function('"use strict";return (' + varName + "=" + "`" + actionData + "`" + ')')());
    }
}