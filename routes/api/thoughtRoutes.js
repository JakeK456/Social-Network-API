const router = require("express").Router();

const {
  getThoughts,
  createThought,
  getSingleThought,
  updateThought,
  removeThought,
  createReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

// /api/thoughts

router.route("/").get(getThoughts).post(createThought);

router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(removeThought);

router.route("/:thoughtId/reactions").post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
