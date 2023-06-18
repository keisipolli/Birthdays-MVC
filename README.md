## BirthdayBook

BirthdayBook is a simple express app that allows you to create a list of Your friends birthdays.

### Installation

1. Clone the repo
2. Make backend/certs folder and certificate and key with next command: `mkdir backend/certs && cd backend/certs && openssl req -nodes -new -x509 -keyout server.key -out server.cert && cd ../..`
3. Run `cp backend/.env.example backend/.env` to create the backend environment file
4. Run `cp frontend/.env.example frontend/.env` to create the frontend environment file
5. Adding Google OAuth Credentials (GOOGLE_CLIENT_ID) to the Backend/Frontend Environment Files:
  5.1 Go to the Google Cloud Console by visiting https://console.cloud.google.com/
  5.2 Click on the "Select a project" and choose "New Project" to create a new project
  5.3 Provide a name for your project and click on "Create"
  5.4 In the left sidebar, navigate to "APIs & Services" and select "OAuth consent screen"
  5.5 Choose the "External" option and click on "Create" to configure the consent screen
  5.6 Fill in the required fields such as "App name", "User support email" and "Developer contact information" and click "Save and continue"
  5.7 For Scopes and Test users, you can skip these sections for now by clicking "Save and continue."
  5.8 In the left sidebar, go to "APIs & Services" and select "Credentials"
  5.9 Click on the "Create Credentials" button and choose "OAuth client ID" from the dropdown menu.
  5.10 Select "Web Application" as the Application type.
  5.11 Enter a name for your OAuth client.
  5.12 In the "Authorized JavaScript origins" field, add: "https://localhost:5173"
  5.13 In the "Authorized redirect URIs" field, add: "https://localhost:3000/google-login"
  5.14 Click "Create" to generate your OAuth client credentials.
  5.15 Once the credentials are created, copy the Client ID.
  5.16 Open the backend/.env file and paste the Client ID into the appropriate field.
  5.17 Similarly, open the frontend/.env file and paste the Client ID there as well.
6. Run `npm run install` to install the dependencies for both the frontend and the backend
7. Run `cd backend && npx prisma db push && cd ..` to create the database tables
8. Run `npm run dev` from the project root directory to start the frontend and the backend servers at the same time
9. Go to browser, open `https://localhost:3000`. You get `Your connection is not private` error, choose `advanced` and press `proceed to localhost (unsafe)` to run app in HTTPS protocol
10. Go to `https://localhost:5173` to see the app
11. Go to `https://localhost:3000/log` to see logs

### Documentation

The API documentation is at [https://localhost:3000/docs](https://localhost:3000/docs)


### Tests

To run tests, run `npm test`

