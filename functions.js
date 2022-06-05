const times = {
    "second": {
        "time": 1,
        "name": "second",
        "aliases": [
            "s", "sec", "secs", "second", "seconds"
        ],
    },
    "minute": {
        "time": 60,
        "name": "minute",
        "aliases": [
            "m", "minutes", "minute", "min", "mins"
        ],
    },
    "hour": {
        "time": 3600,
        "name": "hour",
        "aliases": [
            "h", "hours", "hour"
        ],
    },
    "day": {
        "time": 86400,
        "name": "day",
        "aliases": [
            "d", "day", "days"
        ],
    },
    "week": {
        "time": 604800,
        "name": "week",
        "aliases": [
            "w", "week", "weeks"
        ],
    },
    "month": {
        "time": 2592000,
        "name": "month",
        "aliases": [
            "mon", "month", "months"
        ],
    }
}

/**
 * Returns the full name of a unit of time's alias
 * @param {string} string time unit / time unit alias
 * @returns {string} full name of time unit 
 */
module.exports.GetAlias = (string) => {
    for (const key in times) if (times[key].aliases.includes(string)) return key;
}

/**
* Gets the amount of time for a unit of time
* @param {string} string unit of time
* @returns {integer} how many seconds makes up the unit of time inputed.
* @error When no unit of time can be found from the supplied string, returns -1.
*/
module.exports.GetTime = (key) => {
    if (times[key] && times[key].time) {
        return times[key].time;
    }
    return -1;
}
module.exports.aliases = times;

/**
 * Retreves a member from the guild of message object
 * @param {Object} message Message object
 * @param {string} string The string that is used to find a member
 * @param {Object} Discord Used for embeds
 * @param {boolean} MustNotHaveMultiResults Whether to allow the embed that asks what user they meant or to just return if multiple members are found
 * @returns {Object} member on success or undefined on fail
 */

