# School Fee Payment System 🏫💳

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A concurrent SaaS application for educational institutions to manage fee payments, built with Node.js, Express, and MongoDB. Implements SOLID principles and concurrent programming patterns.

## Features ✨
- **Concurrent Payment Processing** using Bull queues
- **Atomic Transactions** with MongoDB sessions
- **Role-Based Access Control** (Admin/Parent)
- **RESTful API** with JWT Authentication
- **Non-Blocking Operations** with Worker Threads
- **Payment History Tracking**

## Tech Stack 🛠️
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Concurrency**: Bull (Redis), Worker Threads
- **Auth**: JWT, Bcrypt
- **Validation**: Express Async Handler

## Installation ⚙️
1. Clone repo:
```bash
git clone https://github.com/HassanAliMashwani/School_Fee_Payment_System.git
cd School_Fee_Payment_System
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env`):
```env
MONGODB_URI=mongodb://localhost:27017/school_fee
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
PORT=8000
```

4. Start Redis server (required for queues):
```bash
redis-server
```

5. Run application:
```bash
npm start
```

## API Endpoints 📡
| Endpoint                | Method | Description                  | Auth Required |
|-------------------------|--------|------------------------------|---------------|
| `/api/users/register`   | POST   | User registration            | No            |
| `/api/users/login`      | POST   | User login                   | No            |
| `/api/payments`         | POST   | Create payment               | Yes (Parent)  |
| `/api/schools`          | POST   | Create school                | Yes (Admin)   |
| `/api/students`         | POST   | Register student             | Yes (Admin)   |

## Concurrency Features ⚡
1. **Bull Queues**  
   ```javascript
   // services/PaymentQueue.js
   const paymentQueue = new Queue('payments', process.env.REDIS_URL);
   paymentQueue.process(async (job) => {
     // Thread-safe payment processing
   });
   ```

2. **MongoDB Transactions**  
   ```javascript
   const session = await mongoose.startSession();
   session.startTransaction();
   try {
     await Payment.create([...], { session });
     await User.updateOne({...}, { session });
     await session.commitTransaction();
   } catch (error) {
     await session.abortTransaction();
   }
   ```

3. **Atomic Operations**  
   ```javascript
   // models/paymentModel.js
   paymentSchema.index({ user: 1, date: 1 }, { unique: true });
   ```

## System Design 🏗️
### UML Class Diagram
![UML Diagram](https://via.placeholder.com/600x400.png?text=UML+Class+Diagram)

### Sequence Diagram
![Payment Flow](https://via.placeholder.com/600x400.png?text=Payment+Sequence+Diagram)

## 🙏 Acknowledgments
### 📚 Course: 
**Software Construction and Design**

### 👩‍🏫 Instructor: 
**Hifza Ali**

## Contributors 👥
- [Hassan Ali Mashwani](https://github.com/HassanAliMashwani)
- [Syed Ghazi Raza Kazmi](https://github.com/Ghazi-Kazmi)
- [M.Aalyan Mughal](https://github.com/allayanmughal)

## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
## Project Inspired By:
Link of Project (https://github.com/kalbek/schoolfeepayment)

