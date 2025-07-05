import { useState } from 'react';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [poem, setPoem] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPoem('');
    setError('');

    const formData = new FormData(event.target);
    const data = {
      topic: formData.get('topic'),
      type: formData.get('type'),
      lang: formData.get('lang'),
      length: formData.get('length'),
    };

    try {
      // Alamat API tetap sama
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal membuat puisi.');
      setPoem(result.poem);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Generator Puisi (Pages Router)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="topic">Topik Puisi:</label><br />
          <input type="text" id="topic" name="topic" defaultValue="senja di pelabuhan" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <br />
        <div>
          <label htmlFor="type">Jenis:</label><br />
          <select id="type" name="type" style={{ padding: '8px' }}>
            <option value="Free Verse">Free Verse</option>
            <option value="Sonnet">Sonnet</option>
            <option value="Haiku">Haiku</option>
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="lang">Bahasa:</label><br />
          <select id="lang" name="lang" style={{ padding: '8px' }}>
            <option value="Indonesian">Indonesia</option>
            <option value="English">Inggris</option>
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="length">Panjang:</label><br />
          <select id="length" name="length" style={{ padding: '8px' }}>
            <option value="short">Pendek</option>
            <option value="medium">Sedang</option>
            <option value="long">Panjang</option>
          </select>
        </div>
        <br />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Membuat...' : 'Buat Puisi'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '20px' }}><p><b>Error:</b> {error}</p></div>}
      {poem && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '15px', border: '1px solid #ddd' }}>
          <h3>Hasil Puisi:</h3>
          <p>{poem}</p>
        </div>
      )}
    </main>
  );
    }
