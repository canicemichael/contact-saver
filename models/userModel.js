const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    verification_code: String,
    reset_password: {
      status: { type: Boolean, default: false },
      code: String,
      old_password: [],
    },
  },
  {
    timestamps: true,
  }
);

// inorder to chng _id to id
userSchema.virtual("id").get(function (){
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.plugin(passportLocalMongoose);

module.exports.User = mongoose.model("User", userSchema);
module.exports.userSchema = userSchema;