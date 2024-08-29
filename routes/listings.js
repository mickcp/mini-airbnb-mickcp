const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isloggedin, isOwner,  validateListing} = require("../authenticateMw.js");
const listingContollers = require("../controllers/listings.js");
// first parsing then retrive and storing 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

/// validatelistigss 

router.route("/")
.get(wrapasync(listingContollers.index))
.post(
  isloggedin,
  upload.single('listing[image]'),
  validateListing,
  wrapasync(listingContollers.createListings)
);

router.get("/new", isloggedin, listingContollers.rendernewform);

router.route("/:id")
.get(wrapasync(listingContollers.showlisting))
.put(isloggedin,isOwner, upload.single('listing[image]'), validateListing,wrapasync(listingContollers.updatelistings))
.delete(isloggedin,isOwner,wrapasync(listingContollers.deleteroute));


router.route("/:id/edit")
.post(wrapasync(listingContollers.findbyid))
.get(isloggedin,isOwner,wrapasync(listingContollers.rendereditform));


module.exports = router;
