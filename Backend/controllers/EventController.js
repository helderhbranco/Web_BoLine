var mongoose = require('mongoose');
var Event = require('../models/Event');
const Monument = require('../models/Monument');
const Ticket = require('../models/Ticket');
const multer = require('multer');

var countId = 0;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images'); // Specify the directory to store uploaded images
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded image
    }
  });
  
  var upload = multer({ storage: storage });

var eventController = {};


eventController.create = (req, res) => {

    var event = new Event();

    upload.single('image')(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        console.log(req.file);
        event.photo = req.file.filename;


    event.name = req.body.nome;
    event.id = countId++;
    event.description = req.body.description;
    event.date = req.body.date;
    event.status = req.body.status;
    event.monument_id = req.body.local;
    event.price = req.body.price;
    event.capacity = req.body.capacity;
    event.instante_capacity = 0;
    event.date_final = req.body.date_final;

// define two dates
let date1 = new Date(req.body.date); // December 31, 2022
let date2 = new Date(req.body.date_final); // January 1, 2023

     if(date1>date2){
        console.log("data inicial menor que data final");
        return res.redirect('/pagina_inicial');
    } 

    Event.find({monument_id:req.body.local}).exec()
    .then(dbeventss => {
        if (!dbeventss) {
            return res.json("No events found.");
        }
        var date_ini_event = new Date(dbeventss.date);
        var date_fin_event = new Date(dbeventss.date_final);
        if((date1>=date_ini_event && date1<=date_fin_event) || (date2>=date_ini_event && date2<=date_fin_event)){
            console.log("data inicial ou final dentro de um evento");
            return res.redirect('/pagina_inicial');
        }else{
            Monument.find({place_id:req.body.local}).exec()
            .then(dbevents => {
            if (!dbevents) {
                return res.json("No monuments found.");
            }
            event.event_place_name = dbevents[0].name;
            //console.log(dbevents);
            event.save().then((event) => {
                res.render('../views/show_created_event', { event: event });
            }).catch((err) => {
                res.status(500).json(err);
            });
            Monument.findOneAndUpdate({place_id:req.body.local}, {status: "Activated"}, {new: true}).exec()
        
        })
        .catch(err => {
            console.error(err);
            res.json(err);
        });
        }
    })
})

    /* Monument.find({place_id:req.body.local}).exec()
    .then(dbevents => {
        if (!dbevents) {
            return res.json("No monuments found.");
        }
        event.event_place_name = dbevents[0].name;
        //console.log(dbevents);
        if(dbevents[0].status == "Deactivated"){
        event.save().then((event) => {
            res.render('../views/show_created_event', { event: event });
        }).catch((err) => {
            res.status(500).json(err);
        });
        Monument.findOneAndUpdate({place_id:req.body.local}, {status: "Activated"}, {new: true}).exec()
    }else{
        res.redirect('/pagina_inicial');
    }
    })
    .catch(err => {
        console.error(err);
        res.json(err);
    }); */
    

    //aqui nao interessa
    /*event.save().then((event) => {
        res.render('../views/show_created_event', { event: event });
    }).catch((err) => {
        res.status(500).json(err);
    });*/
};

eventController.showAll = function (req, res, next) {
    Event.find({}).exec()
        .then(dbevents => {
            if (!dbevents) {
                return res.json("No events found.");
            }
            res.render('../views/show_all_events', { events: dbevents });
        })
        .catch(err => {
            return next(err);
        });
};
//função para mostrar todos os eventos para um ser selecionado para levar o seu id
eventController.getAll =  function (req, res, next) {
    Event.find({}).exec()
        .then(dbevents => {
            if (!dbevents) {
                return res.json("No events found.");
            }
            res.render('../views/delete_event', { events: dbevents });
        })
        .catch(err => {
            return next(err);
        });
};

eventController.getAllE =  function (req, res, next) {
    Event.find({}).exec()
        .then(dbevents => {
            if (!dbevents) {
                return res.json("No events found.");
            }
            //res.render('../views/edit_event', { events: dbevents });
            res.render('../views/select_event_edit', { events: dbevents });
        })
        .catch(err => {
            return next(err);
        });
};

eventController.placeholder = function (req, res, next) {
    Event.findById(req.body.event).exec()
        .then(dbevents => {
            if (!dbevents) {
                return res.json("No events found.");
            }
            Monument.find({}).exec()
                .then(dbmonuments => {
                    if (!dbmonuments) {
                        return res.json("No monuments found.");
                    }
                    res.render('../views/edit_event', { events: dbevents, monuments: dbmonuments });
                }
                )
                .catch(err => {
                    return next(err);
                });
        })
        .catch(err => {
            return next(err);
        });
};

eventController.delete = function (req, res, next) {
//aqui deveria ter qualquer coisa para restringir a eliminação de um evento que já tenha bilhetes vendidos 
//o correto deveria ser ver se o ja foi vendido algum bilhete se foi vendido so pode ser apagado o evento depois de passar a data do evento
    Ticket.find({event_id:req.body.local}).exec()
    .then(dbevents => {
        if (!dbevents) {
            return res.json("No tickets found.");
        }
        if(dbevents.length == 0){
    Event.findByIdAndRemove(req.body.local).exec()
        .then(dbevent => {
            if (!dbevent) {
                return res.json("No event found.");
            }
            Monument.findOneAndUpdate({place_id:dbevent.monument_id}, {status: "Deactivated"}, {new: true}).exec()
            res.redirect('/pagina_inicial');
         })
        .catch(err => {
            return next(err);
        });
    }else{
        for(var i = 0; i < dbevents.length; i++){
            Ticket.findByIdAndUpdate(dbevents[i]._id, { $set: {status: "Cancelado"}}, { new: true }).exec()
        }
        Event.findByIdAndRemove(req.body.local).exec()
        .then(dbevent => {
            if (!dbevent) {
                return res.json("No event found.");
            }
            Monument.findOneAndUpdate({place_id:dbevent.monument_id}, {status: "Deactivated"}, {new: true}).exec()
            res.redirect('/pagina_inicial');
         })
        .catch(err => {
            return next(err);
        });
    }
    })
};


eventController.edit = function (req, res, next) {

    upload.single('image')(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        console.log(req.file);


    console.log(req.body);

    var date1 = new Date(req.body.date);
    var date2 = new Date(req.body.date_final);

    if(date1 > date2){
        return res.redirect('/pagina_inicial');
    }

    Event.find({monument_id:req.body.monument_id}).exec()
        .then(dbeventses => {
            if (!dbeventses) {
                return res.json("No events found.");
            }
            //verifica se existe algum evento na mesma data
            for(var i = 0; i < dbeventses.length; i++){
                var date3 = new Date(dbeventses[i].date);
                var date4 = new Date(dbeventses[i].date_final);
                if((date1 >= date3 && date1 <= date4) || (date2 >= date3 && date2 <= date4)){
                    console.log("Erro");
                    return res.redirect('/pagina_inicial');
                }
            }
     Event.findById(req.body.event).exec()
        .then(dbevents => {
            if (!dbevents) {
                return res.json("No events found.");
            }
            if(req.body.capacity < dbevents.instante_capacity){
                return res.redirect('/pagina_inicial');
            }
            //verificar se o monumento esta disponivel na nova data e verificar a data nova dada
            //Event.findByIdAndUpdate(req.body.event, { $set: req.body }, { new: true }).exec()
            Event.findByIdAndUpdate(req.body.event, { $set: {name: req.body.nome, description: req.body.description, date: req.body.date, date_final: req.body.date_final, price: req.body.price, capacity: req.body.capacity, photo: req.file.filename} }, { new: true }).exec()
        .then(dbevent => {
            if (!dbevent) {
                return res.json("No event found.");
            }
            Monument.find({place_id:req.body.monument_id}).exec()
            .then(dbeventss => {
                if (!dbeventss) {
                    return res.json("No monuments found.");
                }
                Event.findByIdAndUpdate(req.body.event, { $set: {event_place_name: dbeventss[0].name} }, { new: true }).exec()
            })
            //arranjar meter deactivated nos monumentos,,,,, arranjar cena de apagar--- nao poder apagar monumento se ele estiver ativo(basta ir ao show all do monumento e restringir para ele mostrar so elementos desativados)
            //aqui tem de se verificar se existe mais algum evento com o monumento se sim nao fazer nada se nao meter deactivated
            Event.find({place_id:dbevents.monument_id}).exec()
            .then(dbeventss => {
                if (!dbeventss) {
                    Monument.findOneAndUpdate({place_id:dbevents.monument_id}, {status: "Deactivated"}, {new: true}).exec()
                    return res.redirect('/pagina_inicial');
                }
            // este ativar tem de estar sempre para meter como ativo
            Monument.findOneAndUpdate({place_id:dbevent.monument_id}, {status: "Activated"}, {new: true}).exec()
            res.redirect('/pagina_inicial');
        })
        .catch(err => {
            return next(err);
        });
        }) 

    /* Event.findByIdAndUpdate(req.body.event, { $set: req.body }, { new: true }).exec()
        .then(dbevent => {
            if (!dbevent) {
                return res.json("No event found.");
            }
            Monument.find({place_id:req.body.monument_id}).exec()
            .then(dbevents => {
                if (!dbevents) {
                    return res.json("No monuments found.");
                }
                Event.findByIdAndUpdate(req.body.event, { $set: {event_place_name: dbevents[0].name} }, { new: true }).exec()
            })
            //arranjar meter deactivated nos monumentos,,,,, arranjar cena de apagar--- nao poder apagar monumento se ele estiver ativo(basta ir ao show all do monumento e restringir para ele mostrar so elementos desativados)
            Monument.findOneAndUpdate({place_id:req.body.monument_id}, {status: "Deactivated"}, {new: true}).exec()
            Monument.findOneAndUpdate({place_id:dbevent.monument_id}, {status: "Activated"}, {new: true}).exec()
            res.redirect('/pagina_inicial');
        })
        .catch(err => {
            return next(err);
        }); */
    })
    })
    })
};

module.exports = eventController;
