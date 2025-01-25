const getSubcategories = (req, res) => {
    try {
        res.send("GET Request");
    } catch (error) {
        console.error(error)
    }
}

const addSubcategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("POST Request");
    } catch (error) {
        console.error(error)
    }
}

const updateSubcategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("PUT Request");
    } catch (error) {
        console.error(error)
    }
}

const deleteSubcategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("DELETE Request");
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
}