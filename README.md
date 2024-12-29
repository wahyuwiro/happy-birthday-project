# Setup Instructions
Follow the steps below to set up and run the project:

## 1. Install Dependencies
Run the following commands to install the required dependencies:

```
# Install dependencies in the root folder
npm install

# Install dependencies in the frontend folder
cd frontend
npm install
cd ..

# Install dependencies in the backend folder
cd backend
npm install
cd ..
```

## 2. Regenerate Prisma Client
Navigate to the backend folder and generate the Prisma Client:

```
cd backend
npx prisma generate
cd ..
```

## 3. Configure Environment Variables
Set up ```.env``` files in the frontend and backend folders based on the provided ```.env.example``` files:

```
# For the frontend folder
cp frontend/.env.example frontend/.env

# For the backend folder
cp backend/.env.example backend/.env
```
### Database Connection
Ensure the ```DATABASE_URL``` variable is correctly configured in the backend ```.env``` file to connect to your PostgreSQL database. For example:
```
DATABASE_URL=postgresql://username:password@host:port/database_name
```


## 4. Cron Job Configuration
The backend includes a cron job that sends birthday messages to users based on their time zones. The cron job is defined in the following file:
```
//backend/src/user/user.service.ts
```

#### Cron Job Details
- **Runs every hour**: The cron job checks user birthdays every hour.
- **Runs at 9 AM local time**: The job determines if it is the user's birthday and if the local time is 9 AM for the user.

#### Notes

- The job fetches all users and checks if their birthday matches the current date and local time is 9 AM.
- If conditions are met, a birthday message is created and sent via an external email service.
- The function for sending messages is ```sendBirthdayMessages```. All messages are logged in the PostgreSQL table ```BirthdayMessage```.
- If a message fails to send, it will be retried the following day based on log data for messages with a status of "not sent", The function for re-sending messages is ```retryFailedMessages```.
- Retry mechanisms and message status updates are implemented for reliability


## 5. Run the Project
Start the backend and frontend services:
```
# Run the backend (in backend folder)
cd backend
npm run start:dev

# Run the frontend (in root folder)
cd ..
npm run dev

```
Your project should now be running! 🎉
