const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Movie = require("../models/movie")


router.get("/", (req, res, next) => {
    Movie.find()
    .then(result => {
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

    Movie.find({
        title: req.body.title,
        producer: req.body.producer,
        year: req.body.year
    })
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0){
            return res.status(406).json({
                message: "Movie is already inducted"
            })
        }

    const newMovie = new Movie({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        producer: req.body.producer,
        year: req.body.year
    });


    //write to the db
    newMovie.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Movie Saved",
                Movie: {
                    title: result.title,
                    producer: result.producer,
                    year: result.year,
                    id: result._id,
                    metadata: {
                        host: req.hostname,
                        method: req.method
                    }
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
        console.error(error);
        res.status(500).json({
            error: {
                message: "Unable to save movie with title: " + req.body.title
            }
        })
    })
});

router.get("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;
    Movie.findById(movieId)
        .then(result => {
            if(!result){
                console.log(result);
                return res.status(404).json({
                    message: "Movie Not Found"
                })
            }

            res.status(200).json({
                Movie: {
                    title: result.title,
                    producer: result.producer,
                    year: result.year,
                    id: result._id,
                    metadata: {
                        host: req.hostname,
                        method: req.method
                    }
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

router.patch("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;
    
    const updatedMovie = {
        title: req.body.title,
        producer: req.body.producer,
        year: req.body.year
    };

    Movie.updateOne({
        _id:movieId
    }, {
        $set: updatedMovie
    })
    .then(result => {
        res.status(200).json({
            message: "Updated Movie",
            result,
            Movie: {
                title: updatedMovie.title,
                producer: updatedMovie.producer,
                year: updatedMovie.year,
                id: updatedMovie._id
            },
            metadata: {
                host: req.hostname,
                method: req.method
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

router.delete("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;

    Movie.findByIdAndDelete(movieId)
    .then(result => {
        res.status(200).json({
            message: "Movie Deleted",
            result,
            metadata: {
                host: req.hostname,
                method: req.method
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



module.exports = router;