const productController = {};
const Product = require("../models/Product");
const PAGE_SIZE = 3;

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
        const condition = name ? { name: { $regex: name, $options: "i" } } : {};

        let response = {};

        const query = Product.find(condition)
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const totalItemNum = await Product.find(condition).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        response.totalPageNum = totalPageNum; // 변수 이름 변경
        const productList = await query.exec();
        response.data = productList;

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
};
productController.getProductAll = async (req, res) => {
    try {
        const { name } = req.query;
        const condition = name ? { name: { $regex: name, $options: "i" } } : {};

        const query = Product.find(condition);

        const productList = await query.exec();
        const totalItemNum = productList.length;

        const response = {
            totalItemNum: totalItemNum,
            data: productList,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
};

module.exports = productController;
