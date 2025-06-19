const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const methodOverride = require('method-override');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://lavishjain30306:EpTFPqkOWTA27LMP@todo2-cluster1.jrtmgkl.mongodb.net/?retryWrites=true&w=majority&appName=TODO2-cluster1");
// mongoose.connect("mongodb://localhost:27017");
const dt = new mongoose.Schema({
    name: String
});
const items = mongoose.model("todo",dt);

// # Displaying data
app.get("/", function(req,res){
    items.find({})
        .then(Ti => {
            res.render("view", {arr: Ti,req: req});
            console.log("Added sucessfully !")
        })
        .catch(err => {
            console.log(err);
        });
});

// # Recieveing data
app.post("/", function(req,res){
    var tasks = req.body.element;
    var todotask = new items({
        name: tasks
    })
    if(todotask.name && todotask.name.trim() !== ""){
        todotask.save();
        res.redirect("/");
    }
    else {
        res.redirect("/?error=empty");
        return;
    }
});


// # Deleting data
app.delete("/delete", function(req,res){
    var delTask = req.body.delete;
    items.findByIdAndDelete(delTask)
        .then(t => {
            res.redirect("/");
            console.log("Deleted sucessfully !");
        })
        .catch(err => {
            console.log(err);
        });
});

// # Editing data
app.put("/edit", function(req, res) {
    var editTask = req.body.edit;
    var newTask = req.body.newName;

    items.findByIdAndUpdate(editTask, { name: newTask })
        .then(() => {
            console.log("Edited successfully!");
            res.redirect("/");
        })
        .catch(err => {
            console.error("Edit error:", err);
            res.status(500).send("Failed to edit task");
        });
});



app.listen(121,function(){
    console.log("Server Started");
});