const cartController = {};
const Cart = require("../models/Cart");

cartController.addItemToCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, size, qty } = req.body;

        // userId가 유효한지 확인
        if (!userId) {
            return res
                .status(400)
                .json({ status: "fail", error: "유효하지 않은 사용자입니다." });
        }

        // 유저 가지고 카트 찾기
        let cart = await Cart.findOne({ userId: userId });

        // 유저가 만든 카트가 없다면, 카트 만들어주기
        if (!cart) {
            cart = new Cart({ userId });
            await cart.save();
        }

        // 이미 카트에 들어가 있는 아이템인지 확인
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );
        if (existItem) {
            return res.status(400).json({
                status: "fail",
                error: "아이템이 이미 카트에 존재합니다.",
            });
        }

        // 카트에 아이템 추가
        cart.items.push({ productId, size, qty });
        await cart.save();

        res.status(200).json({
            status: "success",
            data: cart,
            cartItemQty: cart.items.length,
        });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });
        res.status(200).json({ status: "success", data: cart.items });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

module.exports = cartController;
