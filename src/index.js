// MIT © 2016 azu
"use strict";
const fetchContributes = require("./fetch-contributes");
const onClick = (event) => {
    const output = document.getElementById("js-output");
    const user = document.getElementById("js-userName").value.replace("@", "");
    if (!user) {
        return;
    }
    output.innerHTML = "Fetching...";
    fetchContributes(user).then(contributes => {
        console.log("Contributes", contributes);
        output.innerHTML = `
        <p>Longest Streak: ${contributes["longestStreak"]}</p>
        <p>Current Streak: ${contributes["currentStreak"]}</p>
`;
    }).catch(error => {
        console.log(error);
        output.textContent = error.message;
    });
};
document.getElementById("js-submit").addEventListener("click", onClick);