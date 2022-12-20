import React, { useContext } from 'react'
import NoteContext from '../Context/notes/Notecontext';
const Noteitem=(props)=>{
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note,updateNote } = props;//note._id we get from this
    return (
        <div className="col-md-3">
            <div className="card my-3">

                <div className="card-body">
                    <div className='d-flex align-items-center'>
                        <h5 className="card-title">{note.title};</h5>
                        <i className="fa-regular fa-trash mx-2"onClick={()=>{deleteNote(note._id); props.showAlert("Deleted successfully","success")}}></i>
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note);}}></i>
                    </div>

                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Noteitem