const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createUserPDF = (user) => {
  return new Promise((resolve, reject) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Define file path for the PDF
    const pdfPath = path.join(__dirname, `${user._id}_details.pdf`);

    // Pipe the PDF into a file
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Add User Details to the PDF
    doc.fontSize(20).text('User Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Mongo ID: ${user._id}`);
    doc.text(`Aadhar Card: ${user.aadharCard}`);

    // Add the photo (make sure to adjust the path or use a public URL)
    doc.image(user.photo, {
      fit: [100, 100],
      align: 'center',
      valign: 'center',
    });

    // Finalize the PDF
    doc.end();

    // Wait for the file to be written and return the path
    writeStream.on('finish', () => {
      resolve(pdfPath); // return the path of the created PDF
    });

    writeStream.on('error', reject);
  });
};

module.exports = createUserPDF;