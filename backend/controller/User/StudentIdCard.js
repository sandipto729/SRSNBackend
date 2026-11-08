const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const UserModel = require('../../model/User/UserModel');

// Helper function to download profile pic to buffer with timeout
async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 5000
    });
    return Buffer.from(response.data);
  } catch (err) {
    console.error(`Failed to download image from ${url}:`, err.message);
    return null;
  }
}

// Helper to generate a single ID card
async function generateIdCard(student) {
  return new Promise(async (resolve, reject) => {
    try {
      const baseDir = path.resolve(__dirname, '../../public/id_cards');
      const classDirName = student.grade || 'Unknown';
      const classDir = path.join(baseDir, classDirName);
      if (!fs.existsSync(classDir)) {
        fs.mkdirSync(classDir, { recursive: true });
      }
      
      const rollNo = (student.result === 1000 || student.result === undefined || student.result === null) ? '' : student.result;
      const sanitizedName = student.name.trim().replace(/[/\\?%*:|"<>]/g, '-');
      const fileName = `${sanitizedName}+${rollNo}.pdf`;
      const filePath = path.join(classDir, fileName);
      
      // Calculate academic session years dynamically
      const currentYear = new Date().getFullYear();
      const yearStart = (currentYear % 100).toString().padStart(2, '0');
      const yearEnd = ((currentYear + 1) % 100).toString().padStart(2, '0');

      // Create PDF Document (640pt wide, 320pt high)
      const doc = new PDFDocument({
        size: [640, 320],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      
      // 1. Draw outer border and clip inside content to rounded corners
      doc.save();
      doc.roundedRect(1.5, 1.5, 637, 317, 6).clip();
      
      // 2. Draw Orange Header
      doc.rect(0, 0, 640, 78).fillColor('#e0651b').fill();
      
      // Draw Logo Circle background
      doc.circle(45, 41, 27).fillColor('#ffffff').fill();
      
      // Draw Logo Image
      const logoPath = path.resolve(__dirname, '../../public/Logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 25, 21, { width: 40, height: 40 });
      } else {
        doc.fillColor('#e0651b')
           .fontSize(8)
           .font('Helvetica-Bold')
           .text('SCHOOL\nLOGO', 18, 32, { width: 54, align: 'center' });
      }
      
      // Draw Header Text
      doc.fillColor('#ffffff').fontSize(19).font('Helvetica-Bold').text('SRI RAMAKRISHNA SIKSHANIKETAN', 86, 14);
      doc.fillColor('#fce4d6').fontSize(11).font('Helvetica').text('Primary School', 86, 36);
      doc.fillColor('#fbdac2').fontSize(9.5).font('Helvetica').text('Haridasnagar, Raghunathganj, Murshidabad  |  Phone: (03483) 266790', 86, 52);
      
      // Draw Red ID Card label
      doc.roundedRect(537, 22, 85, 34, 3).fillColor('#c62828').fill();
      doc.fillColor('#ffffff')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('IDENTITY\nCARD', 537, 26, { width: 85, align: 'center' });
      
      // 3. Draw Body White Background
      doc.rect(0, 78, 640, 242).fillColor('#ffffff').fill();
      doc.restore(); // Restore clipping context so we can draw borders cleanly
      
      // 4. Download and draw profile pic or placeholder
      let imageBuffer = null;
      if (student.profilePic && student.profilePic.startsWith('http')) {
        imageBuffer = await downloadImage(student.profilePic);
      }
      
      if (imageBuffer) {
        try {
          doc.image(imageBuffer, 20, 95, { width: 110, height: 135, fit: [110, 135] });
          // Draw border around photo
          doc.rect(20, 95, 110, 135).lineWidth(1).strokeColor('#999999').stroke();
        } catch (err) {
          console.error(`Failed to embed profile pic for ${student.name}:`, err.message);
          drawPlaceholder(doc);
        }
      } else {
        drawPlaceholder(doc);
      }
      
      function drawPlaceholder(d) {
        d.rect(20, 95, 110, 135).lineWidth(1).strokeColor('#999999').stroke();
        d.fillColor('#f2f2f2').rect(21, 96, 108, 133).fill();
        d.fillColor('#777777')
         .fontSize(10)
         .font('Helvetica')
         .text('Photo\n2.5 x 3.5 cm', 20, 145, { width: 110, align: 'center' });
      }
      
      // 5. Draw Details Fields
      // Field: Student's Name
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Student's Name", 150, 94);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(student.name || '', 150, 107);
      doc.moveTo(150, 122).lineTo(620, 122).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      // Field: Father's Name
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Father's Name", 150, 132);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(student.fatherName || '', 150, 145);
      doc.moveTo(150, 160).lineTo(620, 160).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      // Field: Class & Roll No.
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Class", 150, 170);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(student.grade || '', 150, 183);
      doc.moveTo(150, 198).lineTo(360, 198).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Roll No.", 380, 170);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(String(rollNo), 380, 183);
      doc.moveTo(380, 198).lineTo(620, 198).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      // Field: Date of Birth & Sex
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Date of Birth", 150, 208);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(student.dob || '', 150, 221);
      doc.moveTo(150, 236).lineTo(360, 236).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Sex", 380, 208);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text('', 380, 221); // Left blank as requested
      doc.moveTo(380, 236).lineTo(620, 236).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      // Field: Academic Session
      doc.fillColor('#666666').fontSize(9.5).font('Helvetica').text("Academic Session", 150, 246);
      doc.fillColor('#111111').fontSize(12).font('Helvetica-Bold').text(`20${yearStart} – 20${yearEnd}`, 150, 259);
      doc.moveTo(150, 274).lineTo(620, 274).strokeColor('#cccccc').lineWidth(0.75).stroke();
      
      // 6. Draw Footer Separator and text
      doc.moveTo(1, 286).lineTo(639, 286).strokeColor('#dddddd').lineWidth(1).stroke();
      doc.fillColor('#555555').fontSize(9.5).font('Helvetica').text("If found, please return to the school office.", 20, 296);
      
      // Teacher-in-Charge signature line
      doc.moveTo(500, 298).lineTo(620, 298).strokeColor('#999999').lineWidth(0.75).stroke();
      doc.fillColor('#555555').fontSize(9).font('Helvetica').text("Teacher-in-Charge", 500, 303, { width: 120, align: 'center' });
      
      // 7. Draw outer card border over everything
      doc.roundedRect(1, 1, 638, 318, 6).strokeColor('#999999').lineWidth(1.5).stroke();
      
      doc.end();
      
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Controller entry point
const generateStudentIdCards = async (req, res) => {
  try {
    const classOrder = {
      'beez': 1,
      'ankur': 2,
      'kisholoy': 3,
      '1': 4,
      '2': 5,
      '3': 6,
      '4': 7
    };
    
    const allowedGrades = ['Beez', 'Ankur', 'Kisholoy', '1', '2', '3', '4'];
    let students = [];
    
    // Parse filters
    if (Array.isArray(req.body) && req.body.length > 0) {
      for (const filter of req.body) {
        const className = filter.class;
        if (!className) continue;
        
        // Ensure request is only for allowed classes (Beez, Ankur, Kisholoy, 1-4)
        const isAllowed = allowedGrades.some(g => g.toLowerCase() === className.toLowerCase());
        if (!isAllowed) continue;
        
        const query = {
          role: { $regex: /student/i },
          grade: { $regex: new RegExp(`^${className}$`, 'i') }
        };
        
        if (filter.roll_no_start !== undefined || filter.roll_no_end !== undefined) {
          query.result = {};
          if (filter.roll_no_start !== undefined) {
            query.result.$gte = Number(filter.roll_no_start);
          }
          if (filter.roll_no_end !== undefined) {
            query.result.$lte = Number(filter.roll_no_end);
          }
        }
        
        const classStudents = await UserModel.find(query).lean();
        students.push(...classStudents);
      }
    } else {
      // Fetch for everyone in allowed grades
      const query = {
        role: { $regex: /student/i },
        grade: { $in: ['Beez', 'Ankur', 'Kisholoy', '1', '2', '3', '4', 'beez', 'ankur', 'kisholoy'] }
      };
      students = await UserModel.find(query).lean();
    }
    
    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students matched the criteria.",
        count: 0,
        files: []
      });
    }
    
    // Sort class-wise and roll-no-wise (result field)
    students.sort((a, b) => {
      const gradeA = (a.grade || '').toLowerCase();
      const gradeB = (b.grade || '').toLowerCase();
      
      const orderA = classOrder[gradeA] || 999;
      const orderB = classOrder[gradeB] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      const rollA = (a.result === undefined || a.result === null) ? 9999 : Number(a.result);
      const rollB = (b.result === undefined || b.result === null) ? 9999 : Number(b.result);
      
      return rollA - rollB;
    });
    
    // Concurrency limit queue (10 concurrent generators)
    const limit = 10;
    const generatedFiles = [];
    const failedFiles = [];
    
    for (let i = 0; i < students.length; i += limit) {
      const chunk = students.slice(i, i + limit);
      const promises = chunk.map(async (student) => {
        try {
          const filePath = await generateIdCard(student);
          
          // Get relative path for client response
          const relativePath = path.relative(path.resolve(__dirname, '../../'), filePath);
          
          generatedFiles.push({
            studentId: student._id,
            name: student.name,
            grade: student.grade,
            rollNo: (student.result === 1000 || student.result === undefined || student.result === null) ? '' : student.result,
            path: relativePath
          });
        } catch (err) {
          failedFiles.push({
            studentId: student._id,
            name: student.name,
            grade: student.grade,
            error: err.message
          });
        }
      });
      await Promise.all(promises);
    }
    
    res.status(200).json({
      success: true,
      message: `ID card generation completed. Generated ${generatedFiles.length} files successfully, failed ${failedFiles.length} files.`,
      count: generatedFiles.length,
      failedCount: failedFiles.length,
      files: generatedFiles,
      failures: failedFiles
    });
    
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = generateStudentIdCards;
