import { useState, useEffect } from 'react';

const API = 'http://localhost:3000/notes';

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
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Notes</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}{' '}
            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}