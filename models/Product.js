const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
    //!!!!!오타 주의 !!!!
    //!!!!!오타 주의 !!!!
    //!!!!!오타 주의 !!!!
    //!!!!!오타 주의 !!!!
    //!!!!!오타 주의 !!!!
    //!!!!!오타 주의 !!!!
    {
        sku: { type: String, required: true, unique: true },
        name: { type: String, require: true },
        image: { type: String, require: true },
        category: { type: Array, require: true },
        description: { type: String, require: true },
        price: { type: Number, require: true },
        stock: { type: Object, require: true },
        status: { type: String, default: "active" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
productSchema.methods.toJSON = function () {
    const obj = this._doc;

    delete obj.__V;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
