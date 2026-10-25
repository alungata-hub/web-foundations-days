
# Library API Design

## Overview

The Library API manages books in a library system. It allows clients
to retrieve, create, update, delete, and search for books.

**Base path:** `/books`

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Retrieves a list of all books.
- **Success status:** `200 OK`
- **Example request:** `GET /books`

### 2. Get one book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Retrieves a single book using its ID.
- **Success status:** `200 OK`
- **Example request:** `GET /books/42`

### 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book using the supplied details.
- **Success status:** `201 Created`
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  }
  ```

### 4. Update a book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Success status:** `200 OK`
- **Example request:** `PUT /books/42`
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "publishedYear": 1958
  }
  ```

### 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes a book using its ID.
- **Success status:** `204 No Content`
- **Example request:** `DELETE /books/42`

### 6. List books by author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Retrieves books written by the specified author.
- **Success status:** `200 OK`
- **Example request:** `GET /books?author=Chinua%20Achebe`

## Error Responses

### 400 Bad Request

Returned when the request is invalid or contains missing or
incorrect data.

**Example scenario:** A client tries to create a book without
providing the required title.

**Example response body:**

```json
{
  "error": "Bad Request",
  "message": "The title field is required."
}
```

### 404 Not Found

Returned when the requested book does not exist.

**Example scenario:** A client requests `GET /books/9999`, but
there is no book with ID `9999`.

**Example response body:**

```json
{
  "error": "Not Found",
  "message": "The requested book was not found."
}
```
