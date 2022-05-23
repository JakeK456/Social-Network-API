const mongoose = require("mongoose");
const { User, Thought } = require("../models");

// // Aggregate function to get the number of students overall
// const headCount = async () =>
//   Student.aggregate()
//     .count("studentCount")
//     .then((numberOfStudents) => numberOfStudents);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     { $match: { _id: mongoose.Types.ObjectId(studentId) } },
//     {
//       $unwind: "$assignments",
//     },
//     {
//       $group: { _id: studentId, overallGrade: { $avg: "$assignments.score" } },
//     },
//   ]);

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thought._id } },
          { runValidators: true, new: true }
        );
      })
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  removeThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : User.findOneAndUpdate(
              { username: thought.username },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought deleted, but no user found",
            })
          : res.json({ message: "Thought successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
};
