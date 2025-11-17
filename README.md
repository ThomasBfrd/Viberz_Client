# 📌 Viberz (front)

[![Sass](https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Spotify](https://img.shields.io/badge/Spotify-1ED760?logo=spotify&logoColor=white)](#)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=fff)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A dynamic web application dedicated to exploring Electronic Dance Music (EDM) subgenres. 
Viberz offers an interactive platform for music discovery and learning through engaging 
features and gamification.

## ✨ Feature Details

### 🎮 Game Modes
- **Genre Guessing**: 5 rounds to test your EDM subgenre recognition
- **Song Recognition**: 5 rounds to identify tracks from 1-3 selected genres

### 👤 User Profile
- XP-based progression system
- Grade achievements
- Personalized music taste analysis (top artists & genres)

### 🎵 Music Integration
- Full Spotify integration with Web Playback SDK
- Real-time music streaming
- Requires Spotify Premium

### 🚧 Coming Soon
- Community-curated playlists
- Leaderboards and challenges
- Learn genres structures

## 🛠️ Tech Stack
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- SASS
- React Router DOM 7.9.2
- GSAP 3.13.0 - Animations
- Emailjs 4.4.1 - Email services
- React Spotify Web Playback SDK 3.0.3

## 📋 Prerequisites
- Node.js (version 22.20.0 or higher)
- Spotify Premium account (for music playback features)

## 🔧 Installation
Clone the repository, then type in the command line : ```npm i```

- Run in development: ```npm run dev```
- Build: ```npm run build```
- Lint: ```npm run lint```
- Preview: ```npm run preview```

## 🚀 Getting Started

### Environment Variables
Create a `.env` file at the root with:
````typescript
// Backend
  VITE_BACKEND_URL="https://localhost:7053"

// Spotify API
  VITE_SPOTIFY_CLIENT_ID="YOUR SPOTIFY CLIENT ID"
  VITE_REDIRECT_URI="YOUR FRONT LOCAL IP/callback"
  VITE_AUTH_ENDPOINT="https://accounts.spotify.com/authorize"
  VITE_RESPONSE_TYPE="code"
  VITE_SCOPES="user-read-private user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing user-library-modify streaming"
  
// EmailJS
  VITE_TEMPLATE_EMAIL_ID="YOUR TEMPLATE EMAIL ID FROM EMAILJS"
  VITE_SERVICE_EMAIL_ID="YOUR SERVICE EMAIL ID FROM EMAILJS"
  VITE_PUBLIC_EMAIL_KEY="YOUR PUBLIC EMAIL KEY FROM EMAILJS"
````

### How to access to the web app with a tunnel
You have to create a tunnel to request an authorization code from Spotify API.
Cloudflare works very well for this.

**Start Cloudflare tunnel:**
```bash
   cloudflared tunnel --url http://localhost:5173
```

**Update `vite.config.ts`:**
```typescript
   server: {
     allowedHosts: ['your-tunnel.trycloudflare.com']
   }
```
And replace your callback redirection in the env variable :

``` typescript
VITE_REDIRECT_URI="YOUR TUNNEL FRONT LOCAL IP/callback"
```

**Configure Spotify Dashboard:**
- Add redirect URIs:
  - `https://your-tunnel.trycloudflare.com`
  - `https://your-tunnel.trycloudflare.com/callback`
- Add your email to allowed users

Don't forget to add your spotify email in the Spotify Dashboard, 
and in the whitelist table in the Viberz database.

## 🧪 Testing
The project uses Vitest and React Testing Library for testing:

- Run unit tests: `npm run test`
- Generate coverage report: `npm run test:coverage`

## 🖼️ Screenshots
![Home](https://i.postimg.cc/bYZyhk0y/www-viberz-app-home-Pixel-6a-1.png)
![Profile](https://i.postimg.cc/44YfgVvH/www-viberz-app-home-Pixel-6a.png)
![Guess Game](https://i.postimg.cc/MZn6SV0M/www-viberz-app-home-Pixel-6a-2.png)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

This is a **portfolio project** with the following limitations:
- **Spotify API restriction**: Maximum 25 users (manually added to Spotify Dashboard)
- **Not production-ready**: Intended for demonstration purposes only
- **Educational use**: Feel free to learn from the code, but note the Spotify API limitations

To run this project, you'll need:
- Your own Spotify Developer credentials
- Spotify Premium account
- Manual user whitelisting in Spotify Dashboard