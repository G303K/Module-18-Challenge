const { User, Thought } = require("../models");

const userController = {
  getAllUser: (req, res) => {
    User.find({}, "-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.sendStatus(400));
  },

  getUserById: ({ params }, res) => {
    User.findOne({ _id: params.id })
      .populate("thoughts friends", "-__v")
      .then((dbUserData) =>
        res.json(dbUserData || { message: "No User found with this id!" })
      )
      .catch((err) => res.sendStatus(400));
  },

  createUser: ({ body }, res) => {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  updateUser: ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) =>
        res.json(dbUserData || { message: "No User found with this id!" })
      )
      .catch((err) => res.json(err));
  },

  deleteUser: ({ params }, res) => {
    Thought.deleteMany({ userId: params.id })
      .then(() => User.findOneAndDelete({ _id: params.id }))
      .then((dbUserData) =>
        res.json(dbUserData || { message: "No User found with this id!" })
      )
      .catch((err) => res.json(err));
  },

  addFriend: ({ params }, res) => {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) =>
        res.json(dbUserData || { message: "No user found with this id" })
      )
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend: ({ params }, res) => {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) =>
        res.json(dbUserData || { message: "No user found with this id" })
      )
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
