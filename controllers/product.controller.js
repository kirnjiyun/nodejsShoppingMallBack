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
        const { page = 1, name } = req.query;
        const pageSize = 10; // 페이지당 항목 수
        const condition = name ? { name: { $regex: name, $options: "i" } } : {};

        const products = await Product.find(condition)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const totalProducts = await Product.countDocuments(condition);

        res.status(200).json({
            status: "success",
            data: products,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

module.exports = productController;
