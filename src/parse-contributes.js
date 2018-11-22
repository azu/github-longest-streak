// MIT © 2016 azu
"use strict";
const moment = require("moment");

/***
 *
 * @param {{ count: number}[]} contributions old is first
 * @returns {{groups: Array, longestGroup: Array, longestStreak: (number|*), currentGroup: *, currentStreak: (number|*)}}
 */
export function parseGitHubContributions(contributions) {
    const groupByCount = (contributions) => {
        const groups = [];
        let currentGroup = [];
        contributions.forEach(day => {
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
    const getCurrentGroup = (today, groups) => {
        const todayMoment = moment(today);
        return groups.find(group => {
            return group.some(contribute => {
                return todayMoment.isSame(moment(contribute.date, "YYYY-MM-DD"), "day");
            });
        });
    };

    const getStreakFromGroup = (group) => {
        if (!group || group.length === 0) {
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
    const groups = groupByCount(contributions);
    const longestGroup = getLongestGroup(groups);
    const currentGroup = getCurrentGroup(new Date(), groups);
    console.log("currentGroup", currentGroup);
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
