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

## 4. Run the Project
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
