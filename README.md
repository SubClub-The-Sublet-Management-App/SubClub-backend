# SubClub - The Sublet Management App

🌎 [Deployed Server](https://sub-club-ce3cc207c2f9.herokuapp.com/)

## Overview

Sub.club is a web application that addresses Victoria's housing challenges by providing a streamlined solution for those looking to share their home by subletting. 

The server side of this application provides the user with a way to simplify the management of all the information that comes with the subletting process, such as storing and managing occupants (tenant), rooms, agreements, payment information records, all in one place.

## Main features:


#### User account:

- Create a user account
- Login authentication with JWT

#### Rooms:

- Creating room 
- View all rooms
- View room by id
- Update room by id
- Delete room by id


#### Occupants:

- Creating occupant profile
- View all room assignments
- View occupant by id
- Update occupant by id
- Delete occupant by id


#### Room Assignment:

- Creating room assignment
- View all room assignments
- View room assignment by id
- Update room assignment by id
- Delete room assignment by id


## Installation Instructions

To use the production application, please visit [The SubClub App](https://thesubclubapp.netlify.app/) and create an account, and enjoy using the application!


*To use the server side of the application locally, please follow the below instructions.*

### Requirements:

- **Node.js v18.18.0**
- **MongoDB Atlas account**. *If you do not have MongoDB please visit [MongoBD Atlas](https://www.mongodb.com/docs/atlas/) and create a free account.*
 
- **Postman**. *If you do not have the application installed, follow the instructions to [install postman](https://www.postman.com/downloads/) for free on your computer.*

### SubClub App Local Setup Guide

#### Server:

1. **Create a Directory:**
   Open your terminal and create a directory for the SubClub app server side on your machine.

   ```bash
   mkdir SubClub-backend
   cd SubClub-backend
   ```

2. **Clone the Server Repo:**
   Clone the server repository into the newly created directory.

   ```bash
   git clone git@github.com:SubClub-The-Sublet-Management-App/SubClub-backend.git
   cd server
   ```

3. **Install Dependencies:**
   Install the required npm packages for the server.

   ```bash
   npm install
   ```

4. **Create .env file:**
    In the server directory, create a .env file and add your MongoDB Atlas [Connection String](https://www.mongodb.com/docs/guides/atlas/connection-string/), and the other variables for the set up.

```bash
    DB_URI=YourMongoDBAtlasConnectionStringHere

    PORT=3030 # or any other different to the one used by the client if using together 

    JWT_KEY=YourSecretKeyHere
```

5. **Start the Server:**
   Start the local server.

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3030`.

6. **Send request through the postman**

    - Step 1: Open Postman.
    - Step 2: Click on the "New" button to create a new request.
    - Step 3: Set Request Details
    - Step 4: Send the Request
    - Step 5: Review the Response

7. **Add authentication**

    After create an account and login, add your token on the header section of each request. 
    
    *Place your token on the header like this:*
    ![set authentication](./readme-img/Add-token-to-headers.png)


You have successfully set up and run the SubClub backend server locally with MongoDB Atlas. Explore the features and enjoy using the application!
_____

## Backend End Points 

| Endpoint | HTTP Method | Description |
|----------|-------------|-------------|
| `/auth/login` | POST | Authenticate a user and return a token |
| `/auth/signup` | POST | Register a new user |
| `/users/profile` | GET | View user profile |
| `/users/profile` | PATCH | Update user profile |
| `/users/delete` | DELETE | Delete user account |
| `/rooms` | GET | Get a list of all rooms |
| `/rooms/:id` | GET | Get details of a room by id |
| `/rooms` | POST | Create a new room |
| `/rooms/:id` | PATCH | Update a room by id |
| `/rooms/:id` | DELETE | Delete a room by id |
| `/occupants` | GET | Get a list of all occupants |
| `/occupants/:id` | GET | Get details of an occupant by id |
| `/occupants` | POST | Create a new occupant |
| `/occupants/:id` | PATCH | Update an occupant by id |
| `/occupants/:id` | DELETE | Delete an occupant by id |
| `/room-assignments` | GET | Get a list of all room assignments |
| `/room-assignments/:id` | GET | Get details of a room assignment by id |
| `/room-assignments` | POST | Create a new room assignment |
| `/room-assignments/:id` | PATCH | Update a room assignment by id|
| `/payment-records` | GET | Get a list of all payment records |
| `/payment-records/:id` | GET | Get details of a payment record by id |
| `/payment-records` | POST | Create a new payment record |
| `/payment-records/:id` | PATCH | Update a payment record by id|

_____


## Screenshot of how to use the server with POSTMAN

### Create and account successfully

![Create an account](./readme-img/POST-user-succesfull-signup.png)

### Signup - email validation

![Validate user email](./readme-img/POST-user-signup-email-validation.png)

### Signup - password validation

![Validate user password](./readme-img/POST-user-signup-password-validation.png)


### Signup - required input
![validate require fields](./readme-img/POST-user-validate-required-fields.png)


### Login successfully

![Login succesfully](./readme-img/POST-Auth-user-succesfull-logIn.png)

### Update user profile

![Update user profile](./readme-img/PATCH-update-user-profile.png)

### View user profile

![View user profile](./readme-img/GET-view-user-profile.png)

### Delete user account

![Delete user account](./readme-img/DELETE-user-account.png)



### View all rooms

![View all rooms](./readme-img/GET-all-rooms.png)

### View room  by id

![View room by id](./readme-img/GET-view-room-by-ID.png)

### Update room by id

![Update room by id](./readme-img/PATCH-update-room-by-id.png)

### Delete room by id
![Delete room by id](./readme-img/DELETE-room-by-ID.png)


### View all occupants

![View all occupants](./readme-img/GET-all-occupants.png)

### View occupant by id

![View occupant by id](./readme-img/GET-occupant-by-ID.png)

### Update occupant by id

![Update occupant by id](./readme-img/PATCH-update-occupant-by-ID.png)

### Delete occupant by id
![Delete occupant by id](./readme-img/DELETE-occupant-by-ID.png)


### View all room assignments

![View all room assignments](./readme-img/GET-all-room-assignments.png)

### View room assignments by id

![View room assignment by id](./readme-img/GET-room-assignment-by-ID.png)

### Update room assignments by id

![Update room assignment by id](./readme-img/PATCH-update-room-assignment-by-ID.png)

### Cancel room assignments by id
![Cancel room assignment by id](./readme-img/PATCH-cancel-room-assignment.png)


### View all payment records

![View all payment records](./readme-img/GET-view-all-payment-records.png)

### View payment records by id

![View payment record by id](./readme-img/GET-view-payment-record-by-ID.png)


### Cancel payment records by id
![Cancel payment record by id](./readme-img/PATCH-cancel-payment-record.png)


## Backend Libraries & Dependencies:

### Production Dependencies:

1. **bcryptjs:**
   - Description: A library for hashing passwords.
   - Usage: Used for securely hashing passwords before storing them in the database.

2. **cors:**
   - Description: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
   - Usage: Allows the backend to handle requests from different origins, especially useful for frontend apps.

3. **dotenv:**
   - Description: Loads environment variables from a `.env` file into `process.env`.
   - Usage: Helps manage environment-specific configuration, such as database connection strings and API keys.

4. **express:**
   - Description: A fast, unopinionated, minimalist web framework for Node.js.
   - Usage: The core framework for building the backend API, handling routes, requests, and responses.

5. **jsonwebtoken:**
   - Description: Implementation of JSON Web Tokens (JWT) for authentication.
   - Usage: Generates and validates JWTs for secure user authentication in the backend.

6. **mongoose:**
   - Description: MongoDB object modeling tool designed to work in an asynchronous environment.
   - Usage: Simplifies interaction with MongoDB databases by providing a schema-based solution for data modeling.

7. **validator:**
   - Description: Library for string validation and sanitization.
   - Usage: Useful for validating and sanitizing user input or other data to ensure it meets specific criteria.

### Development Dependencies:

1. **jest:**
   - Description: JavaScript testing framework.
   - Usage: Used for writing and running unit tests and assertions for the backend codebase.

2. **jest-coverage-badge:**
   - Description: Generates coverage badges for Jest tests.
   - Usage: Creates badges reflecting the test coverage percentage, useful for display in the project repository.

3. **sinon:**
   - Description: Standalone test spies, stubs, and mocks for JavaScript.
   - Usage: Enhances testing by providing tools for creating spies, stubs, and mocks in unit tests.

4. **supertest:**
   - Description: Library for testing HTTP assertions.
   - Usage: Enables testing of HTTP requests and responses in an Express app, particularly useful for integration testing.

