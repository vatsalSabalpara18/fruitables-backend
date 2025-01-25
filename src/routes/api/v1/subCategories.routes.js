const express = require('express');

const router = express.Router();

router.get("/get-subcategories", (req, res) => {
    res.send("GET Request");
})

router.post("/add-subcategory", (req, res) => {
    console.log(req.body);
    res.send("POST Request");
})

router.put("/update-subcategory/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params);
    res.send("Update Request");
})

router.delete("/delete-subcategory/:id", (req, res) => {
    console.log(req.body);
    res.send("DELETE Request");
})

module.exports = router;