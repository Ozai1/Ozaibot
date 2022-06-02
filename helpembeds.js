const { Discord } = require('discord.js')
const embeds = {
    "help": {
        
    },
    "ban": {
        "time": 3600,
        "aliases": [
            "h", "hours", "hour"
        ],
    },
    "mute": {
        "time": 16800,
        "aliases": [
            "d", "day", "days"
        ],
    },
    "kick": {
        "time": 604800,
        "aliases": [
            "w", "week", "weeks"
        ],
    },
    "unmute": {
        "time": 2592000,
        "aliases": [
            "mon", "month", "months"
        ],
    }
}