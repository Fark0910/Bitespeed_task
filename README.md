
# Identity Reconciliation Service

A backend service that identifies and links customer contact information (email & phone number) into a unified identity cluster using primary and secondary contacts.

This project is built using:

- Node.js (Express)
- TypeScript (Minimal)
- MySQL (Railway)
- No ORM (Raw Queries via "mysql2/promise")

---

## 🚀 Problem Statement

Customers may interact with the system using:

- Different emails
- Different phone numbers

Over time, multiple entries may exist for the same real person.

This service:

- Creates a Primary Contact
- Links related future contacts as Secondary Contacts
- Merges clusters if two existing primaries are later found to be related

---

🧠 Core Logic

Each contact record has:

- Field| Description
- id| Unique Contact ID
- email| Email (nullable)
- phoneNumber| Phone (nullable)
- linkedId| Points to Primary Contact
- linkPrecedence| primary / secondary
- createdAt| Timestamp
- updatedAt| Timestamp
- deletedAt| Soft delete

Rules:

- First time email/phone → create Primary
- New email with same phone → create Secondary
- New phone with same email → create Secondary
- If both email & phone already exist → No new row
- If two primaries are found related → Merge clusters

---

## 🗂️ Project Structure

src/
├── db/
│   ├── db.ts
│   └── contact.query.ts
├── routes/
│   ├── router.ts
│   └── identify.route.ts
├── services/
│   └── identify.service.ts
├── utils/
│   └── contact.utils.ts
├── helpers/
│   └── merge.helper.ts
├── types/
│   └── identify.types.ts
└── index.ts

---

## 🛠️ Setup Instructions

### 1️⃣ Install Dependencies

npm install

---

### 2️⃣ Environment Variables

Create ".env" file:

- PORT=8080
- sqlDB_HOST=your_host
- sqlDB_USER=your_user
- sqlDB_PASS=your_password
- sqlDB_NAME=railway
- sqlDB_port=your_port

---

### 3️⃣ Create Database Table

Run this SQL on Railway MySQL:

CREATE TABLE Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  phoneNumber VARCHAR(20),
  linkedId INT,
  linkPrecedence ENUM('primary','secondary'),
  createdAt DATETIME,
  updatedAt DATETIME,
  deletedAt DATETIME
);

---
## Architecture, Flow Diagrams and some results


![System Index](uploads/first.png)
![System Index 2](uploads/second.png)
![System Index 3](uploads/third.png)
![test](uploads/test.png)
![finalresponse](uploads/finalresponse.png)
![railwaydb](uploads/mysqldb.png)
### 4️⃣ Run Locally

npm run dev

- Server starts at:
- http://localhost:8080
- use deploy.sh too

## 📡 API Endpoint

### POST "/identify"

### Request Body

{
  "email": "example@test.com",
  "phoneNumber": "123456"
}

Either "email" or "phoneNumber" is required.

---

### Response

{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "example@test.com",
      "other@test.com"
    ],
    "phoneNumbers": [
      "123456",
      "999999"
    ],
    "secondaryContactIds": [2,3]
  }
}

---

### 🧪 Testing (PowerShell)

Invoke-RestMethod -Method POST http://localhost:8080/identify `
-Headers @{"Content-Type"="application/json"} `
-Body '{"email":"test@abc.com","phoneNumber":"123456"}' `
| ConvertTo-Json -Depth 5

---

### ☁️ Deployment

- Database:Railway MySQL
- Backend:Render Node Service

Update production URL and test using:

POST https://your-app.up.railway.app/identify

---

### ✅ Expected Behaviour Summary

- New unique contact → Primary created
- Matching phone/email → Secondary created
- Matching both → No new contact
- Multiple primaries detected → Oldest retained, others linked

---

### 📌 Notes

- Uses raw SQL (no ORM)
- ENUM used for strict precedence control
- Soft delete supported via "deletedAt"

---

### 👨‍💻 Author

Submission for Identity Reconciliation Backend Assignment.






















# Spike AI – Analytics & SEO Intelligence Service

## Overview
This project is an AI-powered analytics and SEO intelligence service built for the **Spike AI Builder Challenge**.

It exposes a single API endpoint that accepts **natural language queries** and intelligently routes them to the correct analysis pipeline using an **orchestrator-based architecture**.

The system combines:
- Google Analytics 4 (GA4) live data
- SEO audit data from Google Sheets
- LLM-based reasoning for structured insights

---



---
## High-Level Architecture

The architecture follows a **tiered agent model** with a central orchestrator.

---

## Architecture, Flow Diagrams and some results

![Basic Architecture](uploads/Basic_architecture.jpeg)
![System Index](uploads/index.png)

![System Index 2](uploads/index_2.png)

![GA4 Data From Source](uploads/ga4_data_from_source.png)

![GA4 Explanation](uploads/explaination_for_ga4.png)

![GA4 Deep Dive Logs](uploads/ga4_deep_dive_logs.png)

![SEO Check](uploads/seo_check.png)
---

## Core Components

### 1. Orchestrator
- Single entry point for all queries
- Performs lightweight intent detection (`GA4`, `SEO`, `MIXED`)
- Routes requests to the appropriate agent
- Keeps business logic isolated from API and LLM layers

---
## Services
### 2. GA4 Agent (Tier-1)
- Designed for analytics-related queries
- Uses **Gemini LLM** to convert natural language into:
  - Metrics
  - Dimensions
  - Date ranges
- Fetches live data using **Google Analytics Data API**
- Passes raw data + original query to **LLM Lite** for reasoning and summarization

---

### 3. SEO Agent (Tier-2)
- Designed for SEO audit and technical SEO questions
- Reads structured SEO data from **Google Sheets** (Screaming Frog exports)
- Uses **Google Sheets API** to fetch tabular data
- Uses **LLM Lite** directly to:
  - Interpret the query
  - Filter relevant rows
  - Generate a human-readable explanation

---

### 4. LLM Lite
- Central reasoning engine
- Used by both GA4 and SEO agents
- Produces final natural language responses
- Does **not** fetch data; only reasons over provided inputs

---

### 5. Gemini LLM
- Used only in the GA4 pipeline
- Responsible for structured request generation
- Converts free-text queries into GA4-compatible parameters
- Not used for final reasoning or response generation

---
## ENV setup
PORT=8080
BASE_URL=http://3.110.18.218/
API_KEY=LLM API KEY
GEMINI_API_KEY=1ST KEY 
GEMINI_API_KEY2=2ND KEY
spreadsheetId="<SPREADSHEET ID>"


## API Specification

### POST `/query`

#### Request Body

```json
{
  "query": "Which pages have low engagement in the last 14 days?",
  "propertyId": "516823782"
}




