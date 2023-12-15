// Importing the Thought and User models
const { Thought, User } = require("../models");

// Controller for handling various CRUD operations on thoughts
const thoughtController = {
  // Get all thoughts with reactions, sorted by ID in descending order
  getAllThought(req, res) {
    Thought.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.sendStatus(400));
  },

  // Get a single thought by its ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData)
          return res.status(404).json({ message: "No thought with this id!" });
        res.json(dbThoughtData);
      })
      .catch((err) => res.sendStatus(400));
  },

  // Create a new thought and associate it with a user
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) =>
        User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
      )
      .then((dbUserData) => {
        if (!dbUserData)
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // Update a thought by its ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData)
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Delete a thought by its ID and remove its association with the user
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData)
          return res.status(404).json({ message: "No thought with this id!" });
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData)
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // Add a reaction to a thought by its ID
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData)
          return res.status(404).json({ message: "No thought with this id" });
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Remove a reaction from a thought by its ID and reaction ID
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

// Export the thoughtController for use in other modules
module.exports = thoughtController;
