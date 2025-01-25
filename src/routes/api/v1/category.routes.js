const express = require('express');

const router = express.Router();

router.get("/get-categories", (req, res) => {
    res.send("GET Request");
})

router.post("/add-category", (req, res) => {
    console.log(req.body);
    res.send("POST Request");
})

router.put("/update-category/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params);
    res.send("Update Request");
})

router.delete("/delete-category/:id", (req, res) => {
    console.log(req.body);
    res.send("DELETE Request");
})

module.exports = router;