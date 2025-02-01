# DDNetHvH Website

A modern, cyberpunk-themed website for the DDNetHvH server network - the first and only HvH server network featuring FNG, DM, KoG, and Block game modes for DDNet.

## 🛠️ Tech Stack

- React.js
- Express.js
- CSS3 with custom animations
- Font Awesome icons
- React Router for navigation

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ddnethvh/server.git
cd server
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Generate keys
```bash
node -e "const crypto = require('crypto'); const fs = require('fs'); if (!fs.existsSync('.env') || !fs.readFileSync('.env', 'utf8').includes('JWT_SECRET')) { const secret = crypto.randomBytes(64).toString('hex'); fs.appendFileSync('.env', `\nJWT_SECRET=${secret}`); console.log('JWT secret generated and added to .env'); }"
```

4. Start the development servers
```bash
# Start backend server (from root directory)
npm start

# Start frontend development server (from frontend directory)
npm start
```

The website should now be running at `http://localhost:3000`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

- Telegram: [@ddnethvh](https://t.me/ddnethvh)
- Project Founder: scar17off
- Server Host: Hexose

## 📄 License

This project is licensed under the Proprietary License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- DDNet Community
- All contributors and supporters
- Cheat developers and maintainers
- DDNetHvH Team
