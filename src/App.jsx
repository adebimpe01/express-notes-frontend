import { useState, useEffect } from 'react';

const API = 'https://express-notes-api-ao1u.onrender.com/notes';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function loadNotes() {
    try {
      const res = await fetch(API);
      setNotes(await res.json());
    } catch {
      setError('Could not reach the server');
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const res = await fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    setTitle('');
    setContent('');
    setEditingId(null);
    loadNotes();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadNotes();
  }

  function startEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', fontFamily: 'sans-serif', backgroundColor: '#f0f0f0', padding: '30px', borderRadius: '10px' }}>
      <h1>Notes</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          style={{ marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box',borderRadius: '5px', border: '1px solid #ccc' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Content"
          style={{ marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box',borderRadius: '5px', border: '1px solid #ccc' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {notes.map((note) => (
          <li key={note.id} style={{ marginBottom: '10px', padding: '10px', gap: '10px', backgroundColor: '#ffffff', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>
              <strong style={{ marginRight: '10px' }}>{note.title}</strong>: <span style={{ marginRight: '10px' }}>{note.content}</span>
            </span>
            <span style={{ marginRight: '10px', gap: '10px', display: 'flex' }}>
            <button onClick={() => startEdit(note)} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
              Edit
            </button>
            <button onClick={() => handleDelete(note.id)} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
              Delete
            </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}