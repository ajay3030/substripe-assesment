const path = require('path');
const express = require('express')
const home = (app) => {
    app.get("/", (req,res)=> {
        res.sendFile(path.join(__dirname,'/build/index.html'));
    });
    app.get("/subscribe", (req,res)=> {
        res.sendFile(path.join(__dirname,'/build/index.html'));
    });
    app.get("/login", (req,res)=> {
        res.sendFile(path.join(__dirname,'/build/index.html'));
    });
    app.get("/register", (req,res)=> {
        res.sendFile(path.join(__dirname,'/build/index.html'));
    });
    app.use('/static/', express.static(__dirname+'/build/static'));
}
module.exports = home;