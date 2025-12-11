# DegreeAdmin 🎓

> **Academic Degree Planning System** - A full-stack web application for automated course scheduling and degree pathway management.

[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![MariaDB](https://img.shields.io/badge/MariaDB-11.x-blue?logo=mariadb)](https://mariadb.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live Demo:** [Coming Soon] | **Report Issues:** [Issues](../../issues)

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [📁 Project Structure](#-project-structure)
- [📚 API Documentation](#-api-documentation)
- [👥 Team](#-team)
- [📄 License](#-license)
- [Acknowledgments](#acknowledgments)
- [📞 Contact & Support](#-contact--support)
- [🗺️ Roadmap](#️-roadmap)
- [📊 Project Status](#-project-status)

---

## 🎯 Overview

**DegreeAdmin** is a comprehensive degree planning system designed to help students visualize their academic journey from enrollment to graduation. The application automatically generates optimized course schedules based on degree requirements, prerequisites, and student preferences.

Built as an Intro to Software Engineering project (CEG 4110) at Wright State University (Fall 2025), DegreeAdmin demonstrates modern full-stack development practices with a focus on user experience, data integrity, and scalability.

### Key Highlights

- 🗓️ **Automated Schedule Generation** - Creates semester-by-semester course plans for 9+ degree combinations
- 📊 **GPA Calculator** - Real-time GPA tracking with "what-if" scenario planning
- 🔍 **Smart Course Search** - Find courses instantly with intelligent filtering and highlighting
- 📄 **PDF Export** - Generate professional, printable degree plans
- 💼 **Co-op Integration** - Plan work terms with earnings calculator
- 🎨 **Modern UI/UX** - Responsive design with dark mode support

---

## ✨ Features

### For Students

- **Personalized Degree Plans**
  - Select major(s) and minor(s) from available programs
  - View complete 4-year course schedule
  - Navigate semester-by-semester with visual indicators
  - See course details: times, instructors, credit hours

- **Academic Planning Tools**
  - GPA calculator with semester and cumulative tracking
  - Workload indicators (Light/Moderate/Full/Heavy)
  - Credit hour progress monitoring
  - Grade entry and projection

- **Schedule Management**
  - Course search with real-time filtering
  - PDF export for advising meetings
  - Co-op semester planning with earnings calculator
  - Notification system for important updates

### For Administrators (Future)

- User management
- Curriculum updates
- System analytics
- Degree program configuration

### For Faculty (Future)

- Student advising dashboard
- Schedule approval workflows
- Progress monitoring

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.x
- **Routing:** React Router DOM 6.x
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** Custom CSS with CSS Variables (theme support)

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** MariaDB 11.x
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven
- **Containerization:** Docker & Docker Compose

### Development Tools
- **Version Control:** Git & GitHub
- **IDE:** VS Code, IntelliJ IDEA
- **API Testing:** Bruno
- **Database Management:** DBeaver

---

## 📸 Screenshots

### Schedule Display
*Semester-by-semester course view with navigation*

### GPA Calculator
*Real-time GPA tracking with workload indicators*

### Course Search
*Smart filtering with visual highlighting*

### PDF Export
*Professional printable degree plans*

> 📷 *Screenshots coming soon - project under active development*

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **Java JDK** (17 or higher) - [Download](https://adoptium.net/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Maven** (3.8.x or higher) - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DegreeAdmin.git
   cd DegreeAdmin
   ```

2. **Set up the database**
   ```bash
   cd fs_db
   docker-compose up
   ```
   
   This will start MariaDB on port 3309.

3. **Configure environment variables**
   
   Create a `.env` file in the backend root:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DB_USERNAME=root
   DB_PASSWORD=your_secure_password
   MARIADB_ROOT_PASSWORD=your_secure_password
   ```

4. **Install backend dependencies**
   ```bash
   cd full-SALE-api
   mvn clean install
   ```

5. **Install frontend dependencies**
   ```bash
   cd full-SALE-ui/web
   npm install
   ```

### Running the Application

#### Option 1: Development Mode (Recommended)

**Terminal 1 - Start Database:**
```bash
cd fs_db
docker-compose up
```

**Terminal 2 - Start Backend:**
```bash
cd full-SALE-api
mvn clean package -DskipTests  
java -jar target/degreeadminbackend-0.0.1-SNAPSHOT.jar    
```

**Terminal 3 - Start Frontend:**
```bash
cd full-SALE-ui/web
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Database:** localhost:3309

#### Option 2: Production Build

```bash
# Build frontend
cd full-SALE-ui/web
npm run build

# Build backend with frontend
cd full-SALE-api
mvn clean package -DskipTests  

# Run the JAR
java -jar target/degreeadminbackend-0.0.1-SNAPSHOT.jar    
```

### Default Test Accounts

Create these test accounts in your local database:

| Role    | Username      | Password      |
|---------|--------------|---------------|
| Student | `test_student` | `Test123!@#`  |
| Faculty | `test_faculty` | `Demo456!@#`  |
| Admin   | `test_admin`   | `Admin789!@#` |

> **Note:** Passwords must be 8-40 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.

---

## 📁 Project Structure

```
DegreeAdmin/
├── full-SALE-api/              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/fullsale/
│   │   │   │       ├── controller/    # REST Controllers
│   │   │   │       ├── model/         # Entity Models
│   │   │   │       ├── repository/    # Data Access Layer
│   │   │   │       ├── service/       # Business Logic
│   │   │   │       └── dto/           # Data Transfer Objects
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql           # Sample Data
│   │   └── test/
│   └── pom.xml
│
├── full-SALE-ui/               # React Frontend
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── components/     # React Components
│       │   │   ├── student/    # Student Features
│       │   │   ├── faculty/    # Faculty Features
│       │   │   └── admin/      # Admin Features
│       │   ├── pages/          # Page Components
│       │   ├── utils/          # Utility Functions
│       │   ├── api.js          # API Client
│       │   └── App.js          # Root Component
│       └── package.json
│
├── fs_db/                      # Database Setup
│   ├── docker-compose.yml
│   └── init_full_sale_db.sql   # Database Schema
│
├── docs/                       # Documentation
│   ├── API.md                  # API Documentation
│   ├── SRS.md                  # Software Requirements
│   └── TESTING.md              # Test Plan
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
Authenticate user and create session.

**Request:**
```json
{
  "username": "student1",
  "password": "Test123!@#"
}
```

**Response:**
```json
{
  "userId": 1,
  "username": "student1",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Student Endpoints

#### `POST /api/students/{studentId}/plan`
Generate degree plan for a student.

**Request:**
```json
{
  "degreeSpecialties": [
    {
      "degreeFieldOfStudyId": 1,
      "majorMinor": "MAJ"
    }
  ],
  "includeSummer": true,
  "targetGraduation": "SPRING-2028",
  "numberOfCoops": 2
}
```

**Response:**
```json
[
  {
    "courseId": 101,
    "courseNum": "ECON 2000",
    "courseName": "Principles of Microeconomics",
    "creditHours": 3,
    "semester": "Fall 2025",
    "season": "FALL",
    "year": "2025",
    "days": "MWF",
    "startTime": "09:00",
    "endTime": "10:15",
    "instructorName": "Dr. Smith"
  }
]
```

### Degree Program Endpoints

#### `GET /api/degrees`
Get list of available degree programs.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Economics",
    "type": "MAJOR",
    "requiredCredits": 120
  }
]
```

---

## 👥 Team

**DegreeAdmin** was created by a team of Computer Science students at Wright State University:

| Name | Role | Contributions |
|------|------|---------------|
| **Aiden Cox** | Frontend & Project Coordinator | React architecture, UI/UX, API integration, team website, project management |
| **Evan Timm** | Backend Lead | Spring Boot setup, database design, REST APIs, business logic |
| **Luke Dawson** | Data & Content | Curriculum data, requirements documentation, SRS |
| **Samantha Barnum** | Frontend Lead & Testing  | Test plan, testing templates, quality assurance |

**Faculty Advisor:** Dr. Sean Banerjee
**Course:** CEG 4110 - Intro to Software Engineering  
**Semester:** Fall 2025
**Institution:** Wright State University

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 DegreeAdmin Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full license text...]
```

---

## Acknowledgments

- **Wright State University** - For providing the educational framework and resources
- **Dr. Sean Banerjee** - For guidance and mentorship throughout the project


---

## 📞 Contact & Support

- **Project Website:** [Team Site](https://aidenc17.github.io/full-SALE/)
- **Report Issues:** [GitHub Issues](../../issues)
- **Email:** [cox.378@wright.edu](Email)

---

## 🗺️ Roadmap

### Current Version (v1.0) - December 2025
- ✅ Core schedule generation
- ✅ GPA calculator
- ✅ Course search & filtering
- ✅ PDF export
- ✅ Co-op planning
- ✅ Student authentication

### Future Enhancements (v2.0)
- [ ] Faculty approval workflows
- [ ] Admin dashboard with analytics
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced prerequisite validation
- [ ] Course swap recommendations
- [ ] Integration with university systems
- [ ] Multi-language support

### Long-term Vision
- [ ] AI-powered schedule optimization
- [ ] Career path recommendations
- [ ] Real-time course availability
- [ ] Social features (study groups, course reviews)
- [ ] Graduation audit automation

---

## 📊 Project Status

**Current Phase:** Production Demo (December 2025)

![Progress](https://img.shields.io/badge/Progress-95%25-brightgreen)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Coverage](https://img.shields.io/badge/Coverage-75%25-yellow)

**Last Updated:** December 11, 2025

---

<div align="center">

**Built with ❤️ by the DegreeAdmin Team**

[⬆ Back to Top](#degreeadmin-)

</div>
