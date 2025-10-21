const String = require("../models/String");
const {
  getLength,
  checkIsPalindrome,
  countUniqueCharacters,
  countWords,
  genHash,
  getCharFreqMap,
  parseNaturalLanguageQuery,
} = require("../services/stringService");

exports.getStrings = async (req, res) => {
  try {
    const query = req.query;

    const allowedParams = [
      "is_palindrome",
      "min_length",
      "max_length",
      "word_count",
      "contains_character",
    ];

    const invalidParams = Object.keys(query).filter(
      (key) => !allowedParams.includes(key)
    );

    if (invalidParams.length > 0) {
      res.status(400).json({
        message: `Invalid query parameter detected: ${invalidParams.join(
          ", "
        )}.`,
      });
    }

    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = query;

    const filters = [];
    const filters_applied = {};

    if (is_palindrome !== undefined) {
      filters.push({ "properties.is_palindrome": is_palindrome === "true" });
      filters_applied.is_palindrome = is_palindrome === "true";
    }

    if (min_length) {
      filters.push({ "properties.length": { $gte: Number(min_length) } });
      filters_applied.min_length = Number(min_length);
    }

    if (max_length) {
      filters.push({ "properties.length": { $lte: Number(max_length) } });
      filters_applied.max_length = Number(max_length);
    }

    if (word_count) {
      filters.push({ "properties.word_count": Number(word_count) });
      filters_applied.word_count = Number(word_count);
    }

    if (contains_character) {
      filters.push({
        [`properties.character_frequency_map.${contains_character}`]: {
          $exists: true,
        },
      });
      filters_applied.contains_character = contains_character;
    }

    const dbQuery = filters.length > 0 ? { $and: filters } : {};

    const strings = await String.find(dbQuery)
      .select("_id value properties created_at")
      .lean();

    const formattedData = strings.map((s) => ({
      id: s._id,
      value: s.value,
      properties: s.properties,
      created_at: s.created_at,
    }));

    res.status(200).json({
      data: formattedData,
      count: formattedData.length,
      filters_applied: filters_applied,
    });
  } catch (error) {
    console.error("Error fetching strings:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createString = async (req, res) => {
  const stringVal = req.body.value;

  if (!stringVal)
    res
      .status(400)
      .json({ message: 'Invalid request body or missing "value" field' });

  if (typeof stringVal !== "string")
    res.status(422).json({
      message:
        'Invalid request body or missing data type for "value" (must be string)',
    });

  try {
    //check if string exists
    const stringExist = await String.findOne({ value: stringVal });
    if (stringExist) {
      res.status(409).json({ message: "String already exists in the system" });
    } else {
      const stringAnalysis = await String.create({
        id: genHash(stringVal),
        value: stringVal,
        properties: {
          length: getLength(stringVal),
          is_palindrome: checkIsPalindrome(stringVal),
          unique_characters: countUniqueCharacters(stringVal),
          word_count: countWords(stringVal),
          sha256_hash: genHash(stringVal),
          character_frequency_map: getCharFreqMap(stringVal),
        },
      });
      res.status(201).json(stringAnalysis);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecString = async (req, res) => {
  const stringVal = req.params.string;
  try {
    const string = await String.findOne({ value: stringVal });
    if (string) {
      res.status(200).json({
        id: string.id,
        value: string.value,
        properties: string.properties,
        created_at: string.created_at,
      });
    } else {
      res.status(404).json({ message: "String does not exist in the system" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStringsByNaturalLanguage = async (req, res) => {
  try {
    const query = req.query.query;
    console.log(query);

    const filters = parseNaturalLanguageQuery(query);
    console.log("filters: ", filters);

    const { word_count, is_palindrome, min_length, contains_character } =
      filters;

    // const supportedQueries = {
    //   word_count: 1,
    //   is_palindrome: true,
    //   min_length: 11,
    //   contains_character: "a",
    // };

    if (Object.keys(filters).length > 0) {
      const filters_applied = [];

      if (word_count) {
        filters_applied.push({
          "properties.length": { $eq: Number(word_count) },
        });
      }

      if (is_palindrome) {
        filters_applied.push({
          "properties.is_palindrome": is_palindrome,
        });
      }

      if (min_length) {
        filters_applied.push({
          "properties.length": { $gte: Number(min_length) },
        });
      }

      if (contains_character) {
        filters_applied.push({
          [`properties.character_frequency_map.${contains_character}`]: {
            $exists: true,
          },
        });
      }

      console.log("filters applied: ", filters_applied);
      const dbQuery = { $and: filters_applied };

      const strings = await String.find(dbQuery).select("value").lean();
      //console.log(strings);

      const formattedData = strings.map((s) => ({
        value: s.value,
      }));

      //console.log("formatted data: ", formattedData);

      res.status(200).json({
        data: formattedData.map((item) => item.value),
        count: formattedData.length,
        interpreted_query: {
          original: query,
          parsed_filters: filters,
        },
      });
    } else {
      res
        .status(400)
        .json({ message: "Unable to parse natural language query" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteString = async (req, res) => {
  const stringVal = req.params.string;
  try {
    const string = await String.findOneAndDelete({ value: stringVal });
    if (string) {
      res.status(204).json({});
    } else {
      res.status(404).json({ message: "String does not exist in the system" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  const roll = req.params.roll;
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { roll: roll },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
