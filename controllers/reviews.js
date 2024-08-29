
const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createreview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "Your Review is added !");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.deletereview = async (req, res) => {
    let { id, reviewid } = req.params;
    // We are also deleting inside review arrays
    // by deleting review(id) inside review array using operator pull
    // in reviews arrays what ever id matches we are going to delete that
    Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Your review is deleted!");
    res.redirect(`/listings/${id}`);
  };
























