const productController = {};
const Product = require("../models/Product");
const PAGE_SIZE = 4;

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
        const condition = name
            ? { name: { $regex: name, $options: "i" }, isDeleted: false }
            : { isDeleted: false };

        let response = {};

        const query = Product.find(condition)
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const totalItemNum = await Product.find(condition).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        response.totalPageNum = totalPageNum;
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

productController.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) throw new Error("해당 아이템이 없습니다.");
        res.status(200).json({ status: "success", data: product });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
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
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            {
                sku,
                name,
                size,
                image,
                category,
                description,
                price,
                stock,
                status,
            },
            { new: true }
        );
        if (!product) throw new Error("item doesn't exit");
        res.status(200).json({ status: "success", data: product });
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { isDeleted: true }
        );
        if (!product) throw new Error("No item found");
        res.status(200).json({ status: "success" });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

productController.checkStock = async (item) => {
    //내가 사려는 아이템의 실제 재고 가져오기
    const product = await Product.findById(item.productId);
    //내가 사려는 개수랑 재고 비교하기
    if (product.stock[item.size] < item.qty) {
        return {
            isVerify: false,
            message: `${product.name}의  ${item.size}사이즈 재고가 부족합니다.`,
        };
    }
    //괜찮으면 재고에서 qty빼고 성공
    const newStock = { ...product.stock };
    newStock[item.size] -= item.qty;
    product.stock = newStock;
    await product.save();
    return { isVerify: true };
};

productController.checkItemListStock = async (itemList) => {
    const insufficientStockItems = [];
    await Promise.all(
        itemList.map(async (item) => {
            const stockCheck = await productController.checkStock(item);
            if (!stockCheck.isVerify) {
                insufficientStockItems.push({
                    item,
                    message: stockCheck.message,
                });
            }
            return stockCheck;
        })
    );

    return insufficientStockItems;
};

module.exports = productController;
