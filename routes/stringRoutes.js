const express = require("express");

const {
  getStrings,
  createString,
  getSpecString,
  getStringsByNaturalLanguage,
  deleteString,
} = require("../controllers/stringController");

const router = express.Router();

// fetch all strings and with fiterings
router.get("/", getStrings);

// create / analyze string route
router.post("/", createString);

// natural language filtering
router.get("/filter-by-natural-language", getStringsByNaturalLanguage);

// get specific string
router.get("/:string", getSpecString);

// delete string
router.delete("/:string", deleteString);

module.exports = router;
