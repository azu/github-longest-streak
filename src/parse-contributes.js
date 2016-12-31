// MIT © 2016 azu
"use strict";
const moment = require("moment");
const isSameDateAs = function(aDate, bDate) {
    return (
        aDate.getFullYear() === bDate.getFullYear() &&
        aDate.getMonth() === bDate.getMonth() &&
        aDate.getDate() === bDate.getDate()
    );
};
module.exports = function parseGitHubCalendarSvg(input) {
    const data = {
        longest_streak: 0,
        longest_streak_range: [],
        current_streak: 0,
        current_streak_range: [],
        days: [],
    };
    input.split("\n").slice(2).map(function(c) {
        return c.trim();
    }).forEach(function(c) {
        var date = c.match(/data-date="([0-9\-]+)"/);
        var count = c.match(/data-count="([0-9]+)"/);
        date = date && date[1];
        count = count && +count[1];

        const newData = {
            date: new Date(date),
            count: count,
        };
        const isAlreadyIncludes = data.days.some(dayObject => {
            return isSameDateAs(dayObject.date, newData.date);
        });
        if (moment().isSameOrBefore(newData.date)) {
            return;
        }
        if (!isAlreadyIncludes) {
            data.days.push(newData);
        }
    });

    const groupByCount = (data) => {
        const groups = [];
        let currentGroup = [];
        data.days.forEach(day => {
            if (day.count <= 0) {
                groups.push(currentGroup);
                currentGroup = [];
                return;
            }
            currentGroup.push(day);
        });
        if (groups.indexOf(currentGroup) === -1) {
            groups.push(currentGroup);
        }
        return groups;
    };
    const getLongestGroup = (groups) => {
        let longestGroup = [];
        groups.forEach(group => {
            if (longestGroup.length < group.length) {
                longestGroup = group;
            }
        });
        return longestGroup;
    };
    const getStreakFromGroup = (group) => {
        if (group.length === 0) {
            return {
                from: null,
                to: null
            }
        }
        if (group.length === 1) {
            return {
                from: group[0],
                to: group[0]
            };
        }
        return {
            from: group[0],
            to: group[group.length - 1]
        };
    };
    const getDiffDay = (streak) => {
        if (!streak.from && !streak.to) {
            return 0;
        }
        const from = moment(streak.from.date);
        const to = moment(streak.to.date);
        return to.diff(from, "days");
    };
    const groups = groupByCount(data);
    const longestGroup = getLongestGroup(groups);
    const currentGroup = groups[groups.length - 1];
    const longestStreak = getDiffDay(getStreakFromGroup(longestGroup));
    const currentStreak = getDiffDay(getStreakFromGroup(currentGroup));
    return {
        groups,
        longestGroup,
        longestStreak,
        currentGroup,
        currentStreak
    };
};