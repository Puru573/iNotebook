import react, { useState } from 'react';
import NoteContext from './Notecontext';


const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notess = []
  const [notes, setNotes] = useState(notess);

    //   GET ALL  note
    const Getnotes = async () => {
      // todo API call
       
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": localStorage.getItem('token')
          
  
        },

      });
      const json=await response.json();
      console.log(json);
      setNotes(json);
    }
  //   Add a note
  const addnote = async (title, description, tag) => {
    // TODO: API Call
    // API Call 
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

      },
      body: JSON.stringify({title, description, tag})
    });
    const note=await response.json();
   
    setNotes(notes.concat(note))
  }

  // Delete a note
  const deleteNote = async (id) => {
    // TODO: API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

      },
    });
    const json=response.json();
    console.log(json);
    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }

  // Edit a Note
  const Editnote = async (id, title, description, tag) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

      },
      body: JSON.stringify({title, description, tag})
    });
    const json= await response.json();
    console.log(json);
    let newNotes=JSON.parse(JSON.stringify(notes));
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);

  }
  return (
    <NoteContext.Provider value={{ notes, setNotes, addnote, deleteNote, Editnote,Getnotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState