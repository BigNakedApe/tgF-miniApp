# tgF-miniApp (Frontend)

Frontend for a Telegram Mini App to manage deals in a decentralized network.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tgF-miniApp.git
   cd tgF-miniApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Download Telegram Web Apps SDK**:
   - Download `telegram-web-app.js` from [Telegram](https://telegram.org/js/telegram-web-app.js).
   - Place it in the `public/` folder.

4. **Configure API**:
   - Update `API_BASE_URL` in `src/utils/api.js` with your backend URL (e.g., `https://your-backend.com/api`).

## Running Locally

1. **Start development server**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:5173` in your browser to test.

2. **Test in Telegram**:
   - Deploy to an HTTPS server (see Deployment section).
   - Configure your Telegram Bot with BotFather and set the Mini App URL.

## Building for Production

1. **Build the project**:
   ```bash
   npm run build
   ```
   - Output will be in the `dist/` folder.

2. **Preview build locally**:
   ```bash
   npm run preview
   ```

## Deployment

1. **Deploy to Vercel**:
   - Push your code to GitHub.
   - Import the repository in [Vercel](https://vercel.com/).
   - Set build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy and get the HTTPS URL (e.g., `https://tgF-miniApp.vercel.app`).

2. **Configure Telegram Bot**:
   - Use `@BotFather` to create a bot and set the Mini App URL.
   - Example: `/setmenubutton` → Set URL to your deployed app.

## Notes
- Ensure HTTPS is enabled for Telegram Mini App compatibility.
- Replace `API_BASE_URL` in `src/utils/api.js` with your backend URL.
- Backend must support CORS for the frontend domain.