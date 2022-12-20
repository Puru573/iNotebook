import logo from './logo.svg';
import './App.css';
import Navbar from './Component/Navbar'
import Home from './Component/Home'
import About from './Component/About'
import NoteState from './Context/notes/Notestate';
import Alert from './Component/Alert'
import Login from './Component/Login';
import Signup from './Component/Signup';
import { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  const[alert,setAlert]=useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500)
  }
  return (
    <>
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>

        <div className='container'>
        <Routes>
          <Route exact path="/About"
            element={<About />}>
          </Route>
          <Route exact path="/"
            element={<Home showAlert={showAlert}/>}>
          </Route>
          <Route exact path="/login"
            element={<Login showAlert={showAlert} />}>
          </Route>
          <Route exact path="/signup"
            element={<Signup showAlert={showAlert} />}>
          </Route>

        </Routes>
        </div>
      
        

      </Router>
    </NoteState>
    </>
  );
}

export default App;
