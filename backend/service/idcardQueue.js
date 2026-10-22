require('dotenv').config();

const path = require('path');
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const XLSX = require('xlsx');
const connectDB = require('../config/db');
const IdcardBatch = require('../model/IdCard/IdcardBatch');
const IdcardData = require('../model/IdCard/IdcardData');
const IdcardTemplate = require('../model/IdCard/IdcardTemplate');
const { createIdcardPdf } = require('../helper/idcardPdf');

const requiredRedisConfig = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'];
const missingRedisConfig = requiredRedisConfig.filter(key => !process.env[key]);
if (missingRedisConfig.length) {
  throw new Error(`Missing Redis configuration: ${missingRedisConfig.join(', ')}`);
}

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

connection.on('error', error => console.error('ID card queue Redis error:', error));
const idcardQueue = new Queue('idcard-generation', { connection });

const aliases = { name: 'name', 'student name': 'name', student: 'name', class: 'className', 'class name': 'className', pen: 'penNo', 'pen no': 'penNo', roll: 'rollNo', 'roll no': 'rollNo', father: 'fatherName', 'father name': 'fatherName', mother: 'motherName', 'mother name': 'motherName', dob: 'dob', 'date of birth': 'dob', contact: 'contact', phone: 'contact', address: 'address', photo: 'photo', 'photo url': 'photo', image: 'photo', 'image url': 'photo', 'id card image': 'photo' };
const imageUrl = value => {
  const url = String(value || '').trim();
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i) || url.match(/[?&]id=([^&]+)/i);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
};

function normalizeRows(rows) {
  return rows.map(row => Object.entries(row).reduce((data, [key, value]) => {
    const normalized = String(key).trim().toLowerCase().replace(/[_-]+/g, ' ');
    const field = aliases[normalized] || key;
    data[field] = field === 'photo' ? imageUrl(value) : value == null ? '' : String(value);
    return data;
  }, {})).filter(row => Object.values(row).some(Boolean));
}

function startIdcardWorker() {
  return new Worker('idcard-generation', async job => {
    const { batchId } = job.data;
    const batch = await IdcardBatch.findById(batchId);
    if (!batch) return;
    if (job.name === 'idCardStore') {
      await IdcardBatch.findByIdAndUpdate(batchId, { status: 'processing' });
      const rows = await IdcardData.find({ batch: batchId, generationStatus: 'pending' }).select('_id').lean();
      const runId = job.data.runId || job.id;
      await idcardQueue.addBulk(rows.map(row => ({ name: 'row-pdf', data: { batchId, rowId: row._id.toString() }, opts: { jobId: `row-${row._id}-${runId}`, attempts: 3, backoff: { type: 'exponential', delay: 3000 }, removeOnComplete: 1000, removeOnFail: 1000 } })));
      await idcardQueue.add('final-pdf', { batchId }, { delay: 5000, attempts: 20, backoff: { type: 'fixed', delay: 5000 }, jobId: `final-${batchId}-${runId}`, removeOnComplete: 100 });
      return;
    }
    if (job.name === 'row-pdf') {
      const row = await IdcardData.findOneAndUpdate({ _id: job.data.rowId, generationStatus: { $in: ['pending', 'processing'] } }, { generationStatus: 'processing', $inc: { generationAttempts: 1 } }, { new: true });
      if (!row) return;
      try {
        const template = await IdcardTemplate.findById(batch.template).lean();
        const outputPath = path.join(__dirname, '..', 'public', 'idcards', `${batchId}-${row._id}.pdf`);
        await createIdcardPdf({ batchId, rows: [row], template, outputPath });
        await IdcardData.findByIdAndUpdate(row._id, { generationStatus: 'generated', generatedAt: new Date(), pdfPath: `/idcards/${batchId}-${row._id}.pdf` });
        await IdcardBatch.findByIdAndUpdate(batchId, { $inc: { generated: 1 } });
      } catch (error) {
        const current = await IdcardData.findById(row._id).select('generationAttempts').lean();
        await IdcardData.findByIdAndUpdate(row._id, { generationStatus: current?.generationAttempts >= 3 ? 'failed' : 'pending', error: error.message });
        throw error;
      }
      return;
    }
    if (job.name === 'final-pdf') {
      const pending = await IdcardData.countDocuments({ batch: batchId, generationStatus: { $in: ['pending', 'processing'] } });
      if (pending) throw new Error(`Waiting for ${pending} ID cards`);
      const failed = await IdcardData.countDocuments({ batch: batchId, generationStatus: 'failed' });
      const rows = await IdcardData.find({ batch: batchId, generationStatus: 'generated' }).sort({ rowNumber: 1 }).lean();
      const template = await IdcardTemplate.findById(batch.template).lean();
      const outputPath = path.join(__dirname, '..', 'public', 'idcards', `${batchId}.pdf`);
      await createIdcardPdf({ batchId, rows, template, outputPath });
      await IdcardBatch.findByIdAndUpdate(batchId, { status: failed ? 'failed' : 'completed', failed, pdfPath: `/idcards/${batchId}.pdf`, error: failed ? `${failed} rows failed` : undefined });
    }
  }, { connection, concurrency: 2 });
}

if (require.main === module) {
  connectDB().then(() => {
    const worker = startIdcardWorker();
    worker.on('failed', (job, error) => console.error(`ID card job ${job?.id} failed:`, error.message));
    console.log('ID card worker is ready');
  }).catch(error => {
    console.error('ID card worker database startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { idcardQueue, normalizeRows };