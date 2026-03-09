# Finance Tracker

## Description

A full-stack finance tracking application built with React (Frontend) and Node.js / Express (Backend) with MongoDB as the database.
This application allows users to record income and expenses, track financial activity, and monitor spending through a simple and responsive interface. The system provides secure API endpoints for managing financial transactions and storing data efficiently.

## Key Features

- Add income and expense transactions
- View complete transaction history
- Delete transactions
- Real-time balance calculation
- RESTful API for transaction management
- Responsive user interface

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| API Communication | Axios |
| Version Control | GitHub |

## File Structure

```
Finance_Tracker/
│
├── backend/
│   ├── server.js              # Express server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── Transaction.js     # Transaction schema
│   ├── routes/
│   │   └── transactionRoutes.js # API routes
│   ├── controllers/
│   │   └── transactionController.js # Business logic
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTransaction.js
│   │   │   ├── TransactionList.js
│   │   │   └── Balance.js
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   │
│   ├── package.json
│   └── .gitignore
│
├── README.md
└── .gitignore
```

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB database (local or cloud)

### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server
   ```bash
   node server.js
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the React app
   ```bash
   npm start
   ```

Frontend will run on `http://localhost:3000`

## Usage

### Adding a Transaction

1. Open the application
2. Enter transaction details
3. Choose income or expense
4. Click Add Transaction
5. The transaction will be saved to the database.

### Viewing Transactions

- All transactions appear in the transaction history list
- The system automatically calculates:
  - Total Balance
  - Total Income
  - Total Expenses

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### 1. Add Transaction

**POST** `/transactions`

**Request body**
```json
{
  "title": "Salary",
  "amount": 5000,
  "type": "income"
}
```

**Response**
```json
{
  "message": "Transaction added successfully"
}
```

### 2. Get All Transactions

**GET** `/transactions`

**Response**
```json
[
  {
    "id": 1,
    "title": "Salary",
    "amount": 5000,
    "type": "income"
  }
]
```

### 3. Delete Transaction

**DELETE** `/transactions/:id`

**Response**
```json
{
  "message": "Transaction deleted successfully"
}
```

## Running the Full Application

### Terminal 1 — Backend
```bash
cd backend
node server.js
```

### Terminal 2 — Frontend
```bash
cd frontend
npm start
```

**Note:** Both servers must run simultaneously.

- Frontend → http://localhost:3000
- Backend → http://localhost:5000

## Future Enhancements

- User authentication system
- Monthly expense analytics
- Charts and visual dashboards
- Budget limit alerts
- Export transactions as CSV

## Author

Prajwal Shetty

## Support

If you encounter any issues or want to suggest improvements, please open an issue in the repository.