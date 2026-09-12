# Railway Congestion Prediction System

## Overview
A full-stack web application that predicts congestion levels at railway stations using reservation data and displays insights through an interactive dashboard.

## Tech Stack
- Backend: Spring Boot (Java)
- Frontend: React (Vite)
- Database: MySQL

## Features
- Search congestion using PNR number
- Real-time congestion prediction (Low / Medium / High)
- Interactive dashboard with charts
- REST API integration between frontend and backend
- Modular architecture using DTOs and services

## Project Structure
- /src → Spring Boot backend
- /frontend → React frontend
- railway_congestion.sql → Database schema

## How to Run

### 1. Database Setup
CREATE DATABASE railway_congestion;
Import railway_congestion.sql

### 2. Backend
mvn spring-boot:run

### 3. Frontend
cd frontend
npm install
npm start

## API
GET /pnr/{pnr}
