const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const formatDate = (date) => {
  return date.toLocaleDateString();
};

// Schema to create a thought model
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: formatDate,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
