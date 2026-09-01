# SafeChara - Smart Cattle Feed & Silage Quality Testing System

<div align="center">
  <h3>Empowering farmers with instant, AI-driven cattle feed and silage quality testing.</h3>
</div>

<hr />
<img width="312" height="285" alt="image" src="https://github.com/user-attachments/assets/ba4a37e2-ea5d-4a9e-ba59-1506bdb9a0a1" />




##  Smart India Hackathon (SIH) Details
*   **Problem Statement ID:** 26111
*   **Problem Statement Title:** Smart AI-Enabled Rapid Feed and Silage Quality Testing System for Dairy Farmers
*   **Organization:** Ministry of Fisheries, Animal Husbandry & Dairying
*   **Department:** Department of Animal Husbandry & Dairying
*   **Theme:** Agriculture, FoodTech & Rural Development

---

## 🎯 Alignment with SIH Problem Statement 26111

**The Problem:** Animal nutrition directly affects milk production and dairy profitability. Farmers often face challenges due to poor-quality feed, adulteration, and fungal contamination, while traditional feed testing laboratories are expensive and inaccessible.

**The SafeChara Solution:** SafeChara is a rapid digital testing solution designed to assess the nutritional quality of cattle feed and silage directly at the farm. 
*   **Rapid & Portable:** Provides testing results within minutes using a low-cost, portable hardware device paired with our mobile app via Bluetooth.
*   **AI-Powered Assessment:** Utilizes on-device Machine Learning models to predict nutritional values (e.g., Moisture, Protein) and detect contaminants.
*   **Instant Advisories:** Generates immediate, actionable nutritional and storage advisories for the farmer based on test results.
*   **Built for Rural Areas:** Features offline capabilities for areas with poor connectivity and multilingual interfaces to ensure accessibility for all farmers.

---

## Executive Summary 

### The User Journey & Impact

<img width="312" height="600" alt="dashborad" src="https://github.com/user-attachments/assets/478c9a22-fc6e-4e1e-9f9a-eca5386a7e4f" /> <img width="312" height="600" alt="nav" src="https://github.com/user-attachments/assets/398465fb-49b4-440a-8cae-0623776aa70e" />  <img width="312" height="600" alt="an" src="https://github.com/user-attachments/assets/abfc1ff4-8068-4b2b-8be6-fd6999688bf2" /> <img width="312" height="600" alt="result" src="https://github.com/user-attachments/assets/dbdbd7dc-4bca-4284-91a3-7b67d5ff70bb" />






SafeChara transforms the complex process of feed testing into a simple, accessible workflow for the dairy farmer:

1.  **Secure Onboarding:** Farmers can easily register and maintain their profile securely.
2.  **Seamless Hardware Connectivity:** The mobile app quickly pairs with the SafeChara portable testing device via a one-tap Bluetooth connection.
3.  **Instant Sample Analysis:** The farmer scans the feed/silage sample. The app processes the sensor data instantly.
4.  **Advisory Dashboard:** The farmer receives a clear, easy-to-understand result dashboard (e.g., "High Moisture detected - risk of mold. Improve storage conditions.")

**Social & Economic Impact:** 
By ensuring the quality of cattle feed, SafeChara helps prevent disease, increases milk yield, and reduces veterinary costs. This translates directly into improved economic security and profitability for rural dairy farmers.

---

## 💻 Technical Deep Dive 

### System Architecture
The SafeChara ecosystem consists of three primary layers:
1.  **Portable IoT Sensor Device (Hardware):** Collects spectral/sensor data from the feed sample.
2.  **SafeChara Mobile Application (Edge/Frontend):** Receives data via Bluetooth Low Energy (BLE), performs on-device AI inference, and presents results.
3.  **Cloud Infrastructure (Backend):** Handles user authentication, secure data storage, analytics, and media hosting.

### Technology Stack
*   **Frontend Mobile App:** React Native, Expo (SDK 57), TypeScript.
*   **UI Framework:** Custom built Glassmorphic UI featuring `expo-blur`, `expo-linear-gradient`, and Reanimated for smooth, premium interactions.
*   **Backend & Cloud:** Firebase (Authentication, Firestore Database), Google Cloud Platform (Cloud Run).
*   **Media Storage:** Cloudinary (integrated via `expo-file-system` for secure, optimized image handling).
*   **Hardware Integration:** `react-native-ble-plx` for robust Bluetooth Low Energy communication with the testing hardware.
*   **AI / Machine Learning:** `react-native-fast-tflite` for high-performance, **on-device inference**, enabling the app to work offline in rural areas.
*   **Local State/Storage:** `@react-native-async-storage/async-storage` for offline data synchronization and caching.

### Key Technical Implementations
*   **Offline-First Architecture:** Ensures farmers in remote rural areas can still perform tests and view critical advisories even without internet access.
*   **On-Device AI Inference:** By utilizing TFLite models directly on the mobile device, we achieve lower latency (results in seconds) and eliminate the need for a constant high-bandwidth internet connection to a cloud server.
*   **Cross-Platform Media Uploads:** Addressed Android-specific file system limitations by implementing secure `expo-file-system` pipelines to Cloudinary.
*   **Hardware-Software Handshake:** Robust BLE state management to handle connection drops, reconnections, and continuous data streaming from the testing device.

---


*   `/screens`: Main application screens (Dashboard, Advisory, Setup, Results).
*   `/components`: Reusable UI components (Glassmorphic cards, buttons, BLE status indicators).
*   `/services`: API wrappers, BLE communication logic, and Firebase/Cloudinary integration.
*   `/theme`: Global design tokens (colors, typography, spacing).
*   `/context`: React Context providers for global state management (Auth, BLE state).





---
*Built with ❤️ for Smart India Hackathon*
