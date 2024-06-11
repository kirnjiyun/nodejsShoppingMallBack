const orderController = {};
const Order = require("../models/Order");
const { generateRandomString } = require("../utils/randomStringGenerator"); // 객체 구조 분해를 통해 함수 가져오기
const productController = require("./product.controller");

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { shipTo, contact, orderList } = req.body;
        // 재고 확인 및 업데이트
        const insufficientStockItems =
            await productController.checkItemListStock(orderList);
        // 재고 부족하면 에러 발생
        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce(
                (total, item) => `${total}${item.message}\n`,
                ""
            );
            throw new Error(errorMessage);
        }
        // 주문 생성
        const newOrder = new Order({
            userId,
            shipTo,
            contact,
            items: orderList,
            orderNum: generateRandomString(10), // 올바른 함수 호출
        });
        await newOrder.save();
        //카트 비우기

        res.status(200).json({
            status: "success",
            orderNum: newOrder.orderNum,
        });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

module.exports = orderController;
