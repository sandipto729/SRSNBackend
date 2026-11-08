const mongoose = require('mongoose');

const IdcardTemplateSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  session: { type: String, required: true },
  schoolName: { type: String, required: true },
  section: { type: String, required: true },
  templateClassName: { type: String, default: '' },
  classPrefix: { type: String, default: 'CLASS -' },
  footerLabel: { type: String, default: 'INSTRUCTIONS' },
  footerText: { type: String, default: 'Please carry this card whenever you visit the School.' },
  headLabel: { type: String, default: 'Head Master' },
  primaryColor: { type: String, default: '#0a5c4b' },
  secondaryColor: { type: String, default: '#47a183' },
  footerColor: { type: String, default: '#0a5c4b' },
  accentColor: { type: String, default: '#f26b21' },
  version: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('IdcardTemplate', IdcardTemplateSchema);