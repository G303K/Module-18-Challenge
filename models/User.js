// Importing necessary modules from Mongoose
const { Schema, model } = require("mongoose");

// User Schema definition
const UserSchema = new Schema(
  {
    // Definition for the 'username' field
    username: {
      type: String,
      unique: true, // Ensures uniqueness of usernames
      trim: true, // Trims whitespace from the username
      required: "Username is Required", // Indicates that the username is a required field
    },
    // Definition for the 'email' field
    email: {
      type: String,
      unique: true, // Ensures uniqueness of emails
      required: "Email is Required", // Indicates that the email is a required field
      match: [/.+@.+\..+/], // Validates that the email follows a basic format
    },
    // Array of ObjectIds referencing 'Thought' model for thoughts associated with the user
    thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
    // Array of ObjectIds referencing 'User' model for friends associated with the user
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { toJSON: { virtuals: true }, id: false } // Include virtuals for JSON representation, disable inclusion of the ID
);

// Virtual property for calculating the friend count
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Model creation using the User Schema
const User = model("User", UserSchema);

// Export the User model for use in other files
module.exports = User;

