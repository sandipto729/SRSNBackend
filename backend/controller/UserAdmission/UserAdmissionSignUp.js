// const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
// const sendEmail = require('./../../helper/Mail');

// const userAdmissionSignUp = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await UserAdmissionModel.findOne({ email: email });
//         if (user) {
//             return res.status(400).json({ success: false, message: 'User already exists' });
//         }
//         const { rAddressSameAsPermanent, ...userAdmissionData } = req.body;

//         if (rAddressSameAsPermanent == 'Yes') {
//             userAdmissionData.rAddress = userAdmissionData.address;
//             userAdmissionData.rCity = userAdmissionData.city;
//             userAdmissionData.rDistrict = userAdmissionData.district;
//             userAdmissionData.rMunicipality =userAdmissionData.municipality;
//             userAdmissionData.rPanchayt = userAdmissionData.panchayt;
//             userAdmissionData.rPostOffice = userAdmissionData.postOffice;
//             userAdmissionData.rPoliceStation = userAdmissionData.policeStation;
//             userAdmissionData.rPinCode = userAdmissionData.pinCode;
//             userAdmissionData.rState = userAdmissionData.state;
//             userAdmissionData.rCountry = userAdmissionData.country;
//         }
//         const userAdmission = await UserAdmissionModel.create(userAdmissionData);

//         sendEmail(email, 'Admission Application', 'Thank you for applying for admission. Note that your application number is ' + userAdmission._id + '. We will get back to you soon.And continuously check the school notice for updates.');
//         // const userAdmission = await UserAdmissionModel.create(req.body);
//         res.status(200).json({ success: true, userAdmission });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ success: false, error: err.message });
//     }
// }

// module.exports = userAdmissionSignUp


// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
// const sendEmail = require('./../../helper/Mail');

// const userAdmissionSignUp = async (req, res) => {
//   try {
//     console.log("Request received:", req.body);

//     const { email } = req.body;

//     // Check if user already exists
//     console.log("Checking if user exists in database");
//     const existingUser = await UserAdmissionModel.findOne({ email: email });
//     if (existingUser) {
//       console.log("User already exists");
//       return res.status(400).json({ success: false, message: 'User already exists' });
//     }

//     const { rAddressSameAsPermanent, ...userAdmissionData } = req.body;

//     // Set residential address same as permanent address if specified
//     if (rAddressSameAsPermanent === 'Yes') {
//       console.log("Setting residential address same as permanent address");
//       userAdmissionData.rAddress = userAdmissionData.address;
//       userAdmissionData.rCity = userAdmissionData.city;
//       userAdmissionData.rDistrict = userAdmissionData.district;
//       userAdmissionData.rMunicipality = userAdmissionData.municipality;
//       userAdmissionData.rPanchayt = userAdmissionData.panchayt;
//       userAdmissionData.rPostOffice = userAdmissionData.postOffice;
//       userAdmissionData.rPoliceStation = userAdmissionData.policeStation;
//       userAdmissionData.rPinCode = userAdmissionData.pinCode;
//       userAdmissionData.rState = userAdmissionData.state;
//       userAdmissionData.rCountry = userAdmissionData.country;
//     }

//     // Create user admission in database
//     console.log("Creating user in database");
//     const userAdmission = await UserAdmissionModel.create(userAdmissionData);
//     console.log("User admission created successfully");

//     // Generate PDF
//     console.log("Generating PDF");
//     const pdfPath = `./${userAdmission._id}.pdf`;
//     const doc = new PDFDocument();
//     const writeStream = fs.createWriteStream(pdfPath);
//     doc.pipe(writeStream);

//     // Add School Name, Address, and Date at the top with color
//     doc.fillColor('#4B8BF4')  // Color for the school name
//       .fontSize(14)
//       .text('Sri Ramakrishna Siksha Niketan', { align: 'center' });

//     doc.fillColor('#333333')  // Color for the address
//       .fontSize(10)
//       .text('Address: haridasnagar, Raghunathganj, Murshidabad, West Bengal, India', { align: 'center' });

//     doc.fillColor('#FF5733')  // Color for the date
//       .fontSize(10)
//       .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

//     doc.moveDown();

//     // Admission Application Title
//     doc.fillColor('#000000')  // Black color for the title
//       .fontSize(16)
//       .text('Admission Application', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12);

//     // Add user data to the PDF
//     for (const [key, value] of Object.entries(userAdmissionData)) {
//       doc.text(`${key}: ${value}`);
//     }

//     doc.text(`Application Number: ${userAdmission._id}`, { underline: true });
//     doc.end();

//     console.log("Waiting for PDF to finish writing");
//     await new Promise((resolve, reject) => {
//       writeStream.on('finish', () => {
//         console.log("PDF write stream finished");
//         resolve();
//       });
//       writeStream.on('error', (err) => {
//         console.error("Error during PDF creation:", err);
//         reject(err);
//       });
//     });

//     console.log("PDF path:", pdfPath);
//     console.log("Does PDF exist:", fs.existsSync(pdfPath));

//     // Send email with the generated PDF
//     console.log("Starting email sending");
//     const attachments = [
//       {
//         filename: `${userAdmission._id}.pdf`,
//         path: pdfPath,
//       },
//     ];
//     console.log("Email attachments:", attachments);

//     await sendEmail(
//       email,
//       'Admission Application',
//       `Thank you for applying for admission. Note that your application number is ${userAdmission._id}.`,
//       attachments
//     );
//     console.log("Email sent successfully");

//     // Clean up the generated PDF file
//     console.log("Deleting temporary PDF file");
//     fs.unlinkSync(pdfPath);

//     // Send response back to client
//     console.log("Sending response to client");
//     res.status(200).json({ success: true, userAdmission });
//   } catch (err) {
//     console.error("Error in userAdmissionSignUp:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports = userAdmissionSignUp;



const PDFDocument = require('pdfkit');
const fs = require('fs');
const UserAdmissionModel = require('../../model/User/UserAdmissionModel');
const sendEmail = require('./../../helper/Mail');
const path = require('path');
const UserModel = require('../../model/User/UserModel');

const userAdmissionSignUp = async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { email, ipAddress, paymentId } = req.body; // Assuming the IP address is passed in the request body

    // Check if user already exists
    console.log("Checking if user exists in database");
    const existingUser = await UserAdmissionModel.findOne({ email: email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const existingUser2 = await UserModel.findOne({ email: email });
    if (existingUser2) {
      console.log("User already exists");
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    //check payment (does 2 payment id same or not)
    if (paymentId !== 'cash') {
      const existingPayment = await UserAdmissionModel.findOne({ paymentId: paymentId });
      if (existingPayment) {
        console.log("Payment already exists");
        return res.status(400).json({ success: false, message: 'Payment Id already exists' });
      }
    }


    const { rAddressSameAsPermanent, ...userAdmissionData } = req.body;

    // Set residential address same as permanent address if specified
    if (rAddressSameAsPermanent === 'Yes') {
      console.log("Setting residential address same as permanent address");
      userAdmissionData.rAddress = userAdmissionData.address;
      userAdmissionData.rCity = userAdmissionData.city;
      userAdmissionData.rDistrict = userAdmissionData.district;
      userAdmissionData.rMunicipality = userAdmissionData.municipality;
      userAdmissionData.rPanchayt = userAdmissionData.panchayt;
      userAdmissionData.rPostOffice = userAdmissionData.postOffice;
      userAdmissionData.rPoliceStation = userAdmissionData.policeStation;
      userAdmissionData.rPinCode = userAdmissionData.pinCode;
      userAdmissionData.rState = userAdmissionData.state;
      userAdmissionData.rCountry = userAdmissionData.country;
    }

    // Create user admission in database
    console.log("Creating user in database");
    const userAdmission = await UserAdmissionModel.create(userAdmissionData);
    console.log("User admission created successfully");

    // Generate PDF
    console.log("Generating PDF");
    const pdfPath = `./${userAdmission._id}.pdf`;
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    console.log(path.resolve(__dirname, './../../public/Logo.png'));

    // School Name, Address, Date, and Application ID at the top with color
    doc.fillColor('#4B8BF4')  // Blue for school name
      .fontSize(14)
      .text('Sri Ramakrishna Siksha Niketan', { align: 'center' });

    doc.fillColor('#333333')  // Dark grey for address
      .fontSize(10)
      .text('Address: Haridasnagar, Raghunathganj, Murshidabad, West Bengal, India', { align: 'center' });
    doc.fillColor('#333333')  // Dark grey for email
      .text('Email: sriramakrishnasikshaniketan@gmail.com', { align: 'center' });
    doc.fillColor('#333333')  // Dark grey for phone
      .text('Phone: 9932842142,9434531454', { align: 'center' });

    doc.fillColor('#FF5733')  // Orange for date
      .fontSize(10)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.moveDown();

    // Application ID in bold at the top
    doc.fillColor('#000000') // Black for Application ID
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Application ID: ${userAdmission._id}`, { align: 'center' });

    doc.moveDown();

    // Add IP address if available
    if (ipAddress) {
      doc.fillColor('#888888')  // Grey for IP Address
        .fontSize(10)
        .text(`IP Address: ${ipAddress}`, { align: 'center' });
    }

    doc.moveDown();

    // Email contents (fields)
    const fields = [
      { label: 'Name', value: userAdmissionData.name },
      { label: 'Email', value: userAdmissionData.email },
      { label: 'Phone', value: userAdmissionData.phone },
      { label: 'Date of Birth', value: userAdmissionData.dob },
      { label: 'DOB Registration No', value: userAdmissionData.dobRegNo },
      { label: 'Aadhar No', value: userAdmissionData.aadharNo },
      { label: 'Student Code', value: userAdmissionData.studentCode },
      { label: 'Father\'s Name', value: userAdmissionData.fatherName },
      { label: 'Mother\'s Name', value: userAdmissionData.motherName },
      { label: 'Guardian\'s Name', value: userAdmissionData.guardianName },
      { label: 'Payment ID', value: userAdmissionData.paymentId },
      { label: 'Class ', value: userAdmissionData.grade },
    ];

    // Adding the fields to the PDF
    doc.moveDown();

    // Label and value coloring
    fields.forEach(field => {
      // Label in black
      doc.fillColor('#000000') // Black for labels
        .fontSize(12)
        .text(`${field.label}:`, { continued: true, font: 'Helvetica-Bold' });

      // Value in grey
      doc.fillColor('#888888')  // Grey for values
        .text(` ${field.value}`);
    });

     //school logo
    // Draw the image
    doc.image(path.resolve(__dirname, './../../public/Logo.png'), {
      fit: [100, 100],
      x: doc.page.width / 2 - 50,
      y: doc.y + 10
    });

    // Overlay a semi-transparent rectangle
    doc.fillColor('white')
      .opacity(0.5) // Set transparency
      .rect(doc.page.width / 2 - 50, doc.y + 10, 100, 100) // Same dimensions as the logo
      .fill()
      .opacity(1); // Reset opacity for subsequent elements


    doc.end();

    console.log("Waiting for PDF to finish writing");
    await new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log("PDF write stream finished");
        resolve();
      });
      writeStream.on('error', (err) => {
        console.error("Error during PDF creation:", err);
        reject(err);
      });
    });

    console.log("PDF path:", pdfPath);
    console.log("Does PDF exist:", fs.existsSync(pdfPath));

    // Send email with the generated PDF
    console.log("Starting email sending");
    const attachments = [
      {
        filename: `${userAdmission._id}.pdf`,
        path: pdfPath,
      },
    ];
    console.log("Email attachments:", attachments);

    await sendEmail(
      email,
      'Admission Application',
      `Thank you for applying for admission. Note that your application number is ${userAdmission._id}.`,
      attachments
    );
    console.log("Email sent successfully");

    // Clean up the generated PDF file
    console.log("Deleting temporary PDF file");
    fs.unlinkSync(pdfPath);

    // Send response back to client
    console.log("Sending response to client");
    res.status(200).json({ success: true, userAdmission });
  } catch (err) {
    console.error("Error in userAdmissionSignUp:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = userAdmissionSignUp;
