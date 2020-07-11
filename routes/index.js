const express = require("express");
const router = express.Router();
const services = require("../controllers/controller");
const redis = require("redis");

const REDIS_PORT = process.env.PORT || 6379;
let client = null;

if (process.env.REDIS_HOST) {
  client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    no_ready_check: true,
  });
  client.auth(process.env.PWD);
} else {
  client = require("redis").createClient(REDIS_PORT);
}

//const client = redis.createClient(REDIS_PORT);

client.on("error", (err) => {
  console.log("Error in redis connection");
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
      if (data !== null) {
        superhero = JSON.parse(data);
      } else {
        superhero = await services.searchCharacter(name);
        if (superhero === undefined) {
          errorString = "Error, please try again";
          superhero = null;
        } else {
          client.setex(name, 1800, JSON.stringify(superhero));
        }
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
      if (data !== null) {
        superhero = JSON.parse(data);
      } else {
        superhero = await services.getDetails(viewKey);
        if (superhero.id === undefined) {
          errorString = "Error, please try again";
          superhero = null;
        } else {
          client.setex(viewKey, 1800, JSON.stringify(superhero));
        }
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
      if (data !== null) {
        superhero = JSON.parse(data);
      } else {
        superhero = await services.getRandomCharacter(id);

        if (superhero.id === undefined) {
          errorString = "Error, please try again";
        } else {
          client.setex(id.toString(), 1800, JSON.stringify(superhero));
        }
      }
      services.renderOutput(res, "random", superhero, null, errorString);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
