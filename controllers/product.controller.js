const productController = {};
const Product = require("../models/Product");
productController.createProduct = async (req, res) => {
    try {
        const {
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status,
        } = req.body;
        const product = new Product({
            sku,
            name,
            size,
            image,
            category,
            description,
            price,
            stock,
            status,
        });
        await product.save();
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

productController.getProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ status: "success", data: products });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

module.exports = productController;
