const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const U = 0.5;
const safe = value => String(value || '');
const asset = name => path.join(__dirname, '..', 'public', 'idcards', name);

async function drawQrCode(doc, value, x, y, size) {
  const qrBuffer = await QRCode.toBuffer(value, { width: Math.round(size * 4), margin: 1, color: { dark: '#16252a', light: '#ffffff' } });
  doc.save().rect(x, y, size, size).fill('#fff').restore();
  doc.image(qrBuffer, x, y, { width: size, height: size });
}

const C128 = '11011001100,11001101100,11001100110,10010011000,10010001100,10001001100,10011001000,10011000100,10001100100,11001001000,11001000100,11000100100,10110011100,10011011100,10011001110,10111001100,10011101100,10011100110,11001110010,11001011100,11001001110,11011100100,11001110100,11101101110,11101001100,11100101100,11100100110,11101100100,11100110100,11100110010,11011011000,11011000110,11000110110,10100011000,10001011000,10001000110,10110001000,10001101000,10001100010,11010001000,11000101000,11000100010,10110111000,10110001110,10001101110,10111011000,10111000110,10001110110,11101110110,11010001110,11000101110,11011101000,11011100010,11011101110,11101011000,11101000110,11100010110,11101101000,11101100010,11100011010,11101111010,11001000010,11110001010,10100110000,10100001100,10010110000,10010000110,10000101100,10000100110,10110010000,10110000100,10011010000,10011000010,10000110100,10000110010,11000010010,11001010000,11110111010,11000010100,10001111010,10100111100,10010111100,10010011110,10111100100,10011110100,10011110010,11110100100,11110010100,11110010010,11011011110,11011110110,11110110110,10101111000,10100011110,10001011110,10111101000,10111100010,11110101000,11110100010,10111011110,10111101110,11101011110,11110101110,11010000100,11010010000,11010011100'.split(',');

function barcodeBits(value) {
  const chars = [...safe(value)].filter(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126);
  if (!chars.length) return '';
  const values = [104]; let sum = 104;
  chars.forEach((char, index) => { const code = char.charCodeAt(0) - 32; values.push(code); sum += code * (index + 1); });
  values.push(sum % 103);
  return values.map(value => C128[value]).join('') + '1100011101011';
}

function drawBarcode(doc, value) {
  const bits = barcodeBits(value); if (!bits) return;
  const x = 40 * U; const y = 1017 * U; const width = 205 * U; const height = 56 * U; const module = width / (bits.length + 16);
  // Pure white background for barcode to guarantee high scanner readability
  doc.save().rect(x, y, width, height).fill('#ffffff').restore();
  doc.save().rect(x, y, width, height).clip();
  for (let index = 0; index < bits.length; index += 1) if (bits[index] === '1') doc.rect(x + (index + 8) * module, y, module, height).fill('#111');
  doc.restore();
}

function cardText(doc, value, x, y, width, size, options = {}) {
  doc.font(options.font || 'Helvetica').fontSize(size * U).fillColor(options.color || '#1c2150').text(safe(value), x * U, y * U, { width: width * U, ...options });
}

async function drawCard(doc, row, template) {
  const primary = template.primaryColor || '#0a5c4b'; const secondary = template.secondaryColor || '#47a183'; const footer = template.footerColor || primary;
  doc.save().rect(0, 0, 840 * U, 1200 * U).clip().fill('#fff');
  // Draw school-bg with white overlay to avoid transparent PNG rendering as black in PDFKit
  doc.save().opacity(1).image(asset('school-bg.png'), 24 * U, 395 * U, { width: 1280 * U, height: 960 * U }).restore();
  doc.save().opacity(0.6).rect(24 * U, 395 * U, 1280 * U, 960 * U).fill('#fff').restore();
  doc.fillColor(primary).moveTo(0, 395 * U).lineTo(439 * U, 206 * U).lineTo(439 * U, 281 * U).lineTo(0, 470 * U).closePath().fill();
  doc.fillColor(secondary).moveTo(0, 470 * U).lineTo(439 * U, 281 * U).lineTo(439 * U, 401 * U).lineTo(0, 590 * U).closePath().fill();
  doc.image(asset('logo.png'), 42 * U, 26 * U, { width: 138 * U });
  cardText(doc, template.schoolName, 190, 18, 640, 72, { font: 'Helvetica-Bold', align: 'center' });
  cardText(doc, `SESSION\n${template.session}`, 50, 206, 155, 31, { font: 'Helvetica-Bold', align: 'center' });
  cardText(doc, template.section, 595, 204, 210, 40, { font: 'Helvetica-Bold', align: 'center' });
  doc.fillColor('#d9dde6').roundedRect(320 * U, 192 * U, 238 * U, 323 * U, 10 * U).fill();
  if (row.photo) {
    try {
      const response = await axios.get(row.photo, { responseType: 'arraybuffer', timeout: 10000 });
      const imgBuf = Buffer.from(response.data);
      // Stretch photo to completely fill box dimensions without letterbox gaps
      const boxW = 238 * U; const boxH = 323 * U; const boxX = 320 * U; const boxY = 192 * U;
      doc.save().roundedRect(boxX, boxY, boxW, boxH, 10 * U).clip();
      doc.image(imgBuf, boxX, boxY, { width: boxW, height: boxH });
      doc.restore();
    } catch (error) {
      console.warn(`Unable to load ID card photo for ${row._id}:`, error.message);
    }
  }
  cardText(doc, row.name, 0, 520, 880, 28, { font: 'Helvetica-Bold', align: 'center' });
  cardText(doc, 'IDENTITY CARD', 0, 560, 880, 66, { font: 'Helvetica-Bold', color: template.accentColor || '#f26b21', align: 'center' });
  doc.fillColor(primary).roundedRect(157 * U, 640 * U, 326 * U, 62 * U, 20 * U).fill();
  cardText(doc, `${template.classPrefix || 'CLASS -'} ${safe(row.className)}`, 181, 656, 278, 27, { font: 'Helvetica-Bold', color: '#fff', align: 'center' });
  const rows = [['PEN No', row.penNo], ['ROLL No', row.rollNo], ["FATHER'S NAME", row.fatherName], ["MOTHER'S NAME", row.motherName], ['DATE OF BIRTH', row.dob], ['CONTACT No', row.contact], ['ADDRESS', row.address]];
  rows.forEach(([label, value], index) => { const y = 707 + index * 41.5; cardText(doc, label, 256, y, 190, 22, { font: 'Helvetica-Bold' }); cardText(doc, `: ${value || ''}`, 270, y, 520, 22); });
  const frontendOrigin = (process.env.FRONTEND_URL || 'https://srsnrng.in').replace(/\/$/, '');
  await drawQrCode(doc, `${frontendOrigin}/verify-id/${String(row._id || row.penNo || '')}`, 40 * U, 992 * U, 88 * U);
  doc.image(asset('signature.png'), 740 * U, 981 * U, { width: 58 * U });
  doc.fillColor(secondary).rect(0, 1095 * U, 840 * U, 36 * U).fill();
  cardText(doc, template.footerLabel, 52, 1095, 300, 20, { color: '#111' });
  cardText(doc, template.headLabel, 590, 1095, 225, 26, { color: '#111', align: 'right' });
  doc.fillColor(footer).rect(0, 1131 * U, 840 * U, 69 * U).fill();
  cardText(doc, template.footerText, 52, 1151, 736, 25.5, { color: '#fff', align: 'center' });
  doc.restore();
}

function createIdcardPdf({ rows, template, outputPath }) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const doc = new PDFDocument({ size: [420, 600], margin: 0, autoFirstPage: false });
    const stream = fs.createWriteStream(outputPath); doc.pipe(stream);
    (async () => {
      for (const row of rows) { doc.addPage({ size: [420, 600], margin: 0 }); await drawCard(doc, row, template); }
      doc.end();
    })().catch(reject);
    stream.on('finish', () => resolve(outputPath)); stream.on('error', reject);
  });
}

module.exports = { createIdcardPdf };
