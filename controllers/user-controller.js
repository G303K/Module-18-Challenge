// Importing the User and Thought models
const { User, Thought } = require("../models");

// Controller for handling various CRUD operations on users
const userController = {
  // Get all users with friends, sorted by ID in descending order
  getAllUser(req, res) {
    User.find({})
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.sendStatus(400));
  },

  // Get a single user by their ID with thoughts and friends populated
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData)
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        res.json(dbUserData);
      })
      .catch((err) => res.sendStatus(400));
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // Update a user by their ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData)
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // Delete a user by their ID and also delete associated thoughts
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) =>
        Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.json(err));
  },

  // Add a friend to a user by their ID
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData)
          return res.status(404).json({ message: "No user with this id" });
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // Remove a friend from a user by their ID and friend's ID
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData)
          return res.status(404).json({ message: "No user with this id!" });
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

// Export the userController for use in other modules
module.exports = userController;
