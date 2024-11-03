
# SRSN Backend 

This repository contains the backend code for the **Sriram Krishna Siksha Niketan** project, handling user data, authentication, and various administrative functionalities to support the school's web portal.


## Features
- **User Authentication**: Secure login and password management using bcrypt.
- **Data Management**:
  - CRUD operations for student records, including student information, results, and class changes.
  - Event management with toggles for event status controlled by admin permissions.
- **Event Tracking**: A separate table records event status changes, with a popup for detailed change history.
- **Profile Picture Uploads**: Integrated with Cloudinary to handle image uploads and URL generation.
  


## Tech Stack

- **Node.js** and **Express**: Backend framework for API endpoints.
- **MongoDB**: Database for storing user data and event details.
- **Nodemailer**: For sending notification emails (e.g., password recovery).
- **bcrypt**: For password hashing.
- **Cloudinary**: For image upload and storage.


## Project Structure
The project structure follows a standard Node.js MVC architecture:

```plaintext
SRSNBackend/
├── backend/
│   ├── controllers/         # Handles business logic for various routes
│   ├── models/              # Mongoose schemas for MongoDB collections
│   ├── routes/              # Defines API routes
│   ├── middleware/          # Middleware, including authentication checks
│   ├── utils/               # Utility functions (e.g., image upload handling)
│   └── config/              # Configuration files (e.g., MongoDB connection)
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/sandipto729/ SRSNBackend.git

```

Go to the project directory

```bash
  cd SRSNBackend

```

Install dependencies

```bash
  npm install
```
Add Environment Variables

```bash
    MONGO_URL=Your_Mongodb_connection_string
    FRONTEND_URL=Your_frontend_url
    TOKEN_SECRET_KEY=Your_Token_key
    PASSKEY=Your_Gmail_Password

```
Start the server

```bash
  node index.js
```


## API Reference

# API Reference

## Alumni Routes

- **POST** `/alumniTempSave`
  - Save alumni temporary data.
  
- **POST** `/alumniVeri`
  - Verify and accept alumni.
  
- **GET** `/alumniView`
  - Retrieve alumni information.
  
- **DELETE** `/alumniDelete`
  - Deny or delete an alumni record.
  
- **POST** `/alumniSearch`
  - Search for alumni based on criteria.
  
- **GET** `/alumniApplicationView`
  - View alumni application details.

## User Routes

- **GET** `/studentFetch`
  - Fetch student details. *(Authentication required)*
  
- **POST** `/userSignUp`
  - Register a new user. *(Authentication required)*
  
- **POST** `/userSignIn`
  - Log in an existing user.
  
- **GET** `/userProfile`
  - Retrieve user profile. *(Authentication required)*
  
- **PUT** `/userEdit`
  - Edit user profile details. *(Authentication required)*
  
- **GET** `/teacherFetch`
  - Fetch teacher details.
  
- **POST** `/userLogout`
  - Log out the current user. *(Authentication required)*
  
- **PUT** `/chnageYearClass`
  - Change the class year for a user. *(Authentication required)*
  
- **DELETE** `/deleteUser/:userId`
  - Delete a user by ID.

## Message Routes

- **POST** `/message`
  - Send a message.

## Marks Submission Routes

- **POST** `/userMarksSubmission`
  - Submit marks for a user. *(Authentication required)*

- **GET** `/getResult`
  - Retrieve results for a user.

## Student Admission Routes

- **POST** `/userAdmissionSignUp`
  - Sign up for student admission.
  
- **GET** `/userAdmissionFetch`
  - Fetch admission details.
  
- **POST** `/userAdmissionAdd`
  - Add an admission application.
  
- **DELETE** `/userAdmissionDelete`
  - Delete an admission application.

## Notice Routes

- **POST** `/noticeEntery`
  - Add a notice.
  
- **GET** `/noticeFetch`
  - Fetch all notices.
  
- **DELETE** `/noticeDelete`
  - Delete a notice by ID.

## Event Controller Routes

- **POST** `/eventAdd`
  - Add a new event.
  
- **GET** `/admissionFetch`
  - Fetch admission-related events.
  
- **PUT** `/eventEdit`
  - Edit an existing event.
  
- **GET** `/marksSubmissionFetch`
  - Fetch marks submission events.
  
- **PUT** `/eventToggle`
  - Toggle the status of an event. *(Authentication required)*
  
- **GET** `/eventFetch`
  - Fetch all events.



## Authors

- [sandipto729](https://github.com/sandipto729)

- [Ritam-Vaskar](https://github.com/Ritam-Vaskar)


## Contributing

Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request with a description of your changes.


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Used By

This project is used by the following companies:

- Student and Teachers of Sri Ramkrishna Siksha Niketan School (Primary and High Section)



## Feedback

If you have any feedback, please reach out to us at sandipto729@gamil.com

