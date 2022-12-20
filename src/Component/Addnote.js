import React,{useContext,useState} from 'react'
import NoteContext from '../Context/notes/Notecontext';
function Addnote(props) {
    const context = useContext(NoteContext);
    const { addnote } = context; //in destructuring the name remains the same

    const [note,setNote]=useState({title:"",description:"",tag:""});

    const handleClick=(e)=>{
        e.preventDefault()
        addnote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("added successfully","success");

    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value});
    }
  return (
    <div>
         <div className="container my-3">
        <h1>Add a note</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label"><title></title></label>
            <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange}  minLength={5} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">description</label>
            <input type="text" className="form-control" id="description" name="description"value={note.description} onChange={onChange}  minLength={5} required />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="tag" name="tag"value={note.tag} onChange={onChange} />
         </div>
          <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add a note</button>
        </form>
      </div>
    </div>
  )
}

export default Addnote
