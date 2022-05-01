const express = require("express");
const mongoose = require("mongoose");
const Producer = require("../models/producer");
const router = express.Router();
const Messages = require("../../messages/messages");

router.get("/", (req, res, next) => {
    Producer.find()
    .select("producer _id")
    .populate("movie", "title year")
    .exec()
    .then(result => {
        if(result.length === 0){
            return res.status(406).json({
                message: Messages.producer_empty
            })
        }

        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    });
});

router.post("/", (req, res, next) => {
    Producer.find({
        producer: req.body.producer,
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(406).json({
                message: Messages.producer_already_added
            })
        }
    
    const newProducer = new Producer({
        _id: mongoose.Types.ObjectId(),
        movie: req.body.movie,
        producer: req.body.producer,
    });

    
    //write to the db
    newProducer.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: Messages.producer_saved,
                producer: {
                    producer: result.producer,
                    id: result._id,
                }
            })
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({
                error: {
                    message: err.message
                }
            })
        });
    })
    .catch(err => {
        console.error(err.message);
        res.status(500).json({
            error: {
                message: "Unable to add producer with name: " + req.body.producer
            }
        })
    });
});

router.get("/:producerId", (req, res, next) => {
    const producerId = req.params.producerId;
    Producer.findById(producerId)
    .select("producer _id")
    .populate("movie", "title producer year")
    .exec()
    .then(producer => {
        if(!producer){
            console.log(producer);
            return res.status(404).json({
                message: Messages.producer_not_found
            })
        }

        res.status(201).json({
            producer: producer
        })
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    });
});

router.patch("/:producerId", (req, res, next) => {
    const producerId = req.params.producerId;
    
    const updatedProducer = {
        movie: req.body.movie,
        producer: req.body.producer
    };

    Producer.updateOne({
        _id:producerId
    }, {
        $set: updatedProducer
    })
    .then(result => {
        if(producerId !== result){
            console.log(producerId);
            return res.status(404).json({
                message: Messages.producer_not_found
            })
        }

        res.status(200).json({
            message: Messages.producer_update,
            result,
            Producer: {
                producer: updatedProducer.producer,
                id: updatedProducer._id
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    });
});

router.delete("/:producerId", (req, res, next) => {
    const producerId = req.params.producerId;

    Producer.deleteOne({
        _id: producerId
    })
    .exec()
    .then(result => {
        if(producerId !== result){
            console.log(producerId);
            return res.status(404).json({
                message: Messages.producer_not_found
            })
        }

        res.status(200).json({
            message: Messages.producer_removed,
            request: {
                url: "http://localhost:3000/producer/" + producerId
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
});

module.exports = router;