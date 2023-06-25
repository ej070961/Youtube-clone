const express = require('express') //express 모듈 가져옴 
const app = express() //새로운 express 앱을 만듬
const port = 3000 //포트번호 설정
const bodyParser = require('body-parser') //body-parser 모듈 불러오기 

const config = require('./config/key.js');

const { User } = require("./models/User"); //User 모델 불러오기 

//application/x-www-form-urlencoded 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.urlencoded({extended: true}));
//application/json 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.json());

const mongoose = require('mongoose') //mongoose이용해 mongo db 연결 
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')) //연결이 잘되었으면 console 띄워주기 
  .catch(err => console.log(err)) //에러 발생하면 에러 띄워주기 


app.get('/', (req, res) => {
  res.send('Hello World! 아임 은지~~') //hello world를 출력되게함
})

//회원가입을 위한 register route 만들기 > post function (end point, callback function 구조)
app.post('/register', (req, res) => {

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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) //port를 listen 하면 console이 print됨 
})