# Looge H5 App - Group Buying Lottery Platform

A complete Vue.js SPA and Node.js backend system for a group buying lottery H5 application supporting both user and admin interfaces.

## 🎯 Project Overview

Looge is a mobile H5 application that enables users to participate in group buying lottery events, manage prizes, handle refunds, and build affiliate networks through an invitation system. The platform features multi-language support (English/Spanish/Chinese) and a comprehensive admin panel.

## 🌟 Key Features

### User Interface
- **Multi-Language Support**: English, Spanish, and Chinese language switching
- **Group Buying Lottery**: Multiple lottery zones (10K, 30K, 80K, 150K, 300K, 600K, 1M)
- **Prize Management**: Win prizes, choose 80% buyback or shipping delivery
- **Refund System**: Configurable advertisement fees (0.001%-100%) for non-winners
- **Invitation System**: 6-digit invite codes with affiliate rewards
- **VIP Membership**: Dividend distribution system for VIP members
- **Wallet System**: Recharge, withdrawal, and transaction history
- **White-to-Sky-Blue Gradient Theme**: Modern, clean design

### Admin Interface
- **Lottery Management**: Configure prizes, zones, and draw timing
- **User Administration**: Manage user accounts, invite codes, team assignments
- **Financial Management**: Handle recharges, withdrawals, and approvals
- **Team Management**: Three-level affiliate system (M1-M3) with configurable rebates
- **Announcement System**: Manage announcements and marquee messages
- **Content Management**: Configure carousel banners and promotional content

### Technical Features
- **Database**: MySQL 8.0 optimized schema
- **Backend**: Node.js/Express with JWT authentication
- **Frontend**: Vue 3 with Vue Router and Vite
- **Internationalization**: Vue I18n for multi-language support
- **Responsive Design**: Mobile-first H5 application

## 📁 Project Structure

```
looge/
├── frontend/                 # Vue 3 Frontend (User & Admin)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Application pages
│   │   ├── router/          # Vue Router configuration
│   │   ├── i18n/            # Internationalization
│   │   ├── api/             # API client
│   │   └── store/           # State management
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── .env.example
├── database/                 # Database Schema & Scripts
│   ├── schema.mysql8.sql    # MySQL 8.0 schema
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OKEY013/looge.git
cd looge
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database connection in .env
npm run start
```

3. **Setup Database**
```bash
# Import the MySQL schema
mysql -u your_username -p your_database < database/schema.mysql8.sql
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Development Servers
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:3000/admin

## 🎮 Lottery Zones Configuration

The system supports multiple lottery zones with different participation amounts:

| Zone | Participation Amount | Group Size | Prize Tier |
|------|---------------------|------------|------------|
| 10K Zone | $100 | 100 people | Entry Level |
| 30K Zone | $300 | 100 people | Bronze |
| 80K Zone | $800 | 100 people | Silver |
| 150K Zone | $1,500 | 100 people | Gold |
| 300K Zone | $3,000 | 100 people | Platinum |
| 600K Zone | $6,000 | 100 people | Diamond |
| 1M Zone | $10,000 | 100 people | Supreme |

## 💳 Payment & Refund System

- **Winners**: Choose between 80% cash buyback or product delivery
- **Non-Winners**: Automatic refund minus configurable advertisement fee (0.001%-100%)
- **VIP Members**: Receive dividend distributions from platform profits

## 👥 Affiliate System

- **Three-Level Structure**: M1 (1% rebate), M2 (2% rebate), M3 (3% rebate)
- **Invitation Codes**: 6-digit numeric codes for user registration
- **Team Management**: Hierarchical team assignment and management
- **Reward Distribution**: Automatic calculation and distribution

## 🔧 Configuration

### Environment Variables (Backend)
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=looge
JWT_SECRET=your_jwt_secret
PORT=8000
```

### Language Configuration
Default language is Chinese (zh), with fallback to English (en). Spanish (es) is fully supported.

## 📱 Mobile Compatibility

The application is optimized for mobile devices with:
- Responsive design for various screen sizes
- Touch-friendly interface elements
- Fast loading times optimized for mobile networks
- Progressive Web App (PWA) capabilities

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CORS configuration
- Input validation and sanitization

## 📊 Admin Features

### Dashboard
- Real-time statistics
- Active lottery monitoring
- Financial overview
- User activity tracking

### User Management
- View and edit user profiles
- Manage invitation codes
- Team assignment and restructuring
- Account status management

### Financial Operations
- Process withdrawals
- Manage recharges
- View transaction history
- Generate financial reports

## 🔄 API Documentation

The backend provides RESTful APIs for:
- User authentication and management
- Lottery participation and management
- Financial transactions
- Admin operations
- Real-time notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🗺️ Roadmap

- [ ] Payment gateway integration
- [ ] Push notification system
- [ ] Advanced analytics dashboard
- [ ] Mobile app versions (iOS/Android)
- [ ] Blockchain integration for transparency
- [ ] Advanced anti-fraud measures

---

**Looge H5 App** - Building the future of group buying lottery platforms 🎰✨