const mongoose = require("mongoose");

const PropertiesSchema = new mongoose.Schema(
  {
    length: { type: Number, required: true },
    is_palindrome: { type: Boolean, required: true },
    unique_characters: { type: Number, required: true },
    word_count: { type: Number, required: true },
    sha256_hash: { type: String, required: true },
    character_frequency_map: { type: Map, of: Number, default: {} },
  },
  { _id: false }
);

const StringSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
  properties: { type: PropertiesSchema, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("String", StringSchema);
