function addReplaceAll() {
    /**
     * String.prototype.replaceAll() polyfill
     * https://gomakethings.com/how-to-replace-a-section-of-a-string-with-another-one-with-vanilla-js/
     * @author Chris Ferdinandi
     * @license MIT
     */
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (str, newStr) {

            // If a regex pattern
            if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
                return this.replace(str, newStr);
            }

            // If a string
            return this.replace(new RegExp(str, 'g'), newStr);

        };
    }
}
function addIncludesWord() {
    String.prototype.includesWord = function (word) {
        // Construct a regular expression that matches the word
        const regex = new RegExp(`\\b${word}\\b`, 'i');

        // Use the regular expression to test if the word is present in the string
        return regex.test(this);
    }
}
addReplaceAll();
addIncludesWord();