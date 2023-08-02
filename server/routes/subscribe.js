const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================



router.post('/subscribeNumber', (req, res)=>{

  Subscriber.find({'userTo':req.body.userTo})
  .exec()
  .then((subscribe)=>{
    return res.status(200).json({success:true, subscribeNumber: subscribe.length}); 
    //성공하면 구독하는 케이스 정보가 나옴, 몇개의 케이스인지 클라이언트에게 전달
    })
    .catch((err)=>{
        console.log(err)
        return res.status(400).send(err)
    });
        
            
})

router.post('/subscribed', (req, res)=>{

    Subscriber.find({'userTo':req.body.userTo, 'userFrom': req.body.userFrom})
    .exec()
    .then((subscribe)=>{
         //성공하면 구독하는 케이스 정보가 나옴, 1개의 케이스만 있어도 해당 유저가 비디오를 작성한 사람을 구독하고 있는 것임
         let result = false //length가 0이면 구독하고 있지 않는 것임 
         if(subscribe.length !== 0 ){
            result = true
         }
        return res.status(200).json({success:true, subscribed: result}); 
     
    })
    .catch((err)=>{
        return res.status(400).send(err)
    });
         
              
  })

  router.post('/Subscribe', (req, res)=>{

    //데이터베이스에 userTo와 userFrom 저장해야함
    //Subscriber 인스턴스 생성
    const subscribe = new Subscriber(req.body)

    //save는 mongoose 기능으로 subscriber에 데이터를 저장함
    subscribe.save().then(() => {
        return res.status(200).json({
            success:true
        }) // status(200)은 성공했다는 뜻임
    }).catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })          
              
  })

  router.post('/unSubscribe', (req, res)=>{

    //db에서 userTo, userFrom 데이터를 찾아서 삭제함  
    Subscriber.findOneAndDelete({userTo: req.body.userTo, userFrom: req.body.userFrom})
        .exec()
        .then((doc)=>{
            //성공하면 클라이언트에게 정보 전달 
           return res.status(200).json({success:true, doc});   
       })
       .catch((err)=>{
           return res.status(400).send(err)
       }); 
  })



module.exports = router;