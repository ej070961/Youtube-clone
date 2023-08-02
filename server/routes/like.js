const express = require('express');
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");
const { auth } = require("../middleware/auth");

//=================================
//             Like
//=================================



router.post('/getLikes', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
    .exec()
    .then((likes)=>{
        return res.status(200).json({success: true, likes})
    })
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })    
        
})

router.post('/getDislikes', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
    .exec()
    .then((dislikes)=>{
        return res.status(200).json({success: true, dislikes})
    })
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })    
        
})

router.post('/upLike', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    //Like collection에 클릭 정보를 넣어줌

    const like = new Like(variable)
    like.save()
    .then((likeResult)=>{
        // 만약에 DisLike에 이미 클릭이 되었다면, Dislikes에 있는 데이터를 찾아 삭제함
        Dislike.findOneAndDelete(variable)
        .exec()
        .then((dislikeResult)=>{
            res.status(200).json({success: 'true'})
        })
        .catch((err)=>{
            return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
        }) 
    }
    )
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })   

    

        
})

router.post('/unLike', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    Like.findOneAndDelete(variable)
    .exec()
    .then((result)=>{
        res.status(200).json({success: 'true'})
    })
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    }) 

    

        
})

router.post('/unDislike', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    Dislike.findOneAndDelete(variable)
    .exec()
    .then((result)=>{
        res.status(200).json({success: 'true'})
    })
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    }) 

    

        
})

router.post('/upDislike', (req, res)=>{

    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    }else{
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    //Dislike collection에 클릭 정보를 넣어줌

    const dislike = new Dislike(variable)
    dislike.save()
    .then((dislikeResult)=>{
        // 만약에 Like에 이미 클릭이 되었다면, like에 있는 데이터를 찾아 삭제함
        Like.findOneAndDelete(variable)
        .exec()
        .then((likeResult)=>{
            res.status(200).json({success: 'true'})
        })
        .catch((err)=>{
            return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
        }) 
    }
    )
    .catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    })   
        
})






module.exports = router;