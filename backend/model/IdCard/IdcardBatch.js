const mongoose = require('mongoose');

const IdcardBatchSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'IdcardTemplate', required: true },
  status: { type: String, enum: ['queued', 'processing', 'completed', 'failed'], default: 'queued' },
  total: { type: Number, default: 0 },
  generated: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  pdfPath: String,
  error: String,
}, { timestamps: true });

module.exports = mongoose.model('IdcardBatch', IdcardBatchSchema);