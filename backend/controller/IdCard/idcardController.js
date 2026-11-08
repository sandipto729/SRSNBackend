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

async function checkAndAutoFinalizeBatch(batchId, ownerId) {
  try {
    const batch = await IdcardBatch.findOne({ _id: batchId, owner: ownerId });
    if (!batch || batch.status === 'completed') return batch;
    const pending = await IdcardData.countDocuments({ batch: batchId, generationStatus: { $in: ['pending', 'processing'] } });
    if (pending === 0 && batch.total > 0) {
      const generated = await IdcardData.countDocuments({ batch: batchId, generationStatus: 'generated' });
      const failed = await IdcardData.countDocuments({ batch: batchId, generationStatus: 'failed' });
      if (generated + failed >= batch.total) {
        const rows = await IdcardData.find({ batch: batchId, generationStatus: 'generated' }).sort({ rowNumber: 1 }).lean();
        const template = await IdcardTemplate.findById(batch.template).lean();
        const outputPath = path.join(__dirname, '..', '..', 'public', 'idcards', `${batchId}.pdf`);
        const { createIdcardPdf } = require('../../helper/idcardPdf');
        await createIdcardPdf({ batchId, rows, template, outputPath });
        batch.status = failed ? 'failed' : 'completed';
        batch.generated = generated;
        batch.failed = failed;
        batch.pdfPath = `/idcards/${batchId}.pdf`;
        await batch.save();
      }
    }
    return batch;
  } catch (err) {
    console.warn('Auto-finalize batch error:', err.message);
  }
}

async function batchStatus(req, res) {
  let batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id }).lean();
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  if (batch.status === 'processing' && batch.generated >= batch.total && batch.total > 0) {
    const healed = await checkAndAutoFinalizeBatch(batch._id, req.user._id);
    if (healed) batch = healed.toObject ? healed.toObject() : healed;
  }
  res.json({ success: true, batch });
}

async function batchDetail(req, res) {
  let batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id })
    .populate('template')
    .lean();
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  if (batch.status === 'processing' && batch.generated >= batch.total && batch.total > 0) {
    const healed = await checkAndAutoFinalizeBatch(batch._id, req.user._id);
    if (healed) batch = await IdcardBatch.findOne({ _id: req.params.batchId, owner: req.user._id }).populate('template').lean();
  }
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

async function verifyStudent(req, res) {
  try {
    const rawId = (req.params.identifier || req.query.id || req.query.pen || '').trim();
    if (!rawId) {
      return res.status(400).json({ success: false, message: 'Student PEN Number or Verification ID is required.' });
    }

    const mongoose = require('mongoose');
    let query;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      query = { _id: rawId };
    } else {
      const escaped = rawId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = { penNo: { $regex: new RegExp(`^${escaped}$`, 'i') } };
    }

    const record = await IdcardData.findOne(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'batch',
        populate: { path: 'template' }
      })
      .lean();

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No verified ID card record found for "${rawId}". Please verify the PEN Number or contact school administration.`
      });
    }

    const template = record.batch?.template || {};

    return res.json({
      success: true,
      verified: true,
      verifiedBy: 'srsnrng.in',
      verifiedAt: record.generatedAt || record.createdAt,
      student: {
        id: record._id,
        name: record.name || 'Student',
        className: record.className || '',
        penNo: record.penNo || '',
        rollNo: record.rollNo || '',
        fatherName: record.fatherName || '',
        motherName: record.motherName || '',
        dob: record.dob || '',
        contact: record.contact || '',
        address: record.address || '',
        photo: record.photo || '',
        session: template.session || '',
        section: template.section || '',
        schoolName: template.schoolName || 'Sri Ramakrishna Siksha Niketan',
        classPrefix: template.classPrefix || 'CLASS -',
        headLabel: template.headLabel || 'Head Master',
        footerText: template.footerText || 'Please carry this card whenever you visit the School.',
        generatedAt: record.generatedAt || record.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { saveTemplate, listTemplates, deleteTemplate, uploadWorkbook, batchStatus, batchDetail, listBatches, regenerateBatch, verifyStudent };