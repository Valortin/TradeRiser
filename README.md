# TradeRiser

Welcome to **TradeRiser**, a revolutionary DeFi swap aggregator built on the **NERO Chain**!  
TradeRiser blends the power of decentralized finance (DeFi) with **SocialFi**, offering **gasless transactions**, real-time swap rate aggregation, and a vibrant community where traders can share strategies and learn from each other.

Inspired by the sleek simplicity of Web2 platforms like **Robinhood**, TradeRiser is designed to onboard the next billion users into Web3 with an intuitive interface and innovative features.

---

## 🚀 What It Does

- Aggregates the **best swap rates** across NERO Chain DEXs
- Eliminates **gas fees** via the Paymaster system (first 5 swaps are free!)
- Provides a **social feed** for traders to post and follow strategies
- Includes a **tutorial mode** for non-Web3 users
- Offers **flexible gas options**: free, partially sponsored, or token-based

---

## 🧠 The Problem It Solves

- **Complexity Barrier**: DeFi’s steep learning curve deters newcomers → solved with tutorials & a Web2-like UI  
- **High Costs**: Traditional DEXs burden users with gas fees → solved with Paymaster gas sponsorship  
- **Isolation**: Traders lack a community to share knowledge → solved via integrated SocialFi

---

## ✨ Features

- 🔥 **Gasless Swaps** – Up to 5 free transactions via NERO Paymaster  
- 🔁 **Swap Aggregation** – Fetches optimal rates across NERO DEXs  
- 💬 **Social Feed** – Share and follow trading strategies in real time  
- 🎓 **Tutorial Mode** – Interactive, beginner-friendly DeFi guides  
- 🧾 **Flexible Gas Options** – Free, sponsored, or token-based transactions  

---

## 🛠 Getting Started

### Prerequisites

- Node.js (v16.x or v18.x recommended)  
- npm (comes with Node.js)  
- A code editor (e.g., VS Code)

---

### 🧩 Installation

#### 1. Clone the Repository

```bash
git https://github.com/Valortin/TradeRiser.git
cd traderiser
````

#### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

#### 3. Set Up Environment

* Configure your **NERO Testnet RPC endpoint** in your config file (e.g., `src/config.ts`)
* Install Tailwind CSS:

```bash
npm install --save-dev tailwindcss@3.4.17 postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

---

### ▶️ Run the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see TradeRiser in action.

---

## ⚙️ Configuration

### Tailwind CSS (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#21BF73',
        secondary: '#1F2937',
        accent: '#3B82F6',
      },
    },
  },
  plugins: [],
};
```

### Blockchain Setup

* Ensure `Web3Auth` and `ethers.js` are configured correctly for **NERO Testnet**

---

## 🧰 Technologies Used

* **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
* **Blockchain**: NERO Chain, ethers.js
* **Authentication**: Web3Auth (Modal + OpenLogin Adapter)
* **Build Tools**: react-scripts, PostCSS, Autoprefixer
* **Testing**: @testing-library/react, @testing-library/jest-dom

---

## 🏗 How We Built It

* Started as a fork of the NERO Wallet template
* Developed modular React components: `Header`, `SwapPanel`, `SocialFeed`
* Integrated **Paymaster** via NERO’s no-code dashboard
* Used `ethers.js` for smart contract interaction
* Auth via **Web3Auth** (social login for frictionless onboarding)
* Tailwind + Framer Motion for smooth, animated UI
* Thoroughly tested on NERO Testnet

---

## 🧱 Challenges

* Aligning **Paymaster** gas options with frontend logic
* Fetching real-time swap rates (mock data desync issues)
* Web3Auth not syncing smoothly with NERO Testnet
* Optimizing **Framer Motion** animations during heavy state changes

---

## 🎓 What We Learned

* Tutorials drastically improve onboarding for Web3 novices
* Paymaster flexibility is essential for adoption
* SocialFi boosts long-term user retention and engagement
* Performance tuning is key for delightful UX

---

## 🔮 What's Next

* 🚀 **Live DEX Aggregation** – Deploy optimized aggregation smart contracts to mainnet
* 👤 **Trader Follow System** – Follow/unfollow functionality in the social feed
* 📱 **Mobile App** – Native iOS/Android versions
* 🏆 **Swap Contests** – Host weekly on-chain trading contests with NERO token rewards
* 🌐 **Cross-Chain Support** – Extend to other EVM-compatible chains (e.g., Polygon, BSC)

---


## 📜 License

MIT License — See the `LICENSE` file for details.

---

## Acknowledgments

* Special thanks to the **NERO Chain** team for their innovative platform
* Inspired by the **Web3Auth** and **DeFi** developer communities
