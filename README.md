# Stockify - Inventory Management System

Stockify is a simple inventory management system built with Node.js, Express, and MongoDB. It allows users to manage inventory items, track stock levels, and view analytics. The system includes JWT-based authentication and CRUD operations for items.

## Features

- **User Authentication**: Register and log in with JWT token security.
- **Inventory Management**:
  - Add, update, delete, and view items.
  - Track item details (name, description, quantity, price, category).
- **Analytics**:
  - Total stock value calculation.
  - Filter items by category or price range.
  - Low-stock items alert (quantity < 10).
- **API Documentation**: Interactive Swagger UI for endpoint exploration.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Express Validator
- **Documentation**: Swagger (OpenAPI)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manjunath-elocity/stockify.git
   cd stockify
   npm install
    ```
2. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    ```
3. **Start the server**:
    ```bash
    npm run dev
    ```
4. **Test the API**:
    Open your browser and navigate to [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) to access the interactive Swagger UI for testing the API endpoints.