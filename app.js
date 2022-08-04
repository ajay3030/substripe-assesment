const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const auth = require("./auth");
const Subscription = require("./db/subscriptionModel");
const stripe = require('stripe')('sk_test_51LSc1WSBAlsRnsXiyFsGESsJuqsgmyaoeOerc9Vn5alzdIepDRoPRdy5bc70o1CyNZSTUfe2l7n4goZa1eyjtBZn003svCJhyu');
// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes =require('./stripe.js')(app);

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// register endpoint
app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then(async(hashedPassword) => {
      const customer = await stripe.customers.create({
        "name":request.body.username,
        "email": request.body.email
      });
      const user = new User({
        email: request.body.email,
        username: request.body.username,
        password: hashedPassword,
        billing_id: customer.id
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {

          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            billing_id: user.billing_id,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});


app.get("/get-user-data", auth, (request,response) => {
  resp = User.findOne({email: request.user.userEmail},(err,data)=>{
    err? console.log(err) : response.send(data);
  })
});


app.get("/initData", (req,res)=>{
  const subscription = new Subscription({
    yearly: [
      { 
        id: 'price_1LSpczSBAlsRnsXiVkzkRJem',
        type: "Mobile",
        price: "1000",
        quality: "Good",
        res:"480p",
        devices:["Phone","Tablet"]
       },
       {
        id:'price_1LSpeNSBAlsRnsXiO3ca20XZ',
        type: "Basic",
        price: "2000",
        quality: "Good",
        res:"480p",
        devices:["Phone","Tablet","Computer","TV"]
       },
       {
        id:'price_1LSpfPSBAlsRnsXiWWkJQpuo',
        type: "Standard",
        price: "5000",
        quality: "Better",
        res:"1080p",
        devices:["Phone","Tablet","Computer","TV"]
       },
       {
        id:'price_1LSpgCSBAlsRnsXiK9sMNP8s',
        type: "Premium",
        price: "7000",
        quality: "Best",
        res:"4K+HDR",
        devices:["Phone","Tablet","Computer","TV"]
       } 
    ],
    monthly:[
       {
        id: 'price_1LSpczSBAlsRnsXi5oQzR65B',
        type: "Mobile",
        price: "100",
        quality: "Good",
        res:"480p",
        devices:["Phone","Tablet"]
       },
       {
        id:'price_1LSpeNSBAlsRnsXiCFSU6dwo',
        type: "Basic",
        price: "200",
        quality: "Good",
        res:"480p",
        devices:["Phone","Tablet","Computer","TV"]
       },
       {
        id:'price_1LSpfOSBAlsRnsXiYjMbQ5yH',
        type: "Standard",
        price: "500",
        quality: "Better",
        res:"1080p",
        devices:["Phone","Tablet","Computer","TV"]
       },
       {
        id:'price_1LSpgCSBAlsRnsXirBwpGDiy',
        type: "Premium",
        price: "700",
        quality: "Best",
        res:"4K+HDR",
        devices:["Phone","Tablet","Computer","TV"]
       } 
    ]
  });
  subscription
    .save()
    .then((result) => {
      res.status(201).send({
        message: "You are ready to Share the Website",
        result,
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: "Error While Saving Data",
        error,
      });
    });
})  

app.get('/subscriptionData',(req,res)=>{
  Subscription.find({}, (err, data) => {
    if (err) {  
        console.log(err);
    } else {
        res.json(data);
    }
})
})

module.exports = app;
