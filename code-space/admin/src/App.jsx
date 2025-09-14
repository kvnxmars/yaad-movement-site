
import React, { useState, useEffect } from 'react';
const API_URL = 'http://localhost:5000/api';

function App() {
  // Remove color editing
  const [homepageText, setHomepageText] = useState('Welcome to the site!');
  const [artistImages, setArtistImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // New: merch, events, members
  const [merch, setMerch] = useState([]);
  const [newMerch, setNewMerch] = useState({ name: '', price: '', image: null });
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '', image: null, type: 'future' });
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', description: '', image: null });

  // Fetch settings from backend
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
  // Remove color editing
        setHomepageText(data.homepageText || 'Welcome to the site!');
        setArtistImages(data.artistImages || []);
        setMerch(data.merch || []);
        setEvents(data.events || []);
        setMembers(data.members || []);
      });
  }, []);

  // Save settings to backend
  const publishSettings = async () => {
    setLoading(true);
    await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homepageText, artistImages, merch, events, members }),
    });
    setLoading(false);
    alert('Site updated and changes are live!');
  };

  // Upload image helper
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.url ? data.url : null;
  };

  // Upload artist image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setLoading(true);
    const url = await uploadImage(imageFile);
    if (url) {
      setArtistImages([...artistImages, url]);
      setImageFile(null);
  await publishSettings();
    }
    setLoading(false);
  };

  // Add merch item
  const handleAddMerch = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (newMerch.image) imageUrl = await uploadImage(newMerch.image);
    setMerch([...merch, { name: newMerch.name, price: newMerch.price, image: imageUrl }]);
    setNewMerch({ name: '', price: '', image: null });
  await publishSettings();
  };

  // Remove merch item
  const handleRemoveMerch = async (idx) => {
    setMerch(merch.filter((_, i) => i !== idx));
  await publishSettings();
  };

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (newEvent.image) imageUrl = await uploadImage(newEvent.image);
    setEvents([...events, { ...newEvent, image: imageUrl }]);
    setNewEvent({ title: '', date: '', description: '', image: null, type: 'future' });
  await publishSettings();
  };

  // Remove event
  const handleRemoveEvent = async (idx) => {
    setEvents(events.filter((_, i) => i !== idx));
  await publishSettings();
  };

  // Add member
  const handleAddMember = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (newMember.image) imageUrl = await uploadImage(newMember.image);
    setMembers([...members, { ...newMember, image: imageUrl }]);
    setNewMember({ name: '', role: '', description: '', image: null });
  await publishSettings();
  };

  // Remove member
  const handleRemoveMember = async (idx) => {
    setMembers(members.filter((_, i) => i !== idx));
    await publishSettings();
  };

  return (
    <div
      style={{
        fontFamily: 'Montserrat, Open Sans, sans-serif',
        background: '#0A0A0A',
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
        <h2 style={{ color: '#FFC300', fontSize: '2em', marginBottom: 8 }}>Admin Dashboard</h2>
        <p style={{ fontSize: '1em', color: '#BBBBBB' }}>
          Edit your homepage text, artist images, merch, events, and members below. Click 'Publish' to make changes live!
        </p>
        <button onClick={publishSettings} style={{ background: '#FFC300', color: '#0A0A0A', borderRadius: 5, padding: '10px 24px', border: 'none', fontWeight: 600, fontSize: '1.1em', marginTop: 16 }} disabled={loading}>Publish</button>
      </header>
      {/* Live Preview Section */}
      <section style={{ background: '#222', borderRadius: 10, padding: 20, marginBottom: 30, width: '100%', maxWidth: 900 }}>
        <h3 style={{ color: '#FFC300', marginBottom: 10 }}>Live Preview</h3>
        <div style={{ background: '#0A0A0A', borderRadius: 8, padding: 16 }}>
          <h1 style={{ color: '#FFC300' }}>{homepageText || 'Homepage Headline'}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            {artistImages.map((img, idx) => (
              <img key={idx} src={`http://localhost:5000${img}`} alt={`Artist ${idx + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid #FFC300' }} />
            ))}
          </div>
          <h2 style={{ color: '#FFC300', marginTop: 20 }}>Merch</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {merch.map((item, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 180, textAlign: 'center' }}>
                {item.image && <img src={`http://localhost:5000${item.image}`} alt={item.name} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 5 }} />}
                <h4>{item.name}</h4>
                <p>{item.price}</p>
              </div>
            ))}
          </div>
          <h2 style={{ color: '#FFC300', marginTop: 20 }}>Events</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {events.map((event, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 220, textAlign: 'center' }}>
                {event.image && <img src={`http://localhost:5000${event.image}`} alt={event.title} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 5 }} />}
                <h4>{event.title}</h4>
                <p>{event.date}</p>
                <p>{event.description}</p>
                <span style={{ color: event.type === 'future' ? '#FFC300' : '#BBBBBB' }}>{event.type === 'future' ? 'Future' : 'Past'}</span>
              </div>
            ))}
          </div>
          <h2 style={{ color: '#FFC300', marginTop: 20 }}>Members</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {members.map((member, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 180, textAlign: 'center' }}>
                {member.image && <img src={`http://localhost:5000${member.image}`} alt={member.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', border: '2px solid #FFC300' }} />}
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <p>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ color: '#FFC300', fontWeight: 600 }}>Loading...</span>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: 900 }}>
        {/* Site settings and artist images */}
        <section style={{ background: '#1A1A1A', borderRadius: 10, padding: 20, marginBottom: 30 }}>
          <h3 style={{ color: '#FFC300' }}>Artist Images</h3>
          <form onSubmit={handleImageUpload} style={{ marginBottom: 20 }}>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: '#FFC300', color: '#0A0A0A', borderRadius: 5, padding: '6px 12px', border: 'none' }} disabled={loading || !imageFile}>Upload</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {artistImages.map((img, idx) => (
              <img key={idx} src={`http://localhost:5000${img}`} alt={`Artist ${idx + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid #FFC300' }} />
            ))}
          </div>
        </section>
        <section style={{ background: '#1A1A1A', borderRadius: 10, padding: 20, marginBottom: 30 }}>
          <h3 style={{ color: '#FFC300' }}>Merch</h3>
          <form onSubmit={handleAddMerch} style={{ marginBottom: 20 }}>
            <input type="text" placeholder="Name" value={newMerch.name} onChange={e => setNewMerch({ ...newMerch, name: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="text" placeholder="Price" value={newMerch.price} onChange={e => setNewMerch({ ...newMerch, price: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="file" accept="image/*" onChange={e => setNewMerch({ ...newMerch, image: e.target.files[0] })} style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: '#FFC300', color: '#0A0A0A', borderRadius: 5, padding: '6px 12px', border: 'none' }} disabled={loading}>Add</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {merch.map((item, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 180, textAlign: 'center', position: 'relative' }}>
                {item.image && <img src={`http://localhost:5000${item.image}`} alt={item.name} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 5 }} />}
                <h4>{item.name}</h4>
                <p>{item.price}</p>
                <button onClick={() => handleRemoveMerch(idx)} style={{ position: 'absolute', top: 5, right: 5, background: '#ff4444', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 8px' }} disabled={loading}>X</button>
              </div>
            ))}
          </div>
        </section>
        <section style={{ background: '#1A1A1A', borderRadius: 10, padding: 20, marginBottom: 30 }}>
          <h3 style={{ color: '#FFC300' }}>Events</h3>
          <form onSubmit={handleAddEvent} style={{ marginBottom: 20 }}>
            <input type="text" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="date" placeholder="Date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="text" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} required style={{ marginRight: 8 }} />
            <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} style={{ marginRight: 8 }}>
              <option value="future">Future</option>
              <option value="past">Past</option>
            </select>
            <input type="file" accept="image/*" onChange={e => setNewEvent({ ...newEvent, image: e.target.files[0] })} style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: '#FFC300', color: '#0A0A0A', borderRadius: 5, padding: '6px 12px', border: 'none' }} disabled={loading}>Add</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {events.map((event, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 220, textAlign: 'center', position: 'relative' }}>
                {event.image && <img src={`http://localhost:5000${event.image}`} alt={event.title} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 5 }} />}
                <h4>{event.title}</h4>
                <p>{event.date}</p>
                <p>{event.description}</p>
                <span style={{ color: event.type === 'future' ? '#FFC300' : '#BBBBBB' }}>{event.type === 'future' ? 'Future' : 'Past'}</span>
                <button onClick={() => handleRemoveEvent(idx)} style={{ position: 'absolute', top: 5, right: 5, background: '#ff4444', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 8px' }} disabled={loading}>X</button>
              </div>
            ))}
          </div>
        </section>
        <section style={{ background: '#1A1A1A', borderRadius: 10, padding: 20, marginBottom: 30 }}>
          <h3 style={{ color: '#FFC300' }}>Members</h3>
          <form onSubmit={handleAddMember} style={{ marginBottom: 20 }}>
            <input type="text" placeholder="Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="text" placeholder="Role" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="text" placeholder="Description" value={newMember.description} onChange={e => setNewMember({ ...newMember, description: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="file" accept="image/*" onChange={e => setNewMember({ ...newMember, image: e.target.files[0] })} style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: '#FFC300', color: '#0A0A0A', borderRadius: 5, padding: '6px 12px', border: 'none' }} disabled={loading}>Add</button>
          </form>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {members.map((member, idx) => (
              <div key={idx} style={{ background: '#0A0A0A', borderRadius: 8, padding: 10, minWidth: 180, textAlign: 'center', position: 'relative' }}>
                {member.image && <img src={`http://localhost:5000${member.image}`} alt={member.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', border: '2px solid #FFC300' }} />}
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <p>{member.description}</p>
                <button onClick={() => handleRemoveMember(idx)} style={{ position: 'absolute', top: 5, right: 5, background: '#ff4444', color: '#fff', border: 'none', borderRadius: 5, padding: '2px 8px' }} disabled={loading}>X</button>
              </div>
            ))}
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
