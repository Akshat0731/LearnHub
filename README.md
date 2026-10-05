# LearnHub - Online Learning Platform

LearnHub is a full-stack online learning platform where students browse courses, enroll, track their progress and leave course feedback. Admins get a dashboard to manage courses, users and contact messages, with a live enrollment chart and YouTube-based course content.

## Features

- Browse all courses and open a course page with an embedded YouTube video or playlist
- Enroll in courses (duplicate enrollments are blocked by a unique `{user, course}` index)
- Student dashboard with enrolled courses and progress
- Course feedback with 1-5 star ratings
- Contact form (messages are stored for the admin)
- Admin dashboard with total users / courses / enrollments and a weekly enrollment chart (Chart.js, real data)
- Admin: add, edit, delete courses; view and delete users; read contact messages
- Deleting a course or a user also deletes their enrollments and feedback
- Session-based authentication with bcrypt password hashing
- Sessions stored in MongoDB (connect-mongo), session id regenerated on login (prevents session fixation)
- Role-based access control (student / admin) on both the REST API and the pages
- Request inputs validated with Joi and sanitized against NoSQL injection
- One central error handler (ExpressError + wrapAsync), JSON for the API, an error page for browsers
- Modular routing using Express Router, separate controllers

## Technologies Used

Node.js, Express.js, MongoDB, Mongoose, express-session, connect-mongo, bcryptjs, Multer, dotenv, Joi, HTML, CSS, JavaScript, Chart.js

## Run it

You need Node 18+ and MongoDB (local, or a free MongoDB Atlas cluster).

```bash
npm install
npm run init-db     # fills the database with sample data (WARNING: deletes existing data)
npm start           # http://localhost:3000
npm run dev         # same, but restarts on every file change (nodemon app.js)
```

The `.env` file is already set for a local MongoDB (`mongodb://127.0.0.1:27017/learnhub`). For Atlas, put your connection string in `MONGO_URI`. See `.env.example`.

`npm run init-db` creates these accounts:

| Role | Email | Password |
|---|---|---|
| admin | admin@learnhub.com | admin12345 |
| student | aarav@learnhub.com | student123 |
| student | diya@learnhub.com | student123 |
| student | rohan@learnhub.com | student123 |
| student | isha@learnhub.com | student123 |

Plus 6 courses, 9 enrollments (spread over the last 30 days so the chart has data), 4 feedback entries and 2 contact messages. Change these passwords before deploying.

## Project structure

```
app.js                 app setup: sessions, routes, 404, central error handler
middleware.js          isLoggedIn, isAdmin, validators, sanitizer, notFound, errorHandler
schema.js              Joi schemas
config/db.js           MongoDB connection
models/                user, course, enrollment, feedback, contact
controllers/           auth, courses, enrollments, feedback, contact, admin
routes/                auth, course, enrollment, feedback, contact, admin, pages
utils/                 ExpressError, wrapAsync
init/                  data.js + index.js (sample data for testing)
views/                 HTML pages (served only through routes/pages.js, so they can be guarded)
public/                static files: images, js (navbar, utils), partials (navbar, footer)
```

## Page routes

| Route | Access |
|---|---|
| `/` , `/courses`, `/courses/:id`, `/contact`, `/login`, `/register` | public |
| `/courses/:id/feedback`, `/student/dashboard` | logged in |
| `/admin/dashboard`, `/admin/courses`, `/admin/courses/new`, `/admin/courses/:id/edit`, `/admin/users`, `/admin/contacts` | admin |

## REST API

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` | - |
| GET | `/api/auth/session` | - |
| GET | `/api/courses`, `/api/courses/:id` | - |
| POST | `/api/contact` | - |
| GET | `/api/feedback?course_id=` | - |
| POST | `/api/feedback` | logged in |
| POST | `/api/enrollments` | logged in |
| GET | `/api/enrollments/me` | logged in |
| GET | `/api/admin/stats` | admin |
| GET, POST | `/api/admin/courses` | admin |
| PUT, DELETE | `/api/admin/courses/:id` | admin |
| GET | `/api/admin/users` | admin |
| DELETE | `/api/admin/users/:id` | admin |
| GET | `/api/admin/contacts` | admin |

## Error handling

Controllers just throw (`throw new ExpressError(404, "Course not found")`). `wrapAsync` passes every error to `next`, and the single `errorHandler` in `middleware.js` turns it into a response. It also understands Mongoose validation errors, bad ids, duplicate keys (duplicate email -> 409, duplicate enrollment -> 409), Multer errors and broken JSON. API requests get `{ "status": "error", "message": "..." }`, browser requests get the error page. Unexpected 500 errors are logged and only a generic message is sent to the client.

## Bugs fixed in this version

- **Edit Course never opened**: the page ran `isNaN(courseId)` on a MongoDB id (always true), so it always showed "Invalid course id" and left.
- **Admin dashboard used fake data**: totals came from `localStorage` and the chart used random numbers. It now reads real data from `/api/admin/stats`.
- **Admin logout did not log out**: it only cleared `sessionStorage`. It now calls `/api/auth/logout`.
- **Admin pages were public static files**: anyone could open them (only the API was protected). They are now served through guarded routes.
- **Stored XSS**: names, course text, contact messages and feedback are escaped before being rendered.
- **Sessions on hosting platforms**: `trust proxy` is enabled in production, otherwise the secure cookie is never set behind a proxy and nobody can stay logged in.
- Clearer startup errors (missing `.env`, MongoDB not running) instead of a crash.
