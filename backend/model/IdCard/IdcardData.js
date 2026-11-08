const mongoose = require('mongoose');

const IdcardDataSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'IdcardBatch', required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rowNumber: { type: Number, required: true },
  name: String, className: String, penNo: String, rollNo: String,
  fatherName: String, motherName: String, dob: String, contact: String, address: String,
  photo: String,
  isUpdated: { type: Boolean, default: true },
  generationStatus: { type: String, enum: ['pending', 'processing', 'generated', 'failed'], default: 'pending' },
  generationAttempts: { type: Number, default: 0 },
  generatedAt: Date,
  error: String,
  pdfPath: String,
}, { timestamps: true });

IdcardDataSchema.index({ batch: 1, rowNumber: 1 }, { unique: true });
module.exports = mongoose.model('IdcardData', IdcardDataSchema);