# Deal Screener ⚡
### Institutional VC & Pilot Readiness Scorecard

**Deal Screener** is an institutional venture capital diligence and deal screening platform. It evaluates early-stage startups, cross-border deeptech ventures, and sovereign pilot deployments against dynamic, user-configurable investment theses.

---

## 🚀 Key Features

### 1. 🎛️ Dynamic Investment Thesis Configurator
Screen collateral against your fund's specific mandate rather than hardcoded assumptions:
* **Quick Presets:**
  * *Preset 1: India-GCC DeepTech & Sovereign AI*
  * *Preset 2: Global Enterprise AI & B2B SaaS*
  * *Preset 3: Climate & Industrial Hardware*
  * *Custom Configuration*
* **Multi-Select Parameters:** Target Deployment Regions (*GCC, India, North America, Europe, Southeast Asia, Global*) & Core Sectors (*Edge AI, Sovereign AI, Energy/Industrial, ClimateTech, B2B SaaS, FinTech*).
* **Calibrated Sliders:** Minimum Target Gross Margin (30% to 90%) and Diligence Strictness (Level 1 *Founder-Friendly* to Level 5 *Ruthless Institutional IC*).
* **Custom Directives:** Hard non-negotiables & negative exclusions (e.g. *"Must support on-prem data residency; reject generic API wrappers"*).

### 2. 📄 Flexible Collateral Ingestion
* **PDF Slide Decks:** High-performance server-side extraction via Mozilla's `pdfjs-dist`.
* **Raw Founder Notes:** Multi-line text input with live character and word counters.
* **Website / Data Room URL:** Automatic domain synthesis and venture intelligence extraction.
* **One-Click Sample Deck:** Instant pre-load for *Aegis Autonomous Robotics*.

### 3. 🧠 Dynamic Gemini Evaluation Engine
* Powered by **Google Gemini 3.6 Flash** (with fallback to Gemini 3.7 Flash).
* Prompt injection dynamically calibrates strictness penalties, unit economics audits, and sovereign data residency frameworks (e.g. UAE DESC, Saudi NCA ECC).
* Outputs structured institutional analysis across:
  * **Thesis Fit Match Gauge** (0–100%) and Status (`High Alignment`, `Moderate Fit`, `Misaligned`).
  * **Custom Directives Audit** with verified `✓ COMPLIANT` or `⚠️ BREACH` badges.
  * **4 Evaluation Pillars (0–25 pts each):** *Mandate & Thesis Alignment*, *Technical & IP Defensibility*, *Operational & Deployment Viability*, and *Unit Economics & BOM Feasibility*.
  * **GCC Pilot Fit & Partner Off-take Matches**.
  * **Red Flags Checklist** & **Key Diligence Questions for Founders**.

### 4. 📊 Institutional Scorecard & Exporting
* **1-Click Markdown Report:** Formatted for direct pasting into Notion, Slack, or IC memos.
* **Print / Save PDF:** Custom print stylesheets optimized for 1-page investment committee packets.

### 5. 🔐 Safe Public Access Controls & Dual API Key Architecture
* **Custom API Key (Unlimited):** Users can input their own Google Gemini API key via the **Settings** modal. Keys are saved locally in the browser's `localStorage` and passed securely via the `X-Custom-API-Key` HTTP header.
* **Shared Free Trial (5 screens/hr):** Enforces an IP-based rate limit via `@upstash/ratelimit` with Redis and in-memory fallback.
* **Graceful 429 Handling:** Automatically opens the Settings modal with direct links to [Google AI Studio](https://aistudio.google.com/app/apikey) when rate limits are reached.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Frontend:** React 19, TypeScript, Vanilla Tailwind CSS v4, [Lucide React](https://lucide.dev/)
* **AI & LLM:** Google Gemini 3.6/3.7 Flash via `@google/genai`
* **PDF Processing:** Mozilla `pdfjs-dist` (v6)
* **Rate Limiting:** `@upstash/ratelimit` & `@upstash/redis`

---

## 🏁 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sumithakur/corridorpulse.git
cd corridorpulse
npm install
```

### 2. Environment Setup (Optional for Hosted Tier)
Create a `.env.local` file in the root directory:
```env
# Optional: Server default Gemini API key for public free trial (5 screens/hr)
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Upstash Redis for distributed multi-instance rate limiting
UPSTASH_REDIS_REST_URL="https://your-upstash-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

*(Users can also directly enter their Gemini API key via the in-app **Settings** modal with zero server setup required!)*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License. Created by [Sumit Thakur](https://github.com/sumithakur).
