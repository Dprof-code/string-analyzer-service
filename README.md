# String Analyzer Service API

## Overview
This Node.js backend service leverages Express.js for routing and Mongoose for MongoDB object modeling, providing a scalable API to analyze and manage string data with computed properties. It efficiently processes strings, stores their characteristics, and offers flexible retrieval options, including sophisticated filtering and natural language querying capabilities.

## Features
- **Node.js, Express.js**: Built on a robust and asynchronous JavaScript runtime and a minimalist web framework for efficient API development.
- **Mongoose, MongoDB**: Utilizes Mongoose for elegant object data modeling, enabling seamless interaction with a MongoDB NoSQL database for persistent storage and querying of string analysis results.
- **Comprehensive String Analysis**: Automatically calculates various string properties including length, palindrome status, unique character count, word count, SHA256 hash, and a detailed character frequency map.
- **Advanced Filtering**: Supports querying strings based on their computed properties such as palindrome status, specified length ranges, exact word counts, and the presence of particular characters.
- **Natural Language Querying**: Interprets human-readable queries to filter strings, allowing for intuitive data retrieval, significantly enhancing user experience.
- **RESTful API Design**: Implements standardized HTTP methods and predictable URLs for managing string resources, ensuring a clean and consistent API interface.
- **Centralized Error Handling**: Incorporates middleware for graceful error management and clear 404 responses, improving API reliability and user feedback.

## Getting Started
To set up the String Analyzer Service API locally, follow these steps:

### Installation
First, clone the repository and install the dependencies:

🚀 **Clone the Repository:**
```bash
git clone https://github.com/dprof-code/string-analyzer-service.git
cd string-analyzer-service
```

📦 **Install Dependencies:**
```bash
npm install
# or
yarn install
```

### Environment Variables
Create a `.env` file in the root directory of the project and populate it with the following required variables:

- `PORT`: The port number on which the Express server will run.
  - *Example*: `PORT=5000`
- `DB_URI`: The MongoDB connection URI.
  - *Example*: `DB_URI=mongodb+srv://<username>:<password>@string-analyzer-cluster.pws0m6l.mongodb.net/?retryWrites=true&w=majority&appName=string-analyzer-cluster`
- `NODE_ENV`: The environment mode (e.g., `development`, `production`). This affects error stack trace visibility.
  - *Example*: `NODE_ENV=development`

## Usage
Once the project is installed and environment variables are configured, you can start the development server:

🚀 **Start the Development Server:**
```bash
npm run dev
```
The API will be running on `http://localhost:<PORT>` (e.g., `http://localhost:5000`). You can interact with the endpoints using tools like Postman, Insomnia, or cURL.

**Example using `curl` to create a string:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"value": "hello world"}' http://localhost:5000/strings
```

**Example using `curl` to get strings that are palindromes and longer than 3 characters:**
```bash
curl http://localhost:5000/strings?is_palindrome=true&min_length=3
```

## API Documentation
### Base URL
`http://localhost:<PORT>/strings` (or `http://localhost:5000/strings` with example PORT)

### Endpoints
#### POST /strings
**Overview**: Analyzes a new string value and stores its computed properties in the database.
**Request**:
```json
{
  "value": "example string for analysis"
}
```
**Response**:
```json
{
  "_id": "65e6e7c1c7b8e1f0a3c7b8e1",
  "id": "a9b3d1c4e7f0a2b6c8d0e9f1a3b5c7d9e0f2a4b8",
  "value": "example string for analysis",
  "properties": {
    "length": 27,
    "is_palindrome": false,
    "unique_characters": 13,
    "word_count": 5,
    "sha256_hash": "a9b3d1c4e7f0a2b6c8d0e9f1a3b5c7d9e0f2a4b8c1d5e0f9a7b2c6d4e1f8a3b7",
    "character_frequency_map": {
      "e": 3,
      "x": 1,
      "a": 4,
      "m": 1,
      "p": 1,
      "l": 1,
      "s": 3,
      "t": 1,
      "r": 2,
      "i": 2,
      "n": 2,
      "g": 2,
      "f": 1,
      "o": 1
    }
  },
  "created_at": "2024-03-05T10:00:00.000Z",
  "__v": 0
}
```
**Errors**:
- `400 Bad Request`: Invalid request body or missing "value" field.
  ```json
  {
    "message": "Invalid request body or missing \"value\" field"
  }
  ```
- `409 Conflict`: String already exists in the system.
  ```json
  {
    "message": "String already exists in the system"
  }
  ```
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string).
  ```json
  {
    "message": "Invalid request body or missing data type for \"value\" (must be string)"
  }
  ```
- `500 Internal Server Error`: Generic server error.

#### GET /strings
**Overview**: Retrieves a list of analyzed strings, with optional filtering capabilities based on string properties.
**Query Parameters**:
- `is_palindrome`: `true` or `false` (boolean string to filter for palindromic status)
- `min_length`: `number` (minimum length inclusive)
- `max_length`: `number` (maximum length inclusive)
- `word_count`: `number` (exact word count)
- `contains_character`: `string` (a single character to check for its presence in the string)
**Example Request**:
`GET /strings?is_palindrome=true&min_length=5`
**Response**:
```json
{
  "data": [
    {
      "id": "65e6e7c1c7b8e1f0a3c7b8e2",
      "value": "madam",
      "properties": {
        "length": 5,
        "is_palindrome": true,
        "unique_characters": 3,
        "word_count": 1,
        "sha256_hash": "...",
        "character_frequency_map": { "m": 2, "a": 2, "d": 1 }
      },
      "created_at": "2024-03-05T10:01:00.000Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```
**Errors**:
- `400 Bad Request`: Invalid query parameter detected.
  ```json
  {
    "message": "Invalid query parameter detected: invalid_param."
  }
  ```
- `500 Internal Server Error`: Generic server error.

#### GET /strings/filter-by-natural-language
**Overview**: Filters strings based on a natural language query, interpreting human-readable phrases into database filters.
**Query Parameters**:
- `query`: `string` (e.g., "find me palindromic strings longer than 5 containing the letter a")
**Example Request**:
`GET /strings/filter-by-natural-language?query=find%20me%20palindromic%20strings%20longer%20than%205%20containing%20the%20letter%20a`
**Response**:
```json
{
  "data": [
    "madam",
    "level",
    "refer"
  ],
  "count": 3,
  "interpreted_query": {
    "original": "find me palindromic strings longer than 5 containing the letter a",
    "parsed_filters": {
      "is_palindrome": true,
      "min_length": 6,
      "contains_character": "a"
    }
  }
}
```
**Errors**:
- `400 Bad Request`: Unable to parse natural language query.
  ```json
  {
    "message": "Unable to parse natural language query"
  }
  ```
- `500 Internal Server Error`: Generic server error.

#### GET /strings/:string
**Overview**: Retrieves the full analysis details for a specific string value.
**Path Parameters**:
- `string`: `string` (The actual string value to retrieve, e.g., "hello")
**Example Request**:
`GET /strings/hello`
**Response**:
```json
{
  "id": "a9b3d1c4e7f0a2b6c8d0e9f1a3b5c7d9e0f2a4b8",
  "value": "hello",
  "properties": {
    "length": 5,
    "is_palindrome": false,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "a9b3d1c4e7f0a2b6c8d0e9f1a3b5c7d9e0f2a4b8c1d5e0f9a7b2c6d4e1f8a3b7",
    "character_frequency_map": { "h": 1, "e": 1, "l": 2, "o": 1 }
  },
  "created_at": "2024-03-05T10:00:00.000Z"
}
```
**Errors**:
- `404 Not Found`: String does not exist in the system.
  ```json
  {
    "message": "String does not exist in the system"
  }
  ```
- `500 Internal Server Error`: Generic server error.

#### DELETE /strings/:string
**Overview**: Deletes a specific string and its analysis from the database.
**Path Parameters**:
- `string`: `string` (The actual string value to delete, e.g., "world")
**Example Request**:
`DELETE /strings/world`
**Response**:
- `204 No Content` (Empty body on successful deletion)
**Errors**:
- `404 Not Found`: String does not exist in the system.
  ```json
  {
    "message": "String does not exist in the system"
  }
  ```
- `500 Internal Server Error`: Generic server error.

## Technologies Used
| Technology | Description |
| :--------- | :---------- |
| [Node.js](https://nodejs.org/) | A powerful JavaScript runtime for server-side development. |
| [Express.js](https://expressjs.com/) | A fast, unopinionated, minimalist web framework for Node.js. |
| [Mongoose](https://mongoosejs.com/) | An elegant MongoDB object data modeling (ODM) library for Node.js. |
| [MongoDB](https://www.mongodb.com/) | A leading NoSQL document database known for scalability and flexibility. |
| [Dotenv](https://www.npmjs.com/package/dotenv) | A zero-dependency module that loads environment variables from a `.env` file. |

## Contributing
We welcome contributions to enhance the String Analyzer Service! If you're interested in improving this project, please follow these guidelines:

✨ Fork the repository to your GitHub account.
🌿 Create a new branch for your feature or bug fix (e.g., `git checkout -b feature/add-new-analysis`).
🛠️ Make your changes, ensuring code quality and functionality. (While no dedicated test script is provided, consider adding tests for new features.)
💬 Commit your changes with a clear and descriptive message (e.g., `git commit -m 'feat: Implement new string property calculation'`).
⬆️ Push your changes to your forked repository (`git push origin feature/add-new-analysis`).
🚀 Open a pull request against the `main` branch of this repository, detailing your changes.

## License
This project is licensed under the ISC License. For more details, refer to the `license` field in the `package.json` file.

## Author Info
Developed by a passionate backend developer dedicated to building robust and efficient services.

- [Twitter](https://twitter.com/pr0devs)
- [Portfolio](https://prodevx.site)

---
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?logo=mongoose)](https://mongoosejs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)