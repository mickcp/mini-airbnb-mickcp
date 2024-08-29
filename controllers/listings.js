
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
  };


module.exports.rendernewform = (req, res) => {
    console.log(req.user);
    res.render("./listings/form.ejs");
  };

module.exports.showlisting = async (req, res, next) => {
    let { id } = req.params;
    const showbyid = await Listing.findById(id)
      .populate({ path: "reviews",
       populate: { path: "author", },
      })
      .populate("owner");
    if (!showbyid) {
      req.flash("error", "list you are asking for does not exits !");
      return res.redirect("/listings");
    }
    console.log(showbyid);
    res.render("./listings/show.ejs", { showbyid });
  };


module.exports.createListings = async (req, res, next) => {
let response = await geocodingClient
.forwardGeocode({
query: req.body.listing.location,
limit: 1,
}).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedlisting = await newListing.save();
    console.log(savedlisting);
    req.flash("success", "New list created!");
    res.redirect("/listings");
  };

module.exports.findbyid = async (req, res, next) => {
    let { id } = req.params;
    const showbyid = await Listing.findById(id);
    res.render("./listings/form.ejs");
  };

/// last made changes 
module.exports.rendereditform = async (req, res, next) => {
    let { id } = req.params;
    const listings = await Listing.findById(id);
if(!listings){
  req.flash("error", "Listing you requested for dose not exist!");
  res.redirect(`/listings`);
}

    let originalimageUrl = listings.image.url;
    originalimageUrl = originalimageUrl.replace("/upload","/upload/h_150,w_250");
    res.render("./listings/editform.ejs", { listings , originalimageUrl});
  };


module.exports.updatelistings = async (req, res, next) => {
    // if(!req.body.listing){
    //   throw new expresserror(404,"please send valid data for listing ");
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    req.flash("success", "Your details are edited!");
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteroute = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Your details are deteted!");
    res.redirect(`/listings`);
  };










