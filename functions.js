const times = {
    "min": {
        "time": 60,
        "aliases": [
            "m", "minutes", "minute", "min", "mins"
        ],
    },
    "hour": {
        "time": 3600,
        "aliases": [
            "h", "hours", "hour"
        ],
    },
    "day": {
        "time": 16800,
        "aliases": [
            "d", "day", "days"
        ],
    },
    "week": {
        "time": 604800,
        "aliases": [
            "d", "day", "days"
        ],
    },
    "month": {
        "time": 2592000,
        "aliases": [
            "mon", "month", "months"
        ],
    }
}
module.exports.getAlias = (string) => {
    for (const key in times) if (times[key].aliases.includes(string)) return key;
}
module.exports.getTime = (key) => {
    if (times[key] && times[key].time) {
        return times[key].time;
    }
    return -1;
}

module.exports.aliases = times;