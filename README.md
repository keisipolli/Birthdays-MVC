## BirthdayBook

BirthdayBook is a simple express app that allows you to create a list of Your friends birthdays.

### Installation

1. Clone the repo
2. Make `backend/certs` folder with mkdir `backend/certs` command
3. Generate server certificate and key files and place them in the `backend/certs` directory: `openssl req -nodes -new -x509 -keyout server.key -out server.cert`
4. Run `cp backend/.env.example backend/.env` to create the backend environment file
5. Run `cp frontend/.env.example frontend/.env` to create the frontend environment file
6. Run `npm run install` to install the dependencies for both the frontend and the backend
7. Run `cd backend && npx prisma db push && cd ..` to create the database tables
8. Run `npm run dev` from the project root directory to start the frontend and the backend servers at the same time
9. Go to `localhost:5173` to see the app

### Documentation

The API documentation is at [http://localhost:3000/docs](http://localhost:3000/docs)

### Tests

To run tests, run `npm test`

