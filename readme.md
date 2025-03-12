# Snippets API

## Overview

The **Snippets API** allows users to store, retrieve, update, and delete code snippets. It also supports filtering, sorting, and pagination.

## Features

- **Create** a new code snippet
- **Retrieve** all snippets with filtering options
- **Get** a single snippet by ID
- **Update** an existing snippet
- **Delete** a snippet
- **Dashboard** with EJS rendering and filtering options

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/snippets-api.git
   ```
2. Navigate to the project folder:
   ```sh
   cd snippets-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add your MongoDB connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
5. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### 1. Create a Snippet

**POST** `/api/snippets`

#### Request Body (JSON):

```json
{
  "title": "Example Snippet",
  "code": "console.log('Hello World!');",
  "language": "JavaScript",
  "tags": ["console", "log"],
  "expiresIn": 3600
}
```

#### Response:

```json
{
  "_id": "123456",
  "title": "Example Snippet",
  "code": "Y29uc29sZS5sb2coJ0hlbGxvIFdvcmxkIScpOw==",
  "language": "JavaScript",
  "tags": ["console", "log"],
  "createdAt": "2024-03-12T12:00:00.000Z"
}
```

### 2. Get All Snippets

**GET** `/api/snippets`

#### Query Parameters (optional):

- `language=JavaScript` → Filter by programming language (case-insensitive)
- `tags=async,fetch` → Filter by one or more tags (case-insensitive)
- `page=1&limit=10` → Pagination (default 10 per page)
- `sort=createdAt&order=desc` → Sort snippets by date (newest first)

### 3. Get Snippet by ID

**GET** `/api/snippets/:id`

### 4. Update a Snippet

**PUT** `/api/snippets/:id`

#### Request Body (JSON):

```json
{
  "title": "Updated Snippet",
  "code": "console.log('Updated');",
  "language": "JavaScript",
  "tags": ["update"]
}
```

### 5. Delete a Snippet

**DELETE** `/api/snippets/:id`

## Dashboard

The dashboard is accessible at:

```
http://localhost:5000/dashboard
```

It displays all snippets with filtering options for **language** and **tags**.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **TypeScript**
- **EJS** (for rendering the dashboard)
- **Cors** & **dotenv** for environment handling

## License

This project is open-source and available under the **MIT License**.
