


import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  // Editable site colors
  const [primaryBg, setPrimaryBg] = useState('#0A0A0A');
  const [accentColor, setAccentColor] = useState('#FFC300');
  const [homepageText, setHomepageText] = useState('Welcome to the site!');
  const [artistImages, setArtistImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch settings from backend
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setPrimaryBg(data.primaryBg || '#0A0A0A');
        setAccentColor(data.accentColor || '#FFC300');
        setHomepageText(data.homepageText || 'Welcome to the site!');
        setArtistImages(data.artistImages || []);
      });
  }, []);

  // Save settings to backend
  const saveSettings = async () => {
    setLoading(true);
    await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryBg, accentColor, homepageText, artistImages }),
    });
    setLoading(false);
    alert('Settings saved!');
  };

  // Upload artist image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('image', imageFile);
    setLoading(true);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.url) {
      setArtistImages([...artistImages, data.url]);
      setImageFile(null);
      await saveSettings();
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: 'Montserrat, Open Sans, sans-serif',
        background: primaryBg,
        minHeight: '100vh',
        color: '#F8F8F8',
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header style={{ marginBottom: '2em', textAlign: 'center', width: '100%' }}>
        <h2 style={{ color: accentColor, fontSize: '2em', marginBottom: 8 }}>Admin Dashboard</h2>
        <p style={{ fontSize: '1em', color: '#BBBBBB' }}>
          Edit your site colors, homepage text, and artist images below. Changes are instant!
        </p>
      </header>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          width: '100%',
          maxWidth: 900,
          justifyContent: 'center',
        }}
      >
        <section
          style={{
            flex: 1,
            minWidth: 280,
            maxWidth: 400,
            background: '#1A1A1A',
            borderRadius: 10,
            padding: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            marginBottom: 20,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Primary Background Color</label>
            <input
              type="color"
              value={primaryBg}
              onChange={e => setPrimaryBg(e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 5 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Accent Color</label>
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 5 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Homepage Text</label>
            <textarea
              value={homepageText}
              onChange={e => setHomepageText(e.target.value)}
              style={{ width: '100%', minHeight: 60, borderRadius: 5, border: `1px solid ${accentColor}`, padding: 8, fontSize: '1em' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <form onSubmit={handleImageUpload}>
              <label style={{ display: 'block', marginBottom: 8 }}>Add Artist Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ marginBottom: 10 }} />
              <button type="submit" disabled={loading || !imageFile} style={{ padding: '8px 16px', borderRadius: 5, background: accentColor, color: primaryBg, border: 'none', fontWeight: 600 }}>
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          </div>
          <div style={{ marginBottom: 20 }}>
            <button onClick={saveSettings} disabled={loading} style={{ padding: '10px 20px', borderRadius: 5, background: accentColor, color: primaryBg, border: 'none', fontWeight: 600 }}>
              {loading ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </section>
        <section
          style={{
            flex: 1,
            minWidth: 280,
            maxWidth: 400,
            marginBottom: 20,
            alignSelf: 'flex-start',
          }}
        >
          <h3 style={{ color: accentColor, textAlign: 'center' }}>Live Preview</h3>
          <div
            style={{
              background: primaryBg,
              color: '#F8F8F8',
              borderRadius: 10,
              padding: 20,
              margin: '0 auto',
              maxWidth: 400,
              border: `2px solid ${accentColor}`,
              textAlign: 'center',
            }}
          >
            <h1 style={{ color: accentColor }}>{homepageText}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 20 }}>
              {artistImages.map((img, idx) => (
                <img key={idx} src={`http://localhost:5000${img}`} alt={`Artist ${idx + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: `2px solid ${accentColor}` }} />
              ))}
            </div>
          </div>
        </section>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .admin-flex {
            flex-direction: column !important;
            gap: 0 !important;
          }
        }
        @media (max-width: 600px) {
          section {
            max-width: 100% !important;
            min-width: 0 !important;
            padding: 10px !important;
          }
          header {
            font-size: 1.2em !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
