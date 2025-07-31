# SRSN Backend 

This repository contains the backend code for the **Sri Ramkrishna Siksha Niketan** project, handling user data, authentication, and various administrative functionalities to support the school's web portal.

## Features

### 🔐 **Authentication & Authorization**
- **Multi-Role Authentication**: Secure login system supporting Students, Teachers, Admin, and Alumni with role-based access control
- **Google OAuth Integration**: Single sign-on support for both users and alumni through Google authentication
- **JWT Token Management**: Secure token-based authentication with httpOnly cookies and refresh token support
- **OTP Verification**: Email-based OTP system for password reset and alumni login verification
- **Password Security**: Advanced password hashing using bcrypt with automatic password generation from Aadhar numbers

### 👥 **User Management System**
- **Multi-User Support**: Comprehensive user management for Students, Teachers, Administrators, and Alumni
- **Student Admission Portal**: Complete admission management system with PDF generation and email notifications
- **Profile Management**: Full CRUD operations for user profiles with image upload support via Cloudinary
- **Class Management**: Dynamic class assignment and year progression functionality
- **Alumni Network**: Dedicated alumni registration, verification, and management system

### 📊 **Academic Management**
- **Marks Submission**: Digital marks entry and management system for teachers
- **Result Calculation**: Automated result generation for Primary (Beez to Class 4) and High School (Class 5 to 8) sections
- **Student Records**: Comprehensive student information management including grades, attendance, and academic history
- **Admission Processing**: Bulk admission processing with rank-based selection and automated user account creation

### 📢 **Communication & Notifications** 
- **Notice Board**: School-wide notice management system with admin controls
- **Blog System**: Content management for school blogs with CRUD operations
- **Push Notifications**: Firebase Cloud Messaging (FCM) integration for real-time notifications
- **Email System**: Automated email notifications using Nodemailer for various school activities
- **Real-Time Chat**: Socket.io powered chat system with role-based messaging and message history

### 🎯 **Event & Activity Management**
- **Event Controller**: Complete event lifecycle management with admin permissions
- **Event Tracking**: Historical tracking of event status changes with detailed audit logs
- **Admission Events**: Specialized handling for admission-related events and deadlines
- **Activity Toggles**: Dynamic event activation/deactivation with administrative controls

### 🔄 **Data Management & Performance**
- **Redis Caching**: High-performance caching for frequently accessed data (alumni lists, user sessions)
- **MongoDB Integration**: Robust document-based data storage with Mongoose ODM
- **PDF Generation**: Automated PDF creation for admission forms, user details, and official documents
- **File Management**: Cloudinary integration for profile pictures and document storage
- **Data Validation**: Comprehensive input validation and sanitization across all endpoints

### 📱 **Mobile & Web Support**
- **Cross-Platform API**: RESTful APIs supporting both web and mobile applications
- **Token Storage**: FCM token management for push notifications across devices
- **Device Tracking**: User device information tracking for security and analytics
- **CORS Configuration**: Cross-origin resource sharing setup for frontend integration
  


## Tech Stack

### 🚀 **Core Technologies**
- **Node.js** and **Express.js**: Backend framework for RESTful API endpoints and middleware management
- **MongoDB**: NoSQL database for flexible document storage with Mongoose ODM for schema management
- **Redis**: In-memory data store for caching, session management, OTP storage, and real-time data synchronization

### 🔐 **Authentication & Security**
- **JWT (JSON Web Tokens)**: Secure token-based authentication with refresh token support
- **bcrypt**: Advanced password hashing and salt generation for enhanced security
- **Google OAuth 2.0**: Single sign-on integration using Google Auth Library
- **Firebase Admin SDK**: Push notification management and user verification

### 📧 **Communication & Notifications**
- **Nodemailer**: SMTP email service for automated notifications (password recovery, admission confirmations, OTP delivery)
- **Socket.io**: Real-time bidirectional communication for chat functionality and live updates
- **Firebase Cloud Messaging (FCM)**: Cross-platform push notification service

### 🖼️ **File & Media Management**
- **Cloudinary**: Cloud-based image and video management with automatic optimization and CDN delivery
- **Multer**: Middleware for handling multipart/form-data file uploads
- **PDFKit**: Dynamic PDF generation for admission forms, certificates, and reports

### 🔧 **Development & Deployment Tools**
- **Docker**: Containerization for consistent development and production environments
- **CORS**: Cross-Origin Resource Sharing configuration for frontend integration
- **Cookie-Parser**: Secure HTTP cookie handling for authentication tokens
- **Dotenv**: Environment variable management for configuration secrets

### 📊 **Additional Libraries**
- **Axios**: HTTP client for external API communications
- **Form-Data**: Multipart form data handling for file uploads
- **Mongoose**: MongoDB object modeling and schema validation


## Project Structure
The project follows a well-organized MVC (Model-View-Controller) architecture with modular components:

```plaintext
SRSNBackend/
├── backend/
│   ├── 📁 config/                    # Database and Redis configuration
│   │   ├── db.js                     # MongoDB connection setup
│   │   └── Redis.js                  # Redis client configuration
│   │
│   ├── 📁 controller/                # Business logic handlers
│   │   ├── 📁 Alumni/                # Alumni management controllers
│   │   │   ├── AlumniApplicationView.js  # View alumni applications
│   │   │   ├── alumniDelete.js           # Delete/reject alumni
│   │   │   ├── AlumniDetails.js          # Fetch alumni details
│   │   │   ├── alumniEdit.js             # Update alumni profiles
│   │   │   ├── AlumniGoogleLogin.js      # Google OAuth for alumni
│   │   │   ├── alumniLogOut.js           # Alumni logout functionality
│   │   │   ├── alumniOtp.js              # OTP-based alumni authentication
│   │   │   ├── AlumniSearch.js           # Search alumni records
│   │   │   ├── alumniTemp.js             # Temporary alumni registration
│   │   │   ├── alumniVeri.js             # Alumni verification/approval
│   │   │   └── AlumniView.js             # List all alumni
│   │   │
│   │   ├── 📁 Blog/                  # Blog management
│   │   │   ├── BlogCreate.js             # Create new blog posts
│   │   │   ├── BlogDelete.js             # Delete blog posts
│   │   │   └── Blogfetch.js              # Retrieve blog posts
│   │   │
│   │   ├── 📁 EventControl/          # Event management system
│   │   │   ├── 📁 Admission/             # Admission-specific events
│   │   │   │   └── AdmissionFetch.js     # Fetch admission events
│   │   │   ├── 📁 General/               # General event management
│   │   │   │   ├── EventAdd.js           # Create new events
│   │   │   │   ├── EventEdit.js          # Edit existing events
│   │   │   │   ├── EventFetch.js         # Retrieve events
│   │   │   │   └── EventToggle.js        # Toggle event status
│   │   │   └── 📁 MarksSubmission/       # Marks-related events
│   │   │       └── MarksSubmissionFetch.js # Fetch marks events
│   │   │
│   │   ├── 📁 Message/               # Communication system
│   │   │   └── Message.js                # Handle messages
│   │   │
│   │   ├── 📁 Notice/                # Notice board management
│   │   │   ├── NoticeDelete.js           # Delete notices
│   │   │   ├── NoticeEntery.js           # Create notices
│   │   │   └── Noticefetch.js            # Fetch notices
│   │   │
│   │   ├── 📁 TokenStore/            # FCM token management
│   │   │   ├── send_message.js           # Send push notifications
│   │   │   └── store_token.js            # Store FCM tokens
│   │   │
│   │   ├── 📁 User/                  # User management controllers
│   │   │   ├── CalculateResult.js        # Academic result calculation
│   │   │   ├── FetchUserProfile.js       # Get user profile data
│   │   │   ├── ForgotPassword.js         # Password reset functionality
│   │   │   ├── StudentFetch.js           # Retrieve student data
│   │   │   ├── StudentMarksSubmission.js # Submit student marks
│   │   │   ├── Teacherfetch.js           # Retrieve teacher data
│   │   │   ├── UserChangeClass.js        # Change student class
│   │   │   ├── UserDelete.js             # Delete user accounts
│   │   │   ├── UserEdit.js               # Edit user profiles
│   │   │   ├── UserEditById.js           # Edit user by ID
│   │   │   ├── UserGoogleLogin.js        # Google OAuth for users
│   │   │   ├── UserLogin.js              # User authentication
│   │   │   ├── UserLogout.js             # User logout
│   │   │   └── UserSignUp.js             # User registration
│   │   │
│   │   └── 📁 UserAdmission/         # Student admission system
│   │       ├── UserAdmissionfetch.js     # Fetch admission applications
│   │       ├── userAdmissionSearch.js    # Search admission records
│   │       ├── UserAdmissionSignUp.js    # Submit admission application
│   │       ├── UserAppicationDelete.js   # Delete admission applications
│   │       ├── UserApplicationAdd.js     # Add single admission
│   │       └── userApplicationAddArray.js # Bulk admission processing
│   │
│   ├── 📁 helper/                    # Utility functions
│   │   ├── Class.js                      # Class-related utilities
│   │   ├── Mail.js                       # Email service helper
│   │   └── PdfJenerator.js               # PDF generation utilities
│   │
│   ├── 📁 middlewares/               # Authentication & authorization
│   │   ├── authAlumniToken.js            # Alumni token verification
│   │   ├── authToken.js                  # User token verification
│   │   ├── CheckAdmin.js                 # Admin role verification
│   │   └── CheckTeacher.js               # Teacher role verification
│   │
│   ├── 📁 model/                     # Database schemas
│   │   ├── 📁 Alumni/                    # Alumni data models
│   │   │   ├── alumniTempModel.js        # Temporary alumni applications
│   │   │   └── alumniVeriModel.js        # Verified alumni records
│   │   ├── 📁 Blog/                      # Blog data models
│   │   │   └── BlogModel.js              # Blog post schema
│   │   ├── 📁 Chat/                      # Chat system models
│   │   │   └── Chatmodel.js              # Chat message schema
│   │   ├── 📁 EventControl/              # Event data models
│   │   │   └── EventControl.js           # Event schema
│   │   ├── 📁 Notice/                    # Notice board models
│   │   │   └── NoticeModel.js            # Notice schema
│   │   ├── 📁 Token/                     # FCM token models
│   │   │   └── TokenModel.js             # FCM token schema
│   │   └── 📁 User/                      # User data models
│   │       ├── UserAdmissionModel.js     # Admission application schema
│   │       └── UserModel.js              # Main user schema
│   │
│   ├── 📁 public/                    # Static assets
│   │   └── Logo.png                      # School logo
│   │
│   ├── 📁 routes/                    # API route definitions
│   │   └── index.js                      # Main route configuration
│   │
│   ├── 📁 Socket/                    # Real-time communication
│   │   └── SocketHandler.js              # Socket.io event handlers
│   │
│   ├── 📁 utilis/                    # Utility modules
│   │   └── jwt.js                        # JWT token utilities
│   │
│   ├── 📁 etc/secrets/               # Security configurations
│   │   └── serviceAccountKey.json        # Firebase service account
│   │
│   ├── 📄 firebase.js                # Firebase initialization
│   ├── 📄 index.js                   # Application entry point
│   ├── 📄 package.json               # Dependencies and scripts
│   └── 📄 Dockerfile                 # Docker configuration
│
├── 📄 README.md                      # Project documentation
├── 📄 LICENSE                        # License information
└── 📄 docker-compose.yml             # Docker composition file
```

### 🏗️ **Architecture Highlights**
- **Modular Design**: Clear separation of concerns with dedicated folders for different functionalities
- **Role-Based Structure**: Separate handling for Students, Teachers, Admin, and Alumni
- **Security Layer**: Comprehensive middleware for authentication and authorization
- **Real-Time Features**: Dedicated Socket.io implementation for live communication
- **Scalable Configuration**: Environment-based configuration management
- **Document Generation**: Built-in PDF generation capabilities for official documents

## API Endpoints Overview

### 🔐 **Authentication Routes**
- `POST /api/userSignUp` - User registration with auto-generated passwords
- `POST /api/userSignIn` - Standard email/password authentication
- `POST /api/userGoogleLogin` - Google OAuth authentication
- `POST /api/refresh-token` - JWT token refresh
- `POST /api/userLogout` - Secure user logout
- `POST /api/forgotpasswordotpsend` - Password reset OTP generation
- `POST /api/forgotpasswordotpverify` - OTP verification for password reset
- `POST /api/resetpassword` - Password reset with validation

### 👥 **User Management**
- `GET /api/userProfile` - Fetch authenticated user profile
- `PUT /api/userEdit` - Update user profile information
- `GET /api/studentFetch` - Retrieve student records
- `GET /api/teacherFetch` - Retrieve teacher records
- `PUT /api/chnageYearClass` - Update student class/year
- `DELETE /api/deleteUser/:userId` - Remove user account
- `PUT /api/userEditById` - Admin-level user editing

### 🎓 **Alumni System**
- `POST /api/alumniTempSave` - Submit alumni application
- `POST /api/alumniVeri` - Approve/reject alumni applications (Auth Required)
- `GET /api/alumniView` - List all verified alumni
- `DELETE /api/alumniDelete` - Remove alumni record (Auth Required)
- `POST /api/alumniSearch` - Search alumni database
- `GET /api/alumniApplicationView` - View pending applications
- `POST /api/alumniOtp` - Alumni OTP login
- `POST /api/otpVerify` - Verify alumni OTP
- `GET /api/alumniDetails` - Get alumni profile details
- `PUT /api/alumniUpdateProfile` - Update alumni profile
- `POST /api/alumniLogOut` - Alumni logout
- `POST /api/alumniGoogleLogin` - Alumni Google authentication

### 📚 **Academic Management**
- `POST /api/userMarksSubmission` - Submit student marks
- `GET /api/getResultPrimary` - Calculate results for Beez to Class 4
- `GET /api/getResultHigh` - Calculate results for Class 5 to 8

### 🎓 **Admission System**
- `POST /api/userAdmissionSignUp` - Submit admission application with PDF generation
- `GET /api/userAdmissionFetch` - Fetch admission applications by class
- `POST /api/userAdmissionAdd` - Process single admission
- `POST /api/userAdmissionAddArray` - Bulk admission processing
- `DELETE /api/userAdmissionDelete` - Delete admission application
- `POST /api/userAdmissionSearch` - Search admission records

### 📢 **Communication & Content**
- `POST /api/noticeEntery` - Create school notices
- `GET /api/noticeFetch` - Retrieve all notices
- `DELETE /api/noticeDelete` - Delete notices
- `POST /api/blogAdd` - Create blog posts
- `GET /api/blogFetch` - Retrieve blog posts
- `DELETE /api/blogDelete` - Delete blog posts
- `POST /api/message` - Send messages

### 🎯 **Event Management**
- `POST /api/eventAdd` - Create new events
- `PUT /api/eventEdit` - Edit existing events
- `GET /api/eventFetch` - Retrieve events
- `PUT /api/eventToggle` - Toggle event status
- `GET /api/admissionFetch` - Fetch admission events
- `GET /api/marksSubmissionFetch` - Fetch marks submission events

### 📱 **Push Notifications**
- `POST /api/save-token` - Store FCM tokens for notifications
- `POST /api/token-send-message` - Send push notifications to all users

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Redis** (local or cloud instance)
- **Docker** (optional, for containerized deployment)

### Method 1: Local Development Setup

**1. Clone the Repository**
```bash
git clone https://github.com/sandipto729/SRSNBackend.git
cd SRSNBackend/backend
```

**2. Install Dependencies**
```bash
npm install
```

**3. Environment Configuration**
Create a `.env` file in the `backend` directory with the following variables:
```env
# Database Configuration
MONGO_URL=your_mongodb_connection_string

# Application Settings
PORT=8000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Authentication
TOKEN_SECRET_KEY=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Email Configuration (Gmail)
PASSKEY=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
```

**4. Firebase Setup**
- Download your Firebase service account key
- Place it at `backend/etc/secrets/serviceAccountKey.json`
- Ensure proper Firebase project configuration

**5. Start the Development Server**
```bash
npm start
# or for development with nodemon
npm run dev
```

The server will start on `http://localhost:8000`
### Method 2: Docker Deployment

**Prerequisites**: Ensure Docker is installed on your system.

**Quick Start with Docker**
```bash
docker run -it \
  -e MONGO_URL="your_mongodb_connection_string" \
  -e TOKEN_SECRET_KEY="your_jwt_secret_key" \
  -e PASSKEY="your_gmail_app_password" \
  -e REDIS_PASSWORD="your_redis_password" \
  -e REDIS_HOST="your_redis_host" \
  -e REDIS_PORT="6379" \
  -e FRONTEND_URL="http://localhost:3000" \
  -e GOOGLE_CLIENT_ID="your_google_oauth_client_id" \
  -p 8000:8000 \
  sandipto729/srsnbackend
```

**Using Docker Compose** (Recommended for full stack)
```yaml
version: '3.8'
services:
  backend:
    image: sandipto729/srsnbackend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/srsn
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - TOKEN_SECRET_KEY=your_secret_key
      - PASSKEY=your_gmail_password
    depends_on:
      - mongo
      - redis
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

**Access the Application**
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/api`

### Method 3: Production Deployment

**Environment Variables for Production**
```env
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
REDIS_HOST=your-redis-cloud-host
REDIS_PORT=6380
REDIS_PASSWORD=your-redis-password
FRONTEND_URL=https://your-frontend-domain.com
```

**Security Considerations**
- Use strong JWT secret keys
- Enable HTTPS in production
- Configure CORS properly for your domain
- Use environment-specific Firebase credentials
- Enable MongoDB authentication
- Use Redis AUTH for security





## 🧪 Testing & Development

### API Testing
You can test the API endpoints using tools like:
- **Postman**: Import the API collection for comprehensive testing
- **Thunder Client**: VS Code extension for API testing
- **cURL**: Command-line testing examples

### Sample API Requests

**User Authentication**
```bash
# User Registration
curl -X POST http://localhost:8000/api/userSignUp \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","aadharNo":"123456789012"}'

# User Login
curl -X POST http://localhost:8000/api/userSignIn \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"89012"}'
```

**Alumni Management**
```bash
# View Alumni (requires auth)
curl -X GET http://localhost:8000/api/alumniView \
  -H "Authorization: Bearer your_jwt_token"

# Alumni OTP Login
curl -X POST http://localhost:8000/api/alumniOtp \
  -H "Content-Type: application/json" \
  -d '{"email":"alumni@example.com"}'
```

### Development Scripts
```bash
# Start development server with hot reload
npm run dev

# Run tests (if available)
npm test

# Build for production
npm run build

# Check code style
npm run lint
```

## 📚 Key Features Deep Dive

### 🔐 Multi-Level Authentication System
- **Role-Based Access**: Different permission levels for Admin, Teacher, Student, and Alumni
- **Token Security**: HTTP-only cookies with secure transmission
- **Google OAuth**: Seamless single sign-on integration
- **OTP Verification**: Email-based two-factor authentication

### 📊 Academic Result System
The system supports two different calculation methods:
- **Primary Section** (Beez to Class 4): Age-appropriate grading system
- **High School Section** (Class 5 to 8): Advanced academic evaluation

### 📱 Real-Time Communication
- **Socket.io Integration**: Live chat functionality
- **Push Notifications**: FCM-based instant notifications
- **Message History**: Persistent chat storage with MongoDB
- **Role-Based Messaging**: Different chat rooms for different user types

### 🎓 Comprehensive Admission System
- **PDF Generation**: Automatic application form creation
- **Email Integration**: Confirmation emails with attachments
- **Bulk Processing**: Handle multiple admissions simultaneously
- **Rank-Based Selection**: Automated admission decisions based on performance

## 🔧 Configuration Guide

### Email Configuration (Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for the application
3. Use the App Password as the `PASSKEY` environment variable

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Cloud Messaging
3. Download the service account key
4. Configure FCM for push notifications

### Redis Caching Strategy
- **Alumni Data**: Cached for 2 minutes to improve performance
- **Session Management**: Store user sessions and OTPs
- **Real-time Data**: Cache frequently accessed information

### MongoDB Schema Design
- **User Collections**: Separate collections for different user types
- **Event Tracking**: Comprehensive audit logs for all activities
- **Document References**: Efficient relationship management between collections

- [sandipto729](https://github.com/sandipto729)

- [Ritam-Vaskar](https://github.com/Ritam-Vaskar)


## 🤝 Contributing

We welcome contributions to improve the SRSN Backend! Here's how you can help:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow the existing code style and structure
- Write clear, descriptive commit messages
- Include tests for new features when applicable
- Update documentation for any API changes
- Test your changes thoroughly before submitting

### Areas for Contribution
- 🐛 Bug fixes and performance improvements
- 📚 Documentation enhancements
- 🔐 Security improvements
- 🆕 New feature development
- 🧪 Test coverage expansion
- 🎨 UI/UX improvements for API responses

## 👥 Authors & Contributors

### Core Development Team
- **[Sandipto Roy](https://github.com/sandipto729)** 
- **[Ritam Vaskar](https://github.com/Ritam-Vaskar)** 

### Special Thanks
- Sri Ramkrishna Siksha Niketan School administration for requirements and feedback
- Students and teachers who provided valuable user experience insights
- Open source community for the amazing tools and libraries

## 🎓 Used By

This comprehensive school management system is actively used by:

### 🏫 **Sri Ramkrishna Siksha Niketan School**
- **Primary Section**: Managing Beez, Ankur, and Kisholoy classes
- **High School Section**: Classes 1 through 8
- **Alumni Network**: 500+ registered alumni
- **Staff Management**: Teachers and administrative staff
- **Student Count**: 1000+ active students

### 📊 **Usage Statistics**
- Daily active users: 200+
- API calls per day: 10,000+
- Documents generated: 50+ per week
- Push notifications sent: 1000+ per month



## 📄 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use** - Use this software commercially
- ✅ **Modification** - Modify the source code
- ✅ **Distribution** - Distribute the software
- ✅ **Private use** - Use the software privately
- ❗ **License and copyright notice** - Include the license in distributions
- ❌ **Liability** - No warranty or liability
- ❌ **Warranty** - No warranty provided

## 🚀 Future Roadmap

### Upcoming Features
- [ ] **Mobile App API**: Enhanced endpoints for mobile application
- [ ] **Advanced Analytics**: Student performance analytics and reporting
- [ ] **Video Conferencing**: Integration with video calling for online classes
- [ ] **Library Management**: Book lending and return system
- [ ] **Fee Management**: Complete fee collection and payment tracking
- [ ] **Examination System**: Online examination and assessment tools
- [ ] **Parent Portal**: Dedicated parent access and communication system
- [ ] **Attendance System**: Automated attendance tracking with facial recognition

### Technical Improvements
- [ ] **GraphQL API**: Alternative to REST for better performance
- [ ] **Microservices**: Service decomposition for better scalability
- [ ] **Load Balancing**: Support for high-availability deployments
- [ ] **Advanced Caching**: Multi-level caching strategies
- [ ] **API Rate Limiting**: Protection against abuse and overuse
- [ ] **Comprehensive Testing**: Unit, integration, and end-to-end tests
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Monitoring & Logging**: Advanced application monitoring

## 📞 Support & Feedback

We value your feedback and are here to help! If you have any questions, suggestions, or issues, please don't hesitate to reach out.

### 📧 **Contact Information**
- **Primary Developer**: [sandipto729@gmail.com](mailto:sandipto729@gmail.com)
- **Project Repository**: [GitHub Issues](https://github.com/sandipto729/SRSNBackend/issues)
- **School Contact**: Sri Ramkrishna Siksha Niketan School Administration

### 🐛 **Bug Reports**
If you encounter any bugs or issues:
1. Check existing [GitHub Issues](https://github.com/sandipto729/SRSNBackend/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce the problem
4. Provide system information and error logs

### 💡 **Feature Requests**
Have an idea for improvement?
1. Open a [GitHub Issue](https://github.com/sandipto729/SRSNBackend/issues) with the `enhancement` label
2. Describe the feature and its benefits
3. Provide use cases and examples
4. Discuss implementation approaches

### 📚 **Documentation**
- **API Documentation**: Available in the `/docs` folder (coming soon)
- **Code Comments**: Comprehensive inline documentation
- **Wiki**: Check our [GitHub Wiki](https://github.com/sandipto729/SRSNBackend/wiki) for detailed guides

### 🌟 **Show Your Support**
If this project helps you, please consider:
- ⭐ **Starring** the repository on GitHub
- 🍴 **Forking** and contributing to the project
- 📢 **Sharing** with others who might benefit
- 📝 **Writing** about your experience

---

**Thank you for your interest in the SRSN Backend project! Together, we're building better educational technology for everyone. Happy coding! 🚀**
