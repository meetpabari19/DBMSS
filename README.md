MERN Road Speed Finder (Single ZIP)
----------------------------------

Structure:
 - backend/    (Express + Mongoose)
    - routes/auth.js   (register/login)
    - routes/api.js    (road-info, checkSpeed)
    - models/SpeedLimit.js, User.js
    - seed.js          (seed speed table)
 - frontend/   (React app)
    - src/ App, Register, Login, Dashboard
    - public/index.html

Quick start:
1. Unzip the project.
2. Install backend deps:
   cd backend
   npm install
3. Start MongoDB (local)
   - Example: run `mongod` or use Docker `docker run -p 27017:27017 -v mongodbdata:/data/db mongo:6`
4. Seed DB:
   node seed.js
5. Start backend:
   npm run dev   # uses nodemon if installed
6. Install frontend & start:
   cd ../frontend
   npm install
   npm start
7. Open http://localhost:3000

Notes:
 - Backend runs on port 4000 by default.
 - Replace JWT secret and Mongo URI for production in environment variables:
    MONGO_URI, JWT_SECRET
 - Overpass API is used to map coordinates to OSM highway tags.