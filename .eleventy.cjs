const eleventySass = require("eleventy-sass");

module.exports = function(eleventyConfig) {

    // use eleventy-sass
    eleventyConfig.addPlugin(eleventySass);

    // add custom assets
    eleventyConfig.addPassthroughCopy("src/scripts");
    eleventyConfig.addPassthroughCopy("src/assets");

    // localized date filter with moment.js
    eleventyConfig.addNunjucksFilter("date", function (date, format, locale) {
        locale = locale ? locale : "en";
        moment.locale(locale);
        return moment(date).format(format);
    });
    
    // change input directory to src
    return {
        dir: {
            input: "src",
            output: "docs"
        }
    }
}