const getCategories = (req, res) => {
    try {
        res.send("GET Request");
    } catch (error) {
        console.error(error)
    }
}

const addCategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("POST Request");
    } catch (error) {
        console.error(error)
    }
}

const updateCategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("PUT Request");
    } catch (error) {
        console.error(error)
    }
}

const deleteCategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("DELETE Request");
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
}