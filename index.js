const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://lavishjain30306:EpTFPqkOWTA27LMP@todo2-cluster1.jrtmgkl.mongodb.net/?retryWrites=true&w=majority&appName=TODO2-cluster1");
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
app.post("/delete", function(req,res){
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

app.listen(121,function(){
    console.log("Server Started");
});