const userModel = require('../../model/User/UserModel');
const { BeezSyllabus, AnkurSyllabus, KisholoySyllabus, C1Syllabus, C2Syllabus, C3Syllabus, C4Syllabus } = require('./../../helper/Class');

const userChangeClass = async (req, res) => {
    try {
        const class4Student = await userModel.find({ grade: '4' });
        const updates1 = class4Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '5',
                    subjects: BeezSyllabus
                }
            }
        }));

        const class3Student = await userModel.find({ grade: '3' });
        const updates2 = class3Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '4',
                    subjects: C4Syllabus
                }
            }
        }));

        const class2Student = await userModel.find({ grade: '2' });
        const updates3 = class2Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '3',
                    subjects: C3Syllabus
                }
            }
        }));

        const class1Student = await userModel.find({ grade: '1' });
        const updates4 = class1Student.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '2',
                    subjects: C2Syllabus
                }
            }
        }));

        const kisholoyStudent = await userModel.find({ grade: 'kisholoy' });
        const updates5 = kisholoyStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: '1',
                    subjects: C1Syllabus
                }
            }
        }));

        const ankurStudent = await userModel.find({ grade: 'ankur' });
        const updates6 = ankurStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: 'kisholoy',
                    subjects: KisholoySyllabus
                }
            }
        }));

        const beezStudent = await userModel.find({ grade: 'beez' });
        const updates7 = beezStudent.map(student => ({
            updateOne: {
                filter: { _id: student._id },
                update: {
                    grade: 'ankur',
                    subjects: AnkurSyllabus
                }
            }
        }));

        const result = await userModel.bulkWrite([
            ...updates1,
            ...updates2,
            ...updates3,
            ...updates4,
            ...updates5,
            ...updates6,
            ...updates7
        ]);

        res.status(200).json({
            message: "Students updated successfully",
            updatedCount: result.modifiedCount,
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = userChangeClass;
