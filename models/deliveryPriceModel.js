const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const deliveryPriceSchema = new Schema({
location: { 
    type: String, 
    required: true,
    enum: ['within Abuja', 'within Nigeria', 'outside Nigeria']

},
NGNprice: { 
    type: Number, 
    required: true 
},
USDprice: { 
    type: Number, 
    required: true 
},
});

const DeliveryPrice = model('DeliveryPrice', deliveryPriceSchema);
module.exports = {DeliveryPrice}
