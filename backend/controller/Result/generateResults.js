const User = require("../../model/User/UserModel");
const Alumni = require("../../model/User/Alumni");
const StudentAcademic = require("../../model/User/UserAcademics");

async function generateAcademicRecords(academicYear) {
  const students = await User.find({ role: "Student" });

  let alumniCreated = 0;
  let academicCreated = 0;

  for (const student of students) {
    // 1️⃣ Check Alumni existence
    let alumni = await Alumni.findOne({ email: student.email });

    if (!alumni) {
      alumni = await Alumni.create({
        userId: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        profilePic: student.profilePic,
        fatherName: student.fatherName,
        motherName: student.motherName
      });
      alumniCreated++;
    }

    // 2️⃣ Semesters to traverse
    const semesters = ["firstSem", "secondSem", "endSem"];

    for (const sem of semesters) {
      const semData = student[sem];

      if (!semData || Object.keys(semData).length === 0) continue;

      // Prevent duplicate academic records
      const exists = await StudentAcademic.findOne({
        alumniId: alumni._id,
        academicYear,
        class: student.grade,
        semester: sem
      });

      if (exists) continue;

      // Convert marks object → array
      const subjects = Object.entries(semData).map(
        ([subjectName, marks]) => ({
          subjectName,
          marksObtained: Number(marks)
        })
      );

      await StudentAcademic.create({
        alumniId: alumni._id,
        class: student.grade,
        academicYear,
        semester: sem,
        subjects
      });

      academicCreated++;
    }
  }

  return {
    message: "Academic records generated successfully",
    academicYear,
    alumniCreated,
    academicCreated
  };
}

module.exports = { generateAcademicRecords };
