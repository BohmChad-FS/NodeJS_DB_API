const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Book = require("../models/book")

router.get("/", (req, res, next) => {
    res.json({
        message: "Books - GET",
    });
});

router.post("/", (req, res, next) => {
    
    const newBook = new Book({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author
    });


    //write to the db
    newBook.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Book Saved",
                book: {
                    title: result.title,
                    author: result.author,
                    id: result._id,
                    metadata: {
                        method: req.method,
                        host: req.hostname
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
});

router.get("/:bookId", (req, res, next) => {
    const bookId = req.params.bookId;
    res.json({
        message: "Books - GET",
        id: bookId
    });
});

router.patch("/:bookId", (req, res, next) => {
    const bookId = req.params.bookId;
    
    const updatedBook = {
        title: req.body.title,
        author: req.body.author
    };

    Book.updateOne({
        _id:bookId
    }, {
        $set: updatedBook
    }).then(result => {
        res.status(200).json({
            message: "Updated Book",
            book: {
                title: result.title,
                author: result.author,
                id: result._id
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

router.delete("/:bookId", (req, res, next) => {
    const bookId = req.params.bookId;
    res.json({
        message: "Books - DELETE",
        id: bookId
    });
});

module.exports = router;