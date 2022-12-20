const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser');
const Note=require('../models/Note');
const { body, validationResult } = require('express-validator'); 
const { typeImplementation } = require('@testing-library/user-event/dist/type/typeImplementation');

// Route:1 Get all the notes using:GET"/api/auth/fetchallnotes". login required

router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try{
        const notes=await Note.find({user:req.user.id});
        res.json(notes);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
  


})

// Route:2 Add a new  notes using:GET"/api/auth/addnotes". login required
router.post('/addnotes',fetchuser,[
    body('title',"enter a valid title").isLength({min:3}),
    body('description',"Description must be atleast of 5 characters").isLength({ min: 5 }),
],async(req,res)=>{
    try{
        const {title,description,tag}=req.body;
        // if there are errors,return bad requrest and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note=new Note({
            title,description,tag,user:req.user.id
        })
        const savedNote=await note.save();
    
        res.json(note);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
  
})

// Route:3 uptae an existing Note using :update"/api/notes/updatenotes". login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
    const {title,description,tag}=req.body;
    // create a newNote obj
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    // find the note to be updated and update it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed"); 
    }

    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});
})

// Route:4 delete an existing Note using :delete"/api/notes/deletenotes". login required

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
   

    // find the note to be deleted and delete it
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    // Allow deletion only if user ownns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("not allowed"); 
    }

    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});
})
module.exports=router