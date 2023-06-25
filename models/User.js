const mongoose = require('mongoose');

//mongoose를 이용해 schema 생성 
const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim:true, //space 공백을 없애주는 역할
        unique: 1 //unique한 값이어야함 
    },
    password:{
        type: String,
        maxlength: 50
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },//관리자인지 일반 사용자인지 role 지정 
    image: String,
    token:{
        type: String //토큰 관리
    },
    tokenExp:{
        type: Number //토큰 사용할 수 있는 기간 설정 
    }

})//하나하나의 필드 작성

const User = mongoose.model('User', userSchema) //스키마를 모델로 감싸줌

module.exports = {User}
//모델을 다른 곳에서도 쓸 수 있게 export 해줌 