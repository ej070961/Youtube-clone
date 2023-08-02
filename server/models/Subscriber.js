const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo:{
        type: Schema.Types.ObjectId, //id를 이용해 User 모든 정보를 읽을 수 있음
        ref: 'User' //User 모델을 참조함 
    },
    userFrom:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
    
    
}, { timestamps: true })

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = {Subscriber}