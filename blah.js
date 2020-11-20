var unirest = require("unirest");
require('dotenv').config();

function queryRAWGDatabase(title)
{
    title = title.split(' ').join('-')
    var req = unirest("GET", "https://rawg-video-games-database.p.rapidapi.com/games/" + title)

    req.headers({
        "x-rapidapi-key": process.env.RAWG_GAME_DATABASE_KEY,
        "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
        "useQueryString": true
    });

    req.end(function (res) {
        if (res.error)
        {
            console.log("There was an error so I will skip this")
        };
    
        console.log(res.body);
    });
}

queryRAWGDatabase("");
