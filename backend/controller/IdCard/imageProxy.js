const axios = require('axios');

const allowedHosts = ['drive.google.com', 'drive.usercontent.google.com', 'googleusercontent.com'];

module.exports = async function imageProxy(req, res) {
  try {
    const source = new URL(req.query.url);
    const allowed = ['http:', 'https:'].includes(source.protocol) && allowedHosts.some(host => source.hostname === host || source.hostname.endsWith(`.${host}`));
    if (!allowed) return res.status(400).json({ success: false, message: 'Unsupported image host' });
    const response = await axios.get(source.toString(), {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxContentLength: 10 * 1024 * 1024,
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 400,
    });
    const contentType = response.headers['content-type'] || '';
    if (!contentType.toLowerCase().startsWith('image/')) return res.status(422).json({ success: false, message: 'Drive did not return an image. Check that the file is shared publicly.' });
    res.set({ 'Content-Type': contentType, 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
    res.send(Buffer.from(response.data));
  } catch (error) {
    res.status(502).json({ success: false, message: 'Unable to fetch image' });
  }
};