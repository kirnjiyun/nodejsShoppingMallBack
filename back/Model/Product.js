const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        level: { type: string, default: "customer" },
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
