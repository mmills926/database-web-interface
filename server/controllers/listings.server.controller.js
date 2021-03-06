
/* Dependencies */
var Database = require('../db/listings.server.database.js');

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Database */
  var listing = new Database(req.body);

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  var comname = req.comname;

  Database.all(`SELECT * FROM sightings
               WHERE name = "${comname}"
               ORDER BY sighted DESC
               LIMIT 10;`,
  (err, row) => {
    if(err) {
      res.status(400).send(err);
    } else {
      res.send(row);
    }
  });

};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;

  listing.code = req.body.code;
  listing.name = req.body.name;
  listing.address = req.body.address;
  listing.latitude = req.body.latitude;
  listing.longitude = req.body.longitude;

  listing.save(function(err) {
    if(err) {
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
};

exports.updateFlower = function(req, res) {
  var comname = req.body.comname;
  var genus = req.body.genus;
  var species = req.body.species;

  Database.run(`UPDATE FLOWERS
                SET GENUS = "${genus}", SPECIES = "${species}"
                WHERE COMNAME = "${comname}";`, (err) => {
    if(err) {
      res.status(400).send(err);
    } else {
      console.log("success");
    }
  });
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  Database.findByIdAndRemove(listing._id,  function(err, results) {
    if(err) throw err;
    res.send(results);
  });
};

exports.addSighting = function(req, res) {
  var name = req.body.name;
  var person = req.body.person;
  var location = req.body.location;
  var sighted = req.body.sighted;

  Database.run(`INSERT INTO SIGHTINGS
                VALUES("${name}","${person}","${location}","${sighted}");`, (err) => {
    if(err) {
      res.status(400).send(err);
    } else {
      console.log("success");
    }
  });
};

// List all locations
exports.listLocations = function(req, res) {
  Database.all(`SELECT LOCATION FROM FEATURES`, (err, row) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(row);
    }
  });
}

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.listFlowers = function(req, res) {
  // query the database
  Database.all(`SELECT * FROM FLOWERS`, (err, row) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(row);
    }
  });
};

// Middleware
exports.setComName = function(req, res, next, comname) {
    req.comname = comname;
    next()
};
