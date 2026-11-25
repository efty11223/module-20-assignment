# Library Management API

A beginner-friendly REST API for managing library books and borrowing. It uses **Node.js**, **Express 5**, **MongoDB**, and **Mongoose**. All files use CommonJS (`require` and `module.exports`).

## Get started

1. Install Node.js 18 or newer and make sure MongoDB is running.
2. In this folder, install the packages:

   ```sh
   npm install
   ```

3. Copy `.env.example` to a new file named `.env`. The default MongoDB URL works with a local MongoDB server. Set `JWT_SECRET` to a long, private value.
4. Start the development server:

   ```sh
   npm run dev
   ```

The API runs at `http://localhost:3000`. Use `npm start` to run it without the development file watcher.

## How the project is organized

- `server.js` connects to MongoDB and starts the server.
- `app.js` creates the Express app and adds middleware and routes.
- `routes/` connects each URL to its controller.
- `controllers/` contains the code that handles requests.
- `models/` defines the MongoDB data using Mongoose.
- `middleware/` contains shared request handling, authentication, and error handling.
- `config/` contains the database connection.
- `utils/` contains small shared helpers.

In Express 5, rejected promises from `async` route handlers are passed to the error middleware automatically. Controllers can therefore use ordinary `async` functions without an extra wrapper.

## Try it out

Check that the server is running:

```http
GET /api/health
```

Register with `POST /api/auth/register` using JSON like:

```json
{
  "fullName": "Alex Reader",
  "email": "alex@example.com",
  "password": "a-long-password"
}
```

The response includes a token. Include it on routes that require a signed-in user:

```http
Authorization: Bearer <token>
```

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create an account and receive a token |
| POST | `/api/auth/login` | Public | Sign in and receive a token |
| GET | `/api/books` | Public | List books |
| GET | `/api/books/:id` | Public | Get one book |
| POST | `/api/books` | Signed in | Add a book |
| PUT | `/api/books/:id` | Owner or admin | Edit a book |
| DELETE | `/api/books/:id` | Owner or admin | Delete a book with no active borrows |
| POST | `/api/borrow` | Signed in | Borrow a book using `{ "bookId": "..." }` |
| PUT | `/api/borrow/:id/return` | Borrowing user | Return a book |
| GET | `/api/users/profile` | Signed in | View your profile |
| PUT | `/api/users/profile` | Signed in | Update your name or phone number |
| GET | `/api/users/borrowed-books` | Signed in | View your borrowing history |
| GET | `/api/health` | Public | Check the server status |

Book listing supports `search`, `category`, `page`, `limit` (up to 100), and `sort=asc` query parameters. Responses use `{ "success": true, "message": "...", "data": ... }`. Errors use `{ "success": false, "message": "..." }`.

Public registration always creates a regular user. To create an administrator for development, update a user's `role` to `ADMIN` directly in MongoDB.
