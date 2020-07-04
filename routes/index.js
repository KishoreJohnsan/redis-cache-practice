const express = require("express");
const router = express.Router();
const services = require("../controllers/controller");

router.get("/", (req, res) => {
  services.renderOutput(res, "index", null, null, null);
});

router.get("/home", (req, res) => {
  services.renderOutput(res, "index", null, null, null);
});

router.get("/maintenance", (req, res) => {
  services.renderOutput(res, "maintenance", null, null, null);
});

router.get("/error", (req, res) => {
  services.renderOutput(res, "error", null, null, null);
});

let cache = {};

router.post("/search", async (req, res) => {
  let name = req.body.searchKey;
  let cacheResult = cache[name];
  let errorString = "";
  let superhero = null;

  if (cacheResult != null) {
    superhero = JSON.parse(cacheResult);
  } else {
    superhero = await services.searchCharacter(name);
    if (superhero == undefined) {
      errorString = "Error, please try again";
      superhero = null;
    } else {
      cache[name] = JSON.stringify(superhero);
    }
  }
  services.renderOutput(res, "search", superhero, name, errorString);
});

router.post("/viewDetails", async (req, res) => {
  let viewKey = req.body.viewDetails;
  let searchKey = req.body.searchKey;
  let cacheResult = cache[viewKey];
  let errorString = "";
  let superhero = null;

  if (cacheResult != null) {
    superhero = JSON.parse(cacheResult);
  } else {
    superhero = await services.getDetails(viewKey);
    if (superhero.id == undefined) {
      errorString = "Error, please try again";
      superhero = null;
    } else {
      cache[viewKey] = JSON.stringify(superhero);
    }
  }
  services.renderOutput(res, "view", superhero, searchKey, errorString);
});

router.get("/random", async (req, res) => {
  let id = Math.floor(Math.random() * 730) + 1;
  let cacheResult = cache[id];
  let errorString = "";
  let superhero = null;

  if (cacheResult != null) {
    superhero = JSON.parse(cacheResult);
  } else {
    superhero = await services.getRandomCharacter(id);

    if (superhero.id == undefined) {
      errorString = "Error, please try again";
    } else {
      cache[id] = JSON.stringify(superhero);
    }
  }
  services.renderOutput(res, "random", superhero, null, errorString);
});

module.exports = router;
