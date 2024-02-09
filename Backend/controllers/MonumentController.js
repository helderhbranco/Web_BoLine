var mongoose = require("mongoose");
var Monument = require("../models/Monument");
var Event = require("../models/Event");
const querystring = require('querystring');
const multer = require('multer');



const VIEW_FORM_LIST = "monuments/monuments_list.ejs";
const VIEW_FORM_CREATE = "monuments/monuments_create.ejs";
const VIEW_FORM_DELETE = "monuments/monuments_delete.ejs";

monumentController = {};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Set the destination folder where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Generate a unique filename
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); // Set the filename
  }
});

const upload = multer({ storage: storage });


// #region Create
monumentController.page_req = (req, res) => {
  //res.render(VIEW_FORM_CREATE, { results: "", monument: new Monument(), message: '' });
  return res.redirect("/");
}; 

monumentController.request_send = (req, res) => {
  var monument = new Monument();
  var address = req.body.address;

  //const url = `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=7a8b41b90919473d9e1933519ae0504c`;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=7a8b41b90919473d9e1933519ae0504c`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
  

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {

      if(!data.results){
        return res.render("error", {
          message: "Invalid address.",
          error: { status: 401 },
        });
      }

      if (data.results.length == 0) {
        return res.render(VIEW_FORM_CREATE, { results: "empty", monument: new Monument(), message: "Invalid address." });
      }
      res.render(VIEW_FORM_CREATE, { results: data.results, monument: new Monument(), message: '' });
    })
    .catch((error) => {
      console.log(error);
      return res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });
};

monumentController.request_accept = function (req, res, next) {
  if (!req.body.selectedResult) {
    return res.render("error", {
      message: "Error on the server.",
      error: { status: 400 },
    });
  }

  const selectedResult = JSON.parse(querystring.unescape(req.body.selectedResult));
  //console.log(selectedResult);

  // Criar o monumento com base no resultado selecionado
  const monument = {
    name: selectedResult.name,
    street: selectedResult.street,
    city: selectedResult.city,
    county: selectedResult.county,
    postcode: selectedResult.postcode,
    country: selectedResult.country,
    formatted: selectedResult.formatted,
    lat: selectedResult.lat,
    lon: selectedResult.lon,
    place_id: selectedResult.place_id
  };

  /*
  console.log("--------------------------------")
  console.log(monument);
  console.log("--------------------------------")
  */
  return res.render(VIEW_FORM_CREATE, { results: [], monument: monument }, message = '');
};


monumentController.formCreate = function (req, res, next) {
  res.render(VIEW_FORM_CREATE, { results: '', monument: new Monument(), message: '' });
};

monumentController.create = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log('Multer error:', err);
      return res.render("error", {
        message: "Error uploading the image.MULTER",
        error: { status: 500 },
      });
    } else if (err) {
      console.log('Other error:', err);
      return res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    }
  
  Monument.findOne({ place_id: req.body.place_id })
    .exec()
    .then((db_monument) => {
      existingMonument = db_monument;
      if (existingMonument) {
        return res.render(VIEW_FORM_CREATE, { results: '', monument: new Monument(), message: "Monument already exists." });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });

  const monumentData = req.body;
  if(!req.file){
    return res.render("error", { message: "Error uploading the image.", error: { status: 500 } });
  }
  const monument = new Monument({
    name: monumentData.name,
    address: {
      street: monumentData.street,
      city: monumentData.city,
      county: monumentData.county,
      postcode: monumentData.postcode,
      country: monumentData.country,
      formatted: monumentData.formatted,
    },
    coordinates: {
      lat: monumentData.lat,
      lon: monumentData.lon,
    },
    place_id: monumentData.place_id,
    status: "Deactivated",
    photo: req.file.filename
  });
  const monumentSavePromise = monument.save();

  monumentSavePromise
    .then(() => res.redirect("/pagina_inicial"))
    .catch((error) => {
      console.log(error);
      res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      })
    }    );
  });
};

// #endregion

// #region Read
monumentController.list = function (req, res, next) {
  Monument.find({})
    .exec()
    .then((db_monuments) => {
      if (!db_monuments) {
        //res.status(404).json({ message: "No monuments found." });
        res.render("error", {
          message: "No monuments found.",
          error: { status: 404 },
        });
      }
      //res.status(200).json(db_monuments);
      res.render(VIEW_FORM_LIST, { monuments: db_monuments });
    })
    .catch((err) => {
      console.error(err);
      //res.status(500).json({ message: "Error on the server." });
      res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });
};

// #endregion

// #region Delete
monumentController.formDelete = function (req, res, next) {
  return res.redirect("/");
  /*
  Monument.find({})
    .exec()
    .then((db_monuments) => {
      if (!db_monuments) {
        //res.status(404).json({ message: "No monuments found." });
        res.render("error", {
          message: "No monuments found.",
          error: { status: 404 },
        });
      }
      res.render(VIEW_FORM_DELETE, { monument: db_monuments });
    })
    .catch((err) => {
      //res.status(500).json({ message: "Error on the server." });
      res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });
    */
};

monumentController.delete = function (req, res, next) {

  req.body.local = req.params.id;

  Event.find({ monument_id: req.body.local })
  .exec()
  .then(dbevents => {
    if (dbevents.length == 0) {
      console.log("No events found.");
      Monument.findByIdAndRemove(req.params.id)
      .exec()
      .then(db_monument => {
        return res.send("<script>alert('Monument deleted.'); window.location.href = '/';</script>");
      })
      .catch(err => {
        //res.status(500).json({ message: "Error on the server." });
        console.log(err);
        return res.render("error", {message: "Error on the server.", error: { status: 500 }});
      });
    }
  })
  .catch(err => {
    //res.status(500).json({ message: "Error on the server." });
    return res.render("error", {message: "Error on the server.", error: { status: 500 }});
  });
};

// #endregion

monumentController.showAll = function (req, res, next) {
  Monument.find({})
    .exec()
    .then((dbevents) => {
      if (!dbevents || dbevents.length === 0) {
        //return res.json({ message: "No monuments found." });
        res.render("error", {
          message: "No monuments found.",
          error: { status: 404 },
        });
      }
      //res.json(dbevents);
      res.render("create_events", { monument: dbevents });
    })
    .catch((err) => {
      console.error(err);
      //res.status(500).json({ message: "Error on the server." });
      res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });
};

monumentController.showAllE = function (req, res, next) {
  Monument.find({})
    .exec()
    .then((dbevents) => {
      if (!dbevents) {
        return res.json("No monuments found.");
      }
      //res.json(dbevents);
      Event.find({})
        .exec()
        .then((dbeventss) => {
          if (!dbeventss) {
            return res.json("No events found.");
          }
          res.render("../views/edit_event", {
            monument: dbevents,
            event: dbeventss,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });
};

module.exports = monumentController;
