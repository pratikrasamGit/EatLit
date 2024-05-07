const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    order_data: {
        type: Array,
        required: true,
    },
    order_date: {
        type:Date,
        default:Date.now
    },
    payment_order_id:{
        type: String,
        required: true,
    },
    is_paid:{
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('order', OrderSchema)