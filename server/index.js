const express = require('express') //express 모듈 가져옴 
const app = express() //새로운 express 앱을 만듬
const port = 5000 //포트번호 설정
const bodyParser = require('body-parser') //body-parser 모듈 불러오기 
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');

const {auth} = require('./middleware/auth.js');
const { User } = require("./models/User.js"); //User 모델 불러오기 

//application/x-www-form-urlencoded 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.urlencoded({extended: true}));
//application/json 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.json());

app.use(cookieParser()) //cookie-parser을 사용할 수 있게 해줌 

const mongoose = require('mongoose') //mongoose이용해 mongo db 연결 
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')) //연결이 잘되었으면 console 띄워주기 
  .catch(err => console.log(err)) //에러 발생하면 에러 띄워주기 


app.get('/', (req, res) => {
  res.send('Hello World! 아임 은지~~') //hello world를 출력되게함
})

app.get('/api/hello', (req, res)=>{
  res.send('안녕하세요')
})

//회원가입을 위한 register route 만들기 > post function (end point, callback function 구조)
app.post('/api/users/register', (req, res) => {

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
app.post('/api/users/login', (req, res)=>{
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
app.get('/api/users/auth',auth,(req, res)=>{

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
app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({_id: req.user._id},
    {token: ""})//토큰을 지워줌 
    .then(() =>{
      return res.status(200).send({success: true})
    })
    .catch((err)=> {
      return res.json({success: false, err})
    })
  

}) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) //port를 listen 하면 console이 print됨 
})