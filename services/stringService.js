const { createHash } = require("crypto");

exports.getLength = (string) => {
  return string.length;
};

exports.checkIsPalindrome = (string) => {
  console.log("original string: ", string);
  const reversedString = string.toLowerCase().split("").reverse().join("");
  console.log("reversed string: ", reversedString);
  return string.toLowerCase() === reversedString;
};

exports.countUniqueCharacters = (string) => {
  let charsSet = new Set();
  let strArr = string.toLowerCase().replace(/\s+/g, "").split("");

  strArr.map((c) => {
    charsSet.add(c);
  });

  return charsSet.size;
};

exports.countWords = (string) => {
  const trimStr = string.trim();

  if (trimStr === "") {
    return 0;
  }

  const wordsArr = trimStr.split(/\s+/);

  return wordsArr.length;
};

exports.genHash = (string) => {
  return createHash("sha256").update(string).digest("hex");
};

exports.getCharFreqMap = (string) => {
  const strObj = {};
  let strArr = string.toLowerCase().replace(/\s+/g, "").split("");

  strArr.map((c) => {
    if (!(c in strObj)) {
      strObj[c] = 1;
    } else {
      strObj[c] = strObj[c] + 1;
    }
  });

  return strObj;
};

exports.parseNaturalLanguageQuery = (string) => {
  const supportedQueries = {
    word_count: 1,
    is_palindrome: true,
    min_length: 11,
    contains_character: "a",
  };

  const filters = {};

  let text = string;

  let testWordCount = text.match(/single word/);
  if (testWordCount) {
    // filters.push({ word_count: 1 });
    filters["word_count"] = 1;
  }

  let testPalindromicQuery = text.match(/palindromic strings/);
  if (testPalindromicQuery) {
    // filters.push({ is_palindrome: true });
    filters["is_palindrome"] = true;
  }

  let testStringLength = text.match(/longer\s+than\s+(\d+)/i);
  if (testStringLength) {
    // filters.push({ min_length: Number(testStringLength[1]) + 1 });
    filters["min_length"] = Number(testStringLength[1]) + 1;
  }

  let testLetterTypePos = text.match(
    /contain(?:s)?\s+(?:the\s+)?(first|last)\s+(vowel|consonant)/i
  );
  if (testLetterTypePos) {
    switch (testLetterTypePos[2]) {
      case "vowel":
        testLetterTypePos[1] === "first"
          ? (filters["contains_character"] = "a")
          : (filters["contains_character"] = "u");
        break;
      case "consonant":
        testLetterTypePos[1] === "first"
          ? (filters["contains_character"] = "b")
          : (filters["contains_character"] = "z");
        break;

      default:
        break;
    }
  }

  let testContainLetter = text.match(
    /contain(?:s|ing)?\s+(?:the\s+)?letter\s+([a-z])/i
  );
  if (testContainLetter) {
    //filters.push({ contains_character: testContainLetter[1] });
    filters["contains_character"] = testContainLetter[1];
  }

  return filters;
};
