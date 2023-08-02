const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Comment
//=================================



router.post('/saveComment', (req, res)=>{

    const comment = new Comment(req.body);

    comment.save().then(() => {
        //성공 시 저장된 comment id를 이용해 정보를 검색하여 유저의 모든 정보까지 가져옴 
        Comment.find({"_id" : comment._id})
            .populate('writer')
            .exec()
            .then((result)=>{
                res.status(200).json({success: true, result})
            })
            .catch((err)=>{
                return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
            })          
    }).catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })          
        
})


router.post('/getComments', (req, res)=>{

    //Comment 모델에서 videoId를 가지고 모든 데이터를 찾음 
   Comment.find({"videoId": req.body.videoId})  
   .populate('writer')
   .exec()
   .then((comments)=>{
        return res.status(200).json({success: true, comments})
    })
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })    
        
})




module.exports = router;