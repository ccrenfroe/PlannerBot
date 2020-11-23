const unirest = require('unirest');
require('dotenv').config();

function queryRAWGDatabase(title)
{
    return new Promise((resolve, reject) =>
    {
        title = title.split(' ').join('-');
        var req = unirest("GET", "https://rawg-video-games-database.p.rapidapi.com/games/" + title);

        req.headers({
            "x-rapidapi-key": process.env.RAWG_GAME_DATABASE_KEY,
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
            "useQueryString": true
        });
        req.end(function (response) {
            if (response.error)
            {
                return reject(response.error);
            };
            return resolve(response.body);
        });
    })
}

let game;
queryRAWGDatabase("Among Us").then((body) => game = body).catch((error) => game = null)

console.log(game)