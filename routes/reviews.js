const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/ExpressErr.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isloggedin,validatereview,isreviewAuthor} = require("../authenticateMw.js");

const reviewController = require("../controllers/reviews.js");

router.post(
  "/",
  isloggedin,
  validatereview,
    wrapasync(reviewController.createreview)
);

router.delete(
  "/:reviewid",
  isloggedin,
  isreviewAuthor,
  wrapasync(reviewController.deletereview)
);
module.exports = router;

// review delete route
// why couldnt i mention validate review
