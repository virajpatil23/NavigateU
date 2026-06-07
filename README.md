# 🧭 NavigateU — Accessible Navigation System

A React-based web application that helps users with disabilities find and navigate to accessible public places. Built with Google Maps, Firebase, and an AI-powered accessibility scoring system.

---

## 🌟 Features

- 🔐 **Firebase Authentication** — Secure email/password login
- 🗺️ **Live Google Maps** — Real-time GPS tracking with walking directions
- ♿ **Accessibility Filters** — Filter places by ramp, lift, toilet, and wheelchair access
- 🤖 **AI Recommendation Engine** — Scores places based on accessibility features + proximity
- 📍 **Nearest Place Finder** — Haversine formula to find the closest accessible location
- 🎤 **Voice Assistant** — Set filters or location using Web Speech API
- 🧾 **Turn-by-Turn Navigation** — Step-by-step walking directions via Google Directions API
- ➕ **Add Places** — Geocode and save new accessible locations to Firestore

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7 |
| Styling | Tailwind CSS, Radix UI |
| Maps | Google Maps API (`@react-google-maps/api`) |
| Backend / DB | Firebase Firestore |
| Auth | Firebase Authentication |
| Voice | Web Speech API (`webkitSpeechRecognition`) |
| Icons | Lucide React |

---

## 📁 Project Structure

```
navigateu/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Styled login UI component
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       └── label.jsx
│   ├── lib/
│   │   └── utils.js            # Tailwind class merge utility
│   ├── App.js                  # Login page with Firebase auth
│   ├── MapComponent.jsx        # Main map + navigation screen
│   ├── firebaseConfig.js       # Firebase initialization
│   ├── index.js                # App entry + React Router setup
│   └── index.css               # Tailwind base styles
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14
- A Firebase project (Firestore + Authentication enabled)
- A Google Maps API key with Maps JavaScript API, Directions API, and Geocoding API enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/virajpatil23/navigateu.git
cd navigateu

# Install dependencies
npm install
```

### Configuration

1. Open `src/firebaseConfig.js` and replace with your own Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

2. In `src/MapComponent.jsx`, replace the Google Maps API key in the `<LoadScript>` tag and fetch calls:

```jsx
<LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
```

### Run Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Firestore Data Structure

Each document in the `places` collection follows this schema:

```json
{
  "name": "Pune Railway Station",
  "lat": 18.5284,
  "lng": 73.8742,
  "ramp": true,
  "lift": false,
  "toilet": true,
  "wheelchair": true
}
```

---

## 🤖 AI Scoring Logic

Each place is scored out of 1.0 based on accessibility features:

| Feature | Weight |
|---|---|
| Wheelchair access | 0.25 |
| Ramp | 0.25 |
| Lift | 0.25 |
| Accessible toilet | 0.25 |

The recommendation engine then adjusts the score by subtracting a small distance penalty (`distance × 0.05`), balancing accessibility with proximity.

---

## 🔮 Future Improvements

- [ ] User registration and profile management
- [ ] Crowdsourced place reviews and ratings
- [ ] Offline support with service workers
- [ ] Mobile app version (React Native)
- [ ] Admin dashboard for managing reported places
- [ ] Multi-language support

---

## 🙋‍♂️ Author

**Viraj Patil**  
B.Tech CSE (Artificial Intelligence) — Nutan College of Engineering and Research, Pune  
[GitHub](https://github.com/virajpatil23)

---


