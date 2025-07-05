// File: pages/api/generate-poem.js

import axios from 'axios';

// Fungsi scraper inti, tidak perlu diubah
async function buatPuisi(options) {
  try {
    const url = 'https://aipoemgenerator.io';
    // 1. Ambil token & cookie
    const getRes = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const tokenMatch = getRes.data.match(/<meta name="_token" content="(.*?)"/);
    if (!tokenMatch) throw new Error('Token tidak ditemukan.');
    const token = tokenMatch[1];
    const cookies = getRes.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');

    // 2. Kirim form untuk generate puisi
    const form = new URLSearchParams();
    form.append('topic', options.topic);
    form.append('length', options.length);
    form.append('type', options.type);
    form.append('lang', options.lang);
    form.append('poemVersion', '1');
    form.append('_token', token);

    const postRes = await axios.post(`${url}/generate_poem`, form.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'Referer': url + '/',
        'Origin': url,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!postRes.data) throw new Error('Tidak ada respons puisi.');
    return { status: 'success', data: postRes.data.trim() };
  } catch (e) {
    console.error(e);
    return { status: 'error', message: e.message };
  }
}

// Handler API untuk Pages Router
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { topic, type, lang, length } = req.body; // Ambil data dari req.body

    if (!topic) {
      return res.status(400).json({ error: 'Topik tidak boleh kosong' });
    }

    const result = await buatPuisi({ topic, type, lang, length });

    if (result.status === 'success') {
      // Kirim respons sukses
      res.status(200).json({ poem: result.data });
    } else {
      // Kirim respons error
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Kesalahan server internal' });
  }
}
