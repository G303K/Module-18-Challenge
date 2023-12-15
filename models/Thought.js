const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// Reaction Schema definition
const ReactionSchema = new Schema(
  {
    reactionId: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }, // Unique ID for each reaction
    reactionBody: { type: String, required: true, maxlength: 280 }, // Text content of the reaction
    username: { type: String, required: true }, // Username of the user who posted the reaction
    createdAt: { type: Date, default: Date.now, get: (timestamp) => dateFormat(timestamp) }, // Reaction creation timestamp
  },
  { toJSON: { getters: true }, id: false } // Include getters for JSON representation, disable inclusion of the ID
);

// Thought Schema definition
const ThoughtSchema = new Schema(
  {
    thoughtText: { type: String, required: "Thought is Required", minlength: 1, maxlength: 280 }, // Text content of the thought
    createdAt: { type: Date, default: Date.now, get: (timestamp) => dateFormat(timestamp) }, // Thought creation timestamp
    username: { type: String, required: true }, // Username of the user who posted the thought
    reactions: [ReactionSchema], // Array of reactions associated with the thought
  },
  { toJSON: { virtuals: true, getters: true }, id: false } // Include virtuals and getters for JSON representation, disable inclusion of the ID
);

// Virtual property for calculating the reaction count
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Model creation using the Thought Schema
const Thought = model("Thought", ThoughtSchema);

// Export the Thought model for use in other files
module.exports = Thought;

