// MIT © 2016 azu
"use strict";
const url = require("url");
const fetchContributes = require("./fetch-contributes");
function fetchAndResult(user) {
    const output = document.getElementById("js-output");
    output.innerHTML = "Fetching...";
    return fetchContributes(user).then(contributes => {
        output.innerHTML = `
        <p>@${encodeURIComponent(user)}'s contributions</p>
        <p>Longest Streak: ${contributes["longestStreak"]}</p>
        <p>Current Streak: ${contributes["currentStreak"]}</p>
<p>
<textarea>${location.origin}${location.pathname}?user=${user}</textarea>
</p>
`;
    }).catch(error => {
        console.error(error);
        output.textContent = error.message;
    });
}
const onClick = (event) => {
    const user = document.getElementById("js-userName").value.replace("@", "");
    if (!user) {
        return;
    }
    fetchAndResult(user);
};
document.getElementById("js-submit").addEventListener("click", onClick);
window.addEventListener("load", () => {
    const query = url.parse(window.location.href, true).query;
    if (query.user) {
        fetchAndResult(query.user);
    }
});
