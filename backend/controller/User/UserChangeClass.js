const userModel = require('../../model/User/UserModel');
const { BeezSyllabus, AnkurSyllabus, KisholoySyllabus, C1Syllabus, C2Syllabus, C3Syllabus, C4Syllabus, C5Syllabus, C6Syllabus, C7Syllabus, C8Syllabus } = require('./../../helper/Class');

const userChangeClass = async (req, res) => {
    try {
        // Delete all class 8 students first
        const class8Student = await userModel.find({ grade: '8' });
        const deleteClass8Students = class8Student.map(student => ({
            deleteOne: { filter: { _id: student._id } }
        }));

        // Update class 7 students to class 8
        const class7Student = await userModel.find({ grade: '7' });
        const updates2 = class7Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '8',
                    firstSem: C8Syllabus,
                    secondSem: C8Syllabus,
                    endSem: C8Syllabus
                }
            }
        }));

        // Update class 6 students to class 7
        const class6Student = await userModel.find({ grade: '6' });
        const updates3 = class6Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '7',
                    firstSem: C7Syllabus,
                    secondSem: C7Syllabus,
                    endSem: C7Syllabus
                }
            }
        }));

        // Update class 5 students to class 6
        const class5Student = await userModel.find({ grade: '5' });
        const updates4 = class5Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '6',
                    firstSem: C6Syllabus,
                    secondSem: C6Syllabus,
                    endSem: C6Syllabus
                }
            }
        }));

        // Update class 4 students to class 5
        const class4Student = await userModel.find({ grade: '4' });
        const updates5 = class4Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '5',
                    firstSem: C5Syllabus,
                    secondSem: C5Syllabus,
                    endSem: C5Syllabus
                }
            }
        }));

        // Update class 3 students to class 4
        const class3Student = await userModel.find({ grade: '3' });
        const updates6 = class3Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '4',
                    firstSem: C4Syllabus,
                    secondSem: C4Syllabus,
                    endSem: C4Syllabus
                }
            }
        }));

        // Update class 2 students to class 3
        const class2Student = await userModel.find({ grade: '2' });
        const updates7 = class2Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '3',
                    firstSem: C3Syllabus,
                    secondSem: C3Syllabus,
                    endSem: C3Syllabus
                }
            }
        }));

        // Update class 1 students to class 2
        const class1Student = await userModel.find({ grade: '1' });
        const updates8 = class1Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '2',
                    firstSem: C2Syllabus,
                    secondSem: C2Syllabus,
                    endSem: C2Syllabus
                }
            }
        }));

        // Update Kisholoy students to class 1
        const kisholoyStudent = await userModel.find({ grade: 'kisholoy' });
        const updates9 = kisholoyStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '1',
                    firstSem: C1Syllabus,
                    secondSem: C1Syllabus,
                    endSem: C1Syllabus
                }
            }
        }));

        // Update Ankur students to Kisholoy
        const ankurStudent = await userModel.find({ grade: 'ankur' });
        const updates10 = ankurStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: 'kisholoy',
                    firstSem: KisholoySyllabus,
                    secondSem: KisholoySyllabus,
                    endSem: KisholoySyllabus
                }
            }
        }));

        // Update Beez students to Ankur
        const beezStudent = await userModel.find({ grade: 'beez' });
        const updates11 = beezStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: 'ankur',
                    firstSem: AnkurSyllabus,
                    secondSem: AnkurSyllabus,
                    endSem: AnkurSyllabus
                }
            }
        }));

        // Perform bulk write operation
        const result = await userModel.bulkWrite([
            ...deleteClass8Students,
            ...updates2,
            ...updates3,
            ...updates4,
            ...updates5,
            ...updates6,
            ...updates7,
            ...updates8,
            ...updates9,
            ...updates10,
            ...updates11
        ]);

        res.status(200).json({
            message: "Students updated successfully",
            updatedCount: result.modifiedCount,
            success: true
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = userChangeClass;
