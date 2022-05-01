const express = require("express");
const Author = require("../models/author");
const router = express.Router();
const Messages = require("../../messages/messages");

router.get("/", (req, res, next) => {
    res.json({
        message: "Authors - GET"
    });
});

router.post("/", (req, res, next) => {
    res.json({
        message: "Authors - POST"
    });
});

router.get("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    Author.findById(authorId)
    .select("name _id")
    .populate("book", "title author")
    .exec()
    .then(author => {
        if(!author){
            console.log(author);
            return res.status(404).json({
                message: Messages.author_not_found
            })
        }

        res.status(201).json({
            author: author
        })
    })
    .catch(err => {
        res.status(500).json({
            error: {
                message: err.message
            }
        })
    })
});

router.patch("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    res.json({
        message: "Authors - PATCH",
        id: authorId
    });
});

router.delete("/:authorId", (req, res, next) => {
    const authorId = req.params.authorId;
    
    Author.deleteOne({
        _id: authorId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Author Deleted",
            request: {
                method: "GET",
                url: "http://localhost:3000/athors/" + authorId
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