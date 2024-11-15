const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true }
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   // Hash password using bcrypt
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

// Method to compare entered password with the stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

