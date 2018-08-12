// MIT © 2016 azu
"use strict";
import { parseGitHubContributions } from "./parse-contributes.js";

const fetch = require("isomorphic-fetch");
const $ = require('isomorphic-parse');
const moment = require("moment");

function getCreatedDateOfGitHubUser(user) {
    return fetch(`https://github-contributions-api.now.sh/v1/${encodeURIComponent(user)}`)
        .then(res => res.json())
}

module.exports = function(user) {
    return getCreatedDateOfGitHubUser(user).then(response => {
        console.log("response", response);
        const contributionsByOrderFirst = response.contributions.sort((a, b) => {
            return moment(a.date, "YYYY-MM-DD").diff(moment(b.date, "YYYY-MM-DD"));
        });
        console.log("contributionsByOrderFirst", contributionsByOrderFirst);
        const results = parseGitHubContributions(contributionsByOrderFirst);
        console.log("results", results);
        return results;
    });
};
