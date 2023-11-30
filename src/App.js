import React, { useState, useEffect } from "react";

import api from './Services/api';

import Notes from "./Components/Notes";
import RadioButton from "./Components/RadioButton";

import './app.css';

function App() {
  const [ title, setTitle ] = useState('');
  const [ notes, setNotes ] = useState('');
  const [ allNotes, setAllNotes ] = useState([]);
  const [ selectedValue, setSelectedValue ] = useState('all');

  useEffect(() => {
    getAllNotes();
  }, [title, notes]);

  async function getAllNotes() {
    const response = await api.get('/api/annotations/');
    setAllNotes(response.data);
  }

  async function loadNotes(option) {
    const params = { priority: option };
    const response = await api.get(`/api/priority/`, { params });

    if (response) {
      setAllNotes(response.data);
    }
  }

  async function handleChange(e) {
    setSelectedValue(e.value);

    if (e.checked && e.value !== 'all') {
      loadNotes(e.value);
    } else {
      getAllNotes();
    }
  }

  async function handleDelete(id) {
    const deletedNote = await api.delete(`/api/annotations/${id}`);

    if (deletedNote) {
      setAllNotes(allNotes.filter(note => note._id !== id));
    }
  }

  async function handleChangePriority(id) {
    const note = await api.put(`/api/priority/${id}`);

    if (note && selectedValue !== 'all') {
      loadNotes(selectedValue);
    } else if (note) {
      getAllNotes();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/api/annotations/', {
      title,
      notes,
      priority: false
    });

    setTitle('');
    setNotes('');

    if (selectedValue !== 'all') {
      getAllNotes();
    } else {
      setAllNotes([...allNotes, response.data]);
    }

    setSelectedValue('all');
  }

  useEffect(() => {
    function enableSubmitButton() {
      let btn = document.getElementById('btn_submit');
      btn.style.background = '#ffd3ca';

      if (title.length > 0 && notes.length > 0) {
        btn.style.background = '#eb8f7a';
      }
    }

    enableSubmitButton();
  }, [title, notes]);

  return (
    <div id="app">
      <aside>
        <strong>Caderno de Anotações</strong>

        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="title">Título</label>
            <input id="title" required maxLength="30" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="notes">Anotações</label>
            <textarea id="notes" required  value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button id="btn_submit" type="submit">Salvar</button>
        </form>

        <RadioButton selectedValue={selectedValue} handleChange={handleChange} />
      </aside>

      <main>
        <ul>
          { allNotes.map(data => (<Notes key={data._id} data={data} handleDelete={handleDelete} handleChangePriority={handleChangePriority} />)) }
        </ul>
      </main>
    </div>
  );
}

export default App;
