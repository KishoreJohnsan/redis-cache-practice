const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const apiKey = "******************";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


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
  console.log(name);
  let url = `https://superheroapi.com/api/${apiKey}/search/${name}`;

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
        res.render("search", { superhero: superhero.results, searchKey : name ,error: null });
      }
    }
  });
});

app.get("/random", function(req, res) {
  let id = Math.floor(Math.random() * 730) + 1;

  let url = `https://superheroapi.com/api/${apiKey}/${id}`;
  console.log(id);

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
        console.log(superhero.name);

        res.render("random", { superhero: superhero, error: null });
      }
    }
  });
});

app.post("/viewDetails", function(req, res) {
  let viewKey = req.body.viewDetails;
  let searchKey = req.body.searchKey;

  let url = `https://superheroapi.com/api/${apiKey}/${viewKey}`;
  console.log(viewKey);

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
        console.log(superhero.name);

        res.render("view", { superhero: superhero, searchKey : searchKey ,error: null });
      }
    }
  });
});

app.get('*', function (req, res) { 
  res.render("error", { superhero: null, error: null });
})

app.listen(3000, function() {
  console.log("Rock N Roll Buckaroo @ 3000!");
});
