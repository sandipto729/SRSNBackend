const XLSX = require('xlsx');
const IdcardTemplate = require('../../model/IdCard/IdcardTemplate');
const IdcardData = require('../../model/IdCard/IdcardData');
const IdcardBatch = require('../../model/IdCard/IdcardBatch');
const { idcardQueue, normalizeRows } = require('../../service/idcardQueue');
const fs = require('fs');
const path = require('path');

const templateFields = ['name', 'session', 'schoolName', 'section', 'templateClassName', 'classPrefix', 'footerLabel', 'footerText', 'headLabel', 'primaryColor', 'secondaryColor', 'footerColor', 'accentColor'];

function templateDisplayName(values) {
  const className = values.templateClassName ? ` (${values.templateClassName})` : '';
  return `${values.section || 'ID card'} ${values.session || ''}${className}`.trim();
}

async function saveTemplate(req, res) {
  try {
    const values = Object.fromEntries(templateFields.filter(field => req.body[field] !== undefined).map(field => [field, req.body[field]]));
    const template = await IdcardTemplate.create({ ...values, owner: req.user._id, name: values.name || templateDisplayName(values) });
    res.status(201).json({ success: true, template });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
}

async function deleteTemplate(req, res) {
  try {
    const activeBatch = await IdcardBatch.exists({ template: req.params.templateId, owner: req.user._id, status: { $in: ['queued', 'processing'] } });
    if (activeBatch) return res.status(409).json({ success: false, message: 'This template is being used by an active generation batch.' });
    const deleted = await IdcardTemplate.findOneAndDelete({ _id: req.params.templateId, owner: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, templateId: req.params.templateId });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
}

async function listTemplates(req, res) {
  const templates = await IdcardTemplate.find({ owner: req.user._id }).sort({ updatedAt: -1 }).lean();
  res.json({ success: true, templates });
}

async function uploadWorkbook(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Excel file is required' });
    if (!req.body.templateId) return res.status(400).json({ success: false, message: 'templateId is required' });
    const template = await IdcardTemplate.findOne({ _id: req.body.templateId, owner: req.user._id });
    if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const rows = normalizeRows(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' }));
    if (!rows.length) return res.status(400).json({ success: false, message: 'No student records found' });
    const batch = await IdcardBatch.create({ owner: req.user._id, template: template._id, total: rows.length });
    await IdcardData.insertMany(rows.map((row, index) => ({ ...row, batch: batch._id, owner: req.user._id, rowNumber: index + 2, isUpdated: true })));
    await idcardQueue.add('idCardStore', { batchId: batch._id.toString() }, { jobId: `store-${batch._id}`, attempts: 20, backoff: { type: 'exponential', delay: 3000 }, removeOnComplete: 100 });
    res.status(202).json({ success: true, batchId: batch._id, total: rows.length, status: 'queued' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
}

async function batchStatus(req, res) {
  const batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id }).lean();
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  res.json({ success: true, batch });
}

async function batchDetail(req, res) {
  const batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id })
    .populate('template')
    .lean();
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  const students = await IdcardData.find({ batch: batch._id })
    .select('-owner -batch -__v')
    .sort({ rowNumber: 1 })
    .lean();
  res.json({ success: true, batch, template: batch.template, students });
}

async function listBatches(req, res) {
  const batches = await IdcardBatch.find({ owner: req.user._id })
    .populate('template', 'name section session templateClassName')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({ success: true, batches });
}

async function regenerateBatch(req, res) {
  try {
    const batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    if (['queued', 'processing'].includes(batch.status)) return res.status(409).json({ success: false, message: 'This batch is already generating.' });
    const rows = await IdcardData.find({ batch: batch._id }).select('_id').lean();
    if (!rows.length) return res.status(400).json({ success: false, message: 'No stored student data exists for this batch.' });
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await IdcardData.updateMany({ batch: batch._id }, { $set: { generationStatus: 'pending', generationAttempts: 0, generatedAt: null, error: null, pdfPath: null } });
    await IdcardBatch.findByIdAndUpdate(batch._id, { status: 'queued', generated: 0, failed: 0, pdfPath: null, error: null });
    const oldPdf = path.join(__dirname, '..', '..', 'public', 'idcards', `${batch._id}.pdf`);
    if (fs.existsSync(oldPdf)) fs.unlinkSync(oldPdf);
    await idcardQueue.add('idCardStore', { batchId: batch._id.toString(), runId }, { jobId: `store-${batch._id}-${runId}`, attempts: 20, backoff: { type: 'exponential', delay: 3000 }, removeOnComplete: 100 });
    res.status(202).json({ success: true, batchId: batch._id, total: rows.length, status: 'queued' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
}

module.exports = { saveTemplate, listTemplates, deleteTemplate, uploadWorkbook, batchStatus, batchDetail, listBatches, regenerateBatch };