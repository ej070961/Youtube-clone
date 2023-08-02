const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    
    writer: {
        type:Schema.Types.ObjectId, //id를 이용해 User 모든 정보를 읽을 수 있음
        ref: 'User' //User 모델 참조 
    },
    title: {
        type:String,
        maxlength:50,
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number,
    },
    filePath : {
        type: String,
    },
    catogory: String,
    views : {
        type: Number,
        default: 0 
    },
    duration :{
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true })

const Video = mongoose.model('Video', videoSchema);

module.exports = {Video}