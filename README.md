# User Management Microservice

## Overview

This project is a user management microservice built using NestJS. It allows for basic user operations such as creating, searching, and blocking users. The project also uses Nest cache-manager and MongoDB for data persistence.

## Features
- CRUD operations on user database
- User Search with Filtering
- Block and Unblock Users
- Caching for Improved Performance


## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Docker (optional, for running MongoDB in a container)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/user-management-microservice.git
cd user-management-microservice
```

### 2. Start Docker compose file

```bash
docker compose up
```

### 3. Start the application

```bash
npm install
npm start
```
### 4. You can derive token for a particular user using the generateToken() function in main.ts file.
