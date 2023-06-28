const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){
    var user = this; //각 user 필드 정보 다 가져옴 

    if(user.isModified('password')){ //비밀번호를 변경할 때만 암호화하게 조건문을 추가 
        //비밀번호를 암호화 시킨다.
        //salt 생성 함수 
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash //암호화된 비밀번호를 hash로 바꿔줌
                next()
            });
        });
    }else{
        next()
    }

}) //user정보 save 하기 전에 함수를 실행하게함, 다 하면, next()를 통해 save()로 다시 넘겨줌 

//비밀번호 비교 메소드 만들기 
userSchema.methods.comparePassword = function(plainPassword, cb){

    //plainPassword 1234567 암호화된 비밀번호 $2b$10$9GIQPJhSJ5kzbZ133.Qm4e3ZyJW0Kri2TfQa84bOr84fcsmqjDa8e
    //plain을 암호화해서 db에 있는 암호화된 비밀번호와 같은지 확인해야함 > bcrypt로 암호화
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

//토큰 생성 메소드 만들기 
userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용해서 토큰 생성 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token //토큰을 db에 저장 
    user.save().then(() => {
        return cb(null, user)
    }).catch((err)=>{
        return cb(err)  
    }) 

}

//토큰 찾는 메소드 만들기
userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode 한다.(jsonwebtoken 메소드 이용)
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        //mongodb 메소드 이용
        user.findOne({"_id": decoded, "token": token})
        .then(user=>{
            cb(null, user);
        })
        .catch((err)=>{
            return cb(err);
        })

    });
}

const User = mongoose.model('User', userSchema) //스키마를 모델로 감싸줌

module.exports = {User}
//모델을 다른 곳에서도 쓸 수 있게 export 해줌 