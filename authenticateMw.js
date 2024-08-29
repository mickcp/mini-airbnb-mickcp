const Listing = require("./models/listing.js");
const expresserror = require("./utils/ExpressErr.js");
const { listingschema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You dont have access to perform this action");
    return res.redirect(`/listings/${id}`);
    // we dont return it will update the values
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  // we get error form the body
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expresserror(400, errmsg);
  } else {
    next();
  }
};

module.exports.validatereview = (req, res, next) => {
  // we get error form the body
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");

    throw new expresserror(400, errmsg);
  } else {
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error", "You have no access to delete ");
      return res.redirect(`/listings/${id}`);
      // we dont return it will update the values
    }
    next();
};