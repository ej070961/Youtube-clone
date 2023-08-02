const express = require('express') //express 모듈 가져옴 
const app = express() //새로운 express 앱을 만듬
const port = 5000 //포트번호 설정
const bodyParser = require('body-parser') //body-parser 모듈 불러오기 
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');

// const {auth} = require('./middleware/auth.js');
// const { User } = require("./models/User.js"); //User 모델 불러오기 

const mongoose = require('mongoose') //mongoose이용해 mongo db 연결 
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')) //연결이 잘되었으면 console 띄워주기 
  .catch(err => console.log(err)) //에러 발생하면 에러 띄워주기 

//application/x-www-form-urlencoded 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.urlencoded({extended: true}));
//application/json 해당 형식의 데이터를 분석해서 가져올 수 있게 해줌 
app.use(bodyParser.json());

app.use(cookieParser()) //cookie-parser을 사용할 수 있게 해줌 

//먼저 client로부터 request가 오면 index.js로 넘어오고, 해당되는 라우트로 이동함 
app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) //port를 listen 하면 console이 print됨 
})