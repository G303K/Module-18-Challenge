const { Thought, User } = require("../models");

const thoughtController = {
  createThought: async ({ body }, res) => {
    try {
      const { _id } = await Thought.create(body);
      const dbUserData = await User.findByIdAndUpdate(
        body.userId,
        { $push: { thoughts: _id } },
        { new: true, runValidators: true }
      );

      if (!dbUserData)
        return res.status(404).json({ message: "No user found with this id!" });
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  getAllThoughts: async (_, res) => {
    try {
      res.json(await Thought.find({}));
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  getThoughtById: async ({ params }, res) => {
    try {
      const dbThoughtData = await Thought.findById(params.id);
      if (!dbThoughtData)
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  updateThought: async ({ params, body }, res) => {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true,
      });
      if (!dbThoughtData)
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      res.json(dbThoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  deleteThought: async ({ params }, res) => {
    try {
      const dbThoughtData = await Thought.findByIdAndDelete(params.id);
      if (!dbThoughtData)
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });

      const dbUserData = await User.findByIdAndUpdate(
        { thoughts: params.id },
        { $pull: { thoughts: params.id } },
        { new: true }
      );
      if (!dbUserData)
        return res
          .status(404)
          .json({
            message:
              "thought deleted, but no user associated with this thought",
          });

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  createReaction: async ({ params, body }, res) => {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(
        params.thoughtId,
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
        .populate({ path: "reactions", select: "-__v" })
        .select("-__v");
      if (!dbThoughtData)
        return res.status(404).json({ message: "No thoughts with this ID." });
      res.json(dbThoughtData);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  deleteReaction: async ({ params }, res) => {
    try {
      const dbThoughtData = await Thought.findByIdAndUpdate(
        params.thoughtId,
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      if (!dbThoughtData) return res.status(404).json({ message: "Nope!" });
      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = thoughtController;
