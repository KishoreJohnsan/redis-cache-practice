const express = require("express");
const router = express.Router();
const services = require("../controllers/controller");
const redis = require("redis");

const PORT = process.env.REDIS_PORT || 6379;
let client = null;

if (process.env.REDIS_HOST) {
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    no_ready_check: true,
    password: process.env.PWD,
  });
} else {
  client = redis.createClient(PORT);
}

client.on("error", (err) => {
  console.log(err);
});

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

router.post("/search", async (req, res) => {
  let name = req.body.searchKey;
  let errorString = "";
  let superhero = null;
  try {
    client.get(name, async (err, data) => {
      if (data === null || data === undefined) {
        superhero = await services.searchCharacter(name);
        if (superhero === undefined) {
          errorString = "Error, please try again";
          superhero = null;
        } else {
          client.setex(name, 1800, JSON.stringify(superhero));
        }
      } else {
        superhero = JSON.parse(data);
      }
      services.renderOutput(res, "search", superhero, name, errorString);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/viewDetails", async (req, res) => {
  let viewKey = req.body.viewDetails;
  let searchKey = req.body.searchKey;
  let errorString = "";
  let superhero = null;
  try {
    client.get(viewKey, async (err, data) => {
      if (data === null || data === undefined) {
        superhero = await services.getDetails(viewKey);
        if (superhero.id === undefined) {
          errorString = "Error, please try again";
          superhero = null;
        } else {
          client.setex(viewKey, 1800, JSON.stringify(superhero));
        }
      } else {
        superhero = JSON.parse(data);
      }
      services.renderOutput(res, "view", superhero, searchKey, errorString);
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/random", async (req, res) => {
  let id = Math.floor(Math.random() * 730) + 1;
  let errorString = "";
  let superhero = null;
  try {
    client.get(id.toString(), async (err, data) => {
      if (data === null || data === undefined) {
        superhero = await services.getRandomCharacter(id);

        if (superhero.id === undefined) {
          errorString = "Error, please try again";
        } else {
          client.setex(id.toString(), 1800, JSON.stringify(superhero));
        }
      } else {
        superhero = JSON.parse(data);
      }
      services.renderOutput(res, "random", superhero, null, errorString);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
