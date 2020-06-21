const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
require('dotenv').config();

const apiKey = process.env.SUPERHERO_API_KEY;
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let cache = {};

app.get("/", function(req, res) {
  res.render("index", { superhero: null, error: null });
});

app.get("/home", function(req, res) {
  res.render("index", { superhero: null, error: null });
});

app.get("/maintenance", function(req, res) {
  res.render("maintenance", { superhero: null, error: null });
});

app.get("/error", function(req, res) {
  res.render("error", { superhero: null, error: null });
});

app.post("/search", function(req, res) {
  let name = req.body.searchKey;
  
  let cacheResult = cache[name];

  let url = `https://superheroapi.com/api/${apiKey}/search/${name}`;

  if (cacheResult != null) {
    let superhero = JSON.parse(cacheResult);
    res.render("search", {
      superhero: superhero.results,
      searchKey: name,
      error: null
    });
  } else {
    request(url, function(err, response, body) {
      if (err) {
        res.render("maintenance", {
          superhero: null,
          error: "Error, please try again"
        });
      } else {
        let superhero = JSON.parse(body);
        if (superhero.results == undefined) {
          res.render("search", {
            superhero: null,
            error: "Error, please try again"
          });
        } else {
          cache[name] = JSON.stringify(superhero);
          res.render("search", {
            superhero: superhero.results,
            searchKey: name,
            error: null
          });
        }
      }
    });
  }
});

app.get("/random", function(req, res) {
  let id = Math.floor(Math.random() * 730) + 1;

  let url = `https://superheroapi.com/api/${apiKey}/${id}`;
  
  let cacheResult = cache[id];

  if (cacheResult != null) {
    let superhero = JSON.parse(cacheResult);
    res.render("random", { superhero: superhero, error: null });
  } else {
    request(url, function(err, response, body) {
      if (err) {
        res.render("maintenance", {
          superhero: null,
          error: "Error, please try again"
        });
      } else {
        let superhero = JSON.parse(body);
        if (superhero.id == undefined) {
          res.render("random", {
            superhero: null,
            error: "Error, please try again"
          });
        } else {
          cache[id] = JSON.stringify(superhero);
          res.render("random", { superhero: superhero, error: null });
        }
      }
    });
  }
});

app.post("/viewDetails", function(req, res) {
  let viewKey = req.body.viewDetails;
  let searchKey = req.body.searchKey;

  let url = `https://superheroapi.com/api/${apiKey}/${viewKey}`;

  let cacheResult = cache[viewKey];

  if (cacheResult != null) {
    let superhero = JSON.parse(cacheResult);
    res.render("view", {
      superhero: superhero,
      searchKey: searchKey,
      error: null
    });
  } else {
    request(url, function(err, response, body) {
      if (err) {
        res.render("maintenance", {
          superhero: null,
          error: "Error, please try again"
        });
      } else {
        let superhero = JSON.parse(body);
        if (superhero.id == undefined) {
          res.render("view", {
            superhero: null,
            error: "Error, please try again"
          });
        } else {
          cache[viewKey] = JSON.stringify(superhero);
          res.render("view", {
            superhero: superhero,
            searchKey: searchKey,
            error: null
          });
        }
      }
    });
  }
});

app.get("*", function(req, res) {
  res.render("error", { superhero: null, error: null });
});

app.listen(port, function() {
  console.log("Server running @" + port);
});
