# LearnHub - Online Learning Platform

**LearnHub** is a full-stack online learning platform where students can browse courses, enroll, track their progress, and leave course feedback. Admins get a dashboard to manage courses, users, and contact messages, with a live enrollment chart and YouTube-based course content.

It is built to provide practical experience in developing a complete web application with **frontend, backend, database, authentication, authorization, validation, and centralized error handling**.

## Features

* Browse all courses and view a course page with an embedded YouTube video or playlist
* Enroll in courses with duplicate enrollments blocked using a unique `{user, course}` index
* Student dashboard with enrolled courses and progress
* Course feedback with **1-5 star ratings**
* Contact form with messages stored for the admin
* Admin dashboard showing total users, courses, and enrollments
* Weekly enrollment chart using **Chart.js** with real data
* Admin: add, edit, and delete courses
* Admin: view and delete users
* Admin: read contact messages
* Deleting a course or user also deletes their enrollments and feedback
* User signup, login, and logout
* Session-based authentication with **bcrypt password hashing**
* Sessions stored in MongoDB using **connect-mongo**
* Session ID regenerated on login to prevent session fixation
* Role-based access control (**student / admin**) on both pages and REST API
* Server-side validation using **Joi**
* Input sanitization against NoSQL injection
* XSS protection by escaping user-generated content
* Custom error handling using **ExpressError** and **wrapAsync**
* Centralized error handler with JSON responses for API requests and error pages for browsers
* Custom 404 handling
* Modular routing using **Express Router**
* MVC-style structure with separate controllers

## Technologies Used

### Frontend

* HTML
* CSS
* JavaScript
* Chart.js

### Backend

* Node.js
* Express.js
* Express Router

### Database

* MongoDB
* Mongoose

### Authentication and Authorization

* express-session
* connect-mongo
* bcryptjs
* Role-based middleware (`isLoggedIn`, `isAdmin`)

### Validation and Error Handling

* Joi
* ExpressError
* wrapAsync
* Centralized error handler

### Other Tools

* Multer
* dotenv
* Nodemon
* Git
* GitHub

## CRUD Operations

### Create

* Add courses by admins
* Create enrollments
* Add course feedback
* Submit contact messages

### Read

* View courses
* View course details
* View student dashboard
* View feedback
* View users
* View contact messages
* View admin statistics

### Update

* Edit existing courses by admins

### Delete

* Delete courses
* Delete users by admins
* Delete related enrollments and feedback

## Architecture

LearnHub follows an **MVC-style architecture** to keep the application organized and maintainable.

### Model

Mongoose schemas for:

* User
* Course
* Enrollment
* Feedback
* Contact

### View

HTML pages served only through guarded routes.

### Controller

Application logic for:

* Authentication
* Courses
* Enrollments
* Feedback
* Contact
* Admin

Routes are modular, with a separate router for each feature.

## Authentication and Authorization

LearnHub uses **session-based authentication**.

### Users can

* Create an account
* Log in and log out
* Browse courses
* Enroll in courses
* Give feedback on courses
* View their own dashboard

### Admins can

* Manage courses
* Manage users
* View contact messages
* View dashboard statistics

Admin pages are served through **guarded routes**, so they cannot be opened by regular users or visitors.

throw new
```
