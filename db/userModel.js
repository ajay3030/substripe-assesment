const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  username:{
    type:String,
    required: [true,"Please enter a useranme"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  billing_id:{
    type: String,
  }
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
