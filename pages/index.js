import { useState } from 'react';

function CustomAlert({ message, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      border: '1px solid #0070f3',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 1000,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}>
      <p>{message}</p>
      <button onClick={onClose} style={{
        padding: '10px 20px',
        borderRadius: '4px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
      }}>
        Tutup
      </button>
    </div>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [poem, setPoem] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(poem);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px', position: 'relative', backgroundColor: '#e0e7ff' }}>
      <img 
        src="https://ar-hosting.pages.dev/1751679958097.jpg" 
        alt="Logo" 
        style={{ position: 'absolute', top: '20px', left: '10px', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #0070f3' }} 
      />
      <h1 style={{ textAlign: 'center', color: '#003366' }}>Generator Puisi (Pages Router)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="topic">Topik Puisi:</label><br />
          <input type="text" id="topic" name="topic" defaultValue="senja di pelabuhan" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #0070f3' }} />
        </div>
        <br />
        <div>
          <label htmlFor="type">Jenis:</label><br />
          <select id="type" name="type" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #0070f3' }}>
            <option value="Free Verse">Free Verse</option>
            <option value="Sonnet">Sonnet</option>
            <option value="Haiku">Haiku</option>
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="lang">Bahasa:</label><br />
          <select id="lang" name="lang" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #0070f3' }}>
            <option value="Indonesian">Indonesia</option>
            <option value="English">Inggris</option>
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="length">Panjang:</label><br />
          <select id="length" name="length" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #0070f3' }}>
            <option value="short">Pendek</option>
            <option value="medium">Sedang</option>
            <option value="long">Panjang</option>
          </select>
        </div>
        <br />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
          {loading ? 'Membuat...' : 'Buat Puisi'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '20px' }}><p><b>Error:</b> {error}</p></div>}
      {poem && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: '#f0f4ff', padding: '15px', border: '1px solid #0070f3', borderRadius: '4px' }}>
          <h3 style={{ color: '#003366' }}>Hasil Puisi:</h3>
          <p>{poem}</p>
          <button onClick={copyToClipboard} style={{ marginTop: '10px', padding: '10px', borderRadius: '4px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>
            Salin Puisi
          </button>
        </div>
      )}

      {showAlert && <CustomAlert message="Puisi telah disalin ke clipboard!" onClose={closeAlert} />}

      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#555', fontFamily: 'Courier New, monospace' }}>
        <p>Credit: Vercel Team</p>
        <p>Today is Saturday, July 5, 2025</p>
      </footer>
    </main>
  );
        }
        
