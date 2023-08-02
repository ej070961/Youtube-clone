const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================


//회원가입을 위한 register route 만들기 > post function (end point, callback function 구조)
router.post('/register', (req, res) => {

    //회원가입할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다. 

    //User instance 생성
    const user = new User(req.body) //req.body는 json 형식으로 구성됨(body-parser덕분)

    user.save().then(() => {
        return res.status(200).json({
            success:true
        }) // status(200)은 성공했다는 뜻임
    }).catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    }) //save는 mongodb 기능으로 userInfo에 데이터를 저장함 

});

//login router 만들기 
router.post('/login', (req, res)=>{
  //요청된 이메일을 데이터베이스에서 있는지 찾는다. > mongodb에서 제공하는 findOne method 활용 
  User.findOne({email: req.body.email})
  .then(user=>{
    if(!user){ //요청한 이메일이 db에 없다면, return 
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청한 이메일이 데이터베이스에 있다면 비밀번호가 같은지 확인 
    user.comparePassword(req.body.password,(err, isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})

      //비밀번호까지 같다면 Token 생성 
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등 여러가지 방법이 있음
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
  .catch((err)=>{
    return res.status(400).send(err)
  })

})

//auth 라우트 만들기
router.get('/auth',auth,(req, res)=>{

  //여기까지 미들에워를 통과해 왔다는 얘기는 Authentication이  True 라는 말 
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false: true,
    isAuth: true, 
    email: req.user.email,
    name: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })//클라이언트에게 성공했다고 User 정보 알려주기, 이렇게 정보를 넘겨주면 어떤 페이지에서든지 user 정보를 이용할 수 있음 

})

//로그아웃 라우터 만들기 
router.get('/logout', auth, (req, res) => {

  User.findOneAndUpdate({_id: req.user._id},
    {token: ""})//토큰을 지워줌 
    .then(() =>{
      return res.status(200).send({success: true})
    })
    .catch((err)=> {
      return res.json({success: false, err})
    })
  

}) 

module.exports = router;