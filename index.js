const express = require('express') //express 모듈 가져옴 
const app = express() //새로운 express 앱을 만듬
const port = 3000 //포트번호 설정

const mongoose = require('mongoose') //mongoose이용해 mongo db 연결 
mongoose.connect('mongodb+srv://ej070961:070961@sample.wfta6tb.mongodb.net/',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...')) //연결이 잘되었으면 console 띄워주기 
  .catch(err => console.log(err)) //에러 발생하면 에러 띄워주기 


app.get('/', (req, res) => {
  res.send('Hello World!') //hello world를 출력되게함
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) //port를 listen 하면 console이 print됨 
})