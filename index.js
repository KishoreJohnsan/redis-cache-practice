const request = require("request");

let apiKey = '1248328455361332';
let id = '69';
let url = `https://superheroapi.com/api/${apiKey}/${id}`;

request(url, function (err, response, body) {
    if (err) {
        console.log("error:", error);
    } else {
        let superhero = JSON.parse(body);
        let message = ` ${superhero.biography.aliases}`;
        console.log(message);
    }
});


