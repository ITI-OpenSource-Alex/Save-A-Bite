# 🧠 Smart Note App

A secure **Node.js + GraphQL** note-taking application with user authentication, profile uploads, AI-powered summarization, and Docker support.

---

## 🚀 Features
- 🔐 **JWT Authentication (asymmetric)** with token revocation  
- 📝 **Create & Delete Notes**  
- 📊 **GraphQL Notes Query** with filters & pagination  
- 📷 **Upload Profile Picture** (Multer with safe filename handling)  
- 🔁 **Password Reset via OTP** (email-based)  
- 🤖 **AI Note Summarizer** using OpenAI API  
- 🛡️ **Security Middleware** (Rate Limiter)  
- 🐳 **Dockerized** for easy deployment  

---

## 📦 Tech Stack
- **Backend**: Node.js, Express, GraphQL (Apollo)  
- **Database**: MongoDB  
- **Auth & Security**: JWT (RSA), Bcrypt, Joi, Multer, Nodemailer  
- **AI Integration**: OpenAI API  
- **DevOps**: Docker  
- **Other**: Typedi, dotenv  

---
## 📁 Project Structure
app.ts
/config → Env, DB, keys
/controllers → REST API logic
/graphql → TypeDefs & Resolvers
/models → Mongoose Schemas
/services → Auth, Notes, Email, AI
/middlewares → Auth, RateLimiter, Error Handling
/uploads → Profile Images


---

## ⚙️ Local Setup
```bash
git clone https://github.com/youssefesmail6/smart-note-app.git
cd smart-note-app
npm install
npm run dev

## 🐳 Docker Setup
Dockerfile
FROM satantime/puppeteer-node:20.9.0-buster-slim

COPY . ./app
WORKDIR /app

RUN npm install
ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]

Build & Run
docker build -t smart-note-app .
docker run -p 3000:3000 smart-note-app
---
📄 .env Example
PORT=3000
MONGO_URI=mongodb://localhost:27017/smartnote
OPENAI_API_KEY=sk-...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
PRIVATE_KEY_PATH=./config/private.pem
PUBLIC_KEY_PATH=./config/public.pem
JWT_EXPIRES_IN=1d
---

