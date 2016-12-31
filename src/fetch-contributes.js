// MIT © 2016 azu
"use strict";
const fetch = require("isomorphic-fetch");
const parse = require("./parse-contributes");
const $ = require('isomorphic-parse');
const options = {};
// We need a proxy for CORS
// Thanks, @izuzak (https://github.com/izuzak/urlreq)
options.proxy = options.proxy || function(url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + encodeURIComponent(url);
    };

function getSVGContent(user, year) {
    const dateQuery = `tab=overview&from=${year}-01-01`;
    const API = `https://github.com/${encodeURIComponent(user)}?${dateQuery}`;
    console.log(API);
    return fetch(options.proxy(API)).then(response => {
        return response.text()
    }).then(response => {
        const doc = $(response);
        return doc.find('svg.js-calendar-graph-svg > g').html();
    });
}

function getContributes(user, years) {
    const promises = years.map(year => {
        return getSVGContent(user, year);
    });
    return Promise.all(promises).then(svgs => {
        return `<svg>
${svgs.join("\n")}
</svg>`
    });
}
function getCreatedDateOfGitHubUser(user) {
    return fetch(`https://api.github.com/users/${encodeURIComponent(user)}`)
        .then(res => res.json())
        .then(response => {
            return new Date(response["created_at"]);
        });
}
/**
 * create year number range
 * @param {Date} startDate
 * @param {Date} [endDate]
 * @returns {Array}
 */
function createYearRange(startDate, endDate = new Date()) {
    const currentYear = endDate.getFullYear();
    const years = [];

    let startYear = startDate.getFullYear();
    while (startYear <= currentYear) {
        years.push(startYear++);
    }
    return years;
}
module.exports = function(user) {
    return getCreatedDateOfGitHubUser(user).then(createDate => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const years = createYearRange(createDate, nextYear);
        console.log(years);
        return getContributes(user, years).then(svg => {
            return parse(svg);
        });
    })
};
