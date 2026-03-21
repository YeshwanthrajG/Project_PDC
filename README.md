<div align="center">

# 🌾 Rice Disease Prediction System

### AI-Powered Early Warning Platform for Rice Blast & False Smut

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![R](https://img.shields.io/badge/R-Plumber%20API-276DC3?logo=r)](https://www.r-project.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI-3776AB?logo=python)](https://fastapi.tiangolo.com/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

> A web-based intelligent prediction platform that helps farmers and agricultural stakeholders detect the risk of rice diseases - **Blast** (*Magnaporthe oryzae*) and **False Smut** (*Ustilaginoidea virens*) - using real-time weather data and an AI-driven Artificial Neural Network (ANN) model.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Modules](#-modules)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Hardware Requirements](#-hardware-requirements)
- [Dataset](#-dataset)
- [Screenshots](#-screenshots)
- [Future Roadmap](#-future-roadmap)
- [Authors](#-authors)
- [License](#-license)

---

## 🌟 Overview

Rice is one of the most critical staple crops worldwide, and diseases like **Rice Blast** and **False Smut** cause devastating yield losses every season. Traditional manual monitoring is slow, error-prone, and inaccessible for many smallholder farmers.

The **Rice Disease Prediction System** bridges this gap by combining:
- 📡 **Real-time weather data** from the OpenWeather API
- 📂 **Historical weather datasets** sourced from TNAU
- 🧠 **An ANN model trained in R** to forecast disease probability
- 🖥️ **A web dashboard** delivering location-specific risk alerts

This project was developed as part of an internship at the **Project Development Cell (PDC), Department of CSE, Coimbatore Institute of Technology** (May–June 2025).

---

## ✨ Features

- 🔍 **Location-based disease risk prediction** (manual or auto-detected)
- 🌦️ **Real-time weather integration** via OpenWeather API
- 🤖 **ANN-powered prediction engine** built and trained in R
- 🚦 **Three-tier risk classification** - Low / Medium / High
- 📊 **Interactive dashboard** with weather insights and recommendations
- ⚡ **Fast predictions** within 2–3 seconds
- 📱 **Responsive UI** compatible with desktops and mobile browsers
- 🔒 **Secure REST API** layer between model and frontend
- 🗄️ **Persistent storage** of historical data and prediction outputs for model retraining

---

## 🏗️ System Architecture

The system follows a **three-tier architecture**:

```
┌────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                    │
│         HTML5 · CSS3 · JavaScript                  │
│     (Web Dashboard - Input, Alerts, Results)       │
└───────────────────────┬────────────────────────────┘
                        │ REST API Calls
┌───────────────────────▼────────────────────────────┐
│             APPLICATION LAYER                      │
│   FastAPI (Python) + R Plumber API                 │
│   ┌─────────────────────────────────────────┐      │
│   │  Data Ingestion → Preprocessing → ANN   │      │
│   │  Model → Alert Logic → Notification     │      │
│   └─────────────────────────────────────────┘      │
│             OpenWeather API (External)             │
└───────────────────────┬────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────┐
│                  DATA LAYER                        │
│          SQLite / PostgreSQL Database              │
│  (Historical Data · Processed Features · Results)  │
└────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure of the web dashboard |
| CSS3 | Responsive styling across all devices |
| JavaScript | Dynamic UI, location input, result visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| Python (FastAPI) | REST API server, routing, session management |
| R Programming | ANN model training & prediction logic |
| Plumber (R Package) | Exposes trained R model as REST API |

### AI / ML
| Technology | Purpose |
|------------|---------|
| ANN (R - neuralnet / keras) | Disease risk prediction model |
| Historical Weather CSV (TNAU) | Training and validation data |
| OpenWeather API | Real-time weather data feed |

### Tools & Utilities
| Tool | Purpose |
|------|---------|
| RStudio | ANN development and evaluation |
| VS Code | Frontend and backend development |
| Git | Version control |
| Plumber | R REST API wrapper |

---

## 📦 Modules

| Module | Description |
|--------|-------------|
| **Data Ingestion** | Imports CSV historical data and fetches live weather via OpenWeather API |
| **Data Preprocessing** | Cleans, normalizes, and transforms raw weather inputs into model-ready features |
| **ANN Training** | Trains a feed-forward neural network on historical weather–disease data |
| **Prediction API** | Exposes the trained ANN as a REST API endpoint |
| **Alert Logic** | Maps prediction probabilities to Low / Medium / High risk levels |
| **Frontend UI** | Interactive dashboard for user input and result display |
| **Notification** | Visual severity-based alerts and actionable recommendations |
---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Python** 3.9+
- **R** 4.0+
- **Node.js** (optional, for frontend tooling)
- **Git**

Required Python packages:
```
fastapi
uvicorn
psycopg2
jinja2
python-multipart
```

Required R packages:
```r
install.packages(c("plumber", "neuralnet", "dplyr", "jsonlite", "httr"))
```

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YeshwanthrajG/Project_PDC.git
cd Project_PDC
```

**2. Set up the Python environment**
```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Configure the OpenWeather API key**

Create a `.env` file in the project root:
```env
OPENWEATHER_API_KEY=your_api_key_here
```
Get your free API key at [openweathermap.org](https://openweathermap.org/api).

**4. Set up and run the R Prediction API**
```r
# In RStudio or R terminal
setwd("path/to/Project_PDC/r_model")
source("train_model.R")       # Train the ANN model
library(plumber)
pr("predict_api.R") %>% pr_run(port = 8001)
```

---

### Running the Application

**Start the FastAPI backend:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Access the dashboard:**
```
http://localhost:8000
```

The application will be live at `http://localhost:8000`. The R Prediction API runs on port `8001` and is consumed internally by the backend.

---

## 💻 Hardware Requirements

| Component | Minimum Specification |
|-----------|-----------------------|
| Processor | Intel Core i3 or equivalent |
| RAM | 4 GB |
| Storage | 250 MB (for datasets and model storage) |
| Network | Stable internet connection (for OpenWeather API) |
| OS | Windows 10 / Ubuntu 20.04+ |

---

## 📂 Dataset

- **Historical Weather Data (Proprietary):** Provided by **TNAU (Tamil Nadu Agricultural University)** in CSV format, containing weekly parameters - temperature, humidity, rainfall, wind speed, and disease incidence records.
- **Real-Time Data:** Fetched dynamically from [OpenWeather API](https://openweathermap.org/api) based on user-provided location.

---

## 📸 Screenshots

> Dashboard, prediction results, and risk alert screens are available in the `/Sample_outputs` directory of the repository.

---

## 🔮 Future Roadmap

- [ ] 📱 Mobile application (Android / iOS) support
- [ ] 📲 SMS / WhatsApp alert integration for farmers
- [ ] 🌐 Multi-language support (Tamil, Hindi, Telugu)
- [ ] 🌱 Expansion to additional rice diseases and crop types
- [ ] 📡 IoT-based field sensor integration for micro-climate data
- [ ] 🔄 Automated model retraining pipeline
- [ ] ☁️ Cloud deployment (AWS / GCP / Azure)

---

## 👤 Author

**Dhinesh Kumar S**
[Github: @DhineshKumarS](https://github.com/Dhinesh1510)

**Dhinesh Raj. A**
[Github: @DhineshrajA](https://github.com/DHINESHRAJ007)

**Yeshwanthraj G**  
[GitHub: @YeshwanthrajG](https://github.com/YeshwanthrajG)

---

## 📄 License

This project is licensed under the [`LICENSE`](./LICENSE).

---

<div align="center">

⭐ If you found this project useful, please consider giving it a star!

</div>
