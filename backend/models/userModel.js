const mongoose = require('mongoose');

// Update User Schema to Include Documents
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    profilePic: String,
    role: {
      type: String,
      default: 'GENERAL',
    },
    documents: [
      {
        link: { type: String, required: true },
        date: { type: Date, default: Date.now },
        price: { type: Number, required: true },
        location: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;




/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    profilePic: String,
    role: {
      type: String,
      default: 'GENERAL',
    },
    location: String, // Add this field
    hostel: String,    // Add this field
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;*/


/*const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    profilePic : String,
    role : String,
},{
    timestamps : true
}
)


const userModel = mongoose.model("user", userSchema)

module.exports = userModel*/