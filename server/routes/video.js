const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

const { Video } = require("../models/Video");
const { Subscriber} = require("../models/Subscriber");

const { auth } = require("../middleware/auth");

//=================================
//             Video
//=================================

//config 옵션 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') //파일을 올리면 'uploads'라는 폴더에 저장됨 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`) //저장할 때 어떠한 파일 이름으로 저장할 건지 설정 (날짜_파일이름 )
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname) //파일은 mp4형식의 파일만 업로드 가능하도록 설정 
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

//multer에 config 옵션을 넣음, 파일은 하나만 할수 있게함 
var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req, res)=>{
    //비디오를 서버에 저장함
    //multer 이용 
    upload(req, res, err =>{
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, filePath:res.req.file.path, fileName:res.req.file.filename})//저장성공시 파일 경로, 파일 이름 응답 
    })
})

router.post("/thumbnail", (req, res) => {
    //썸네일 생성하고 비디오 러닝타임도 가져오기 
    let thumbsFilePath ="";
    let fileDuration ="";

    //비디오 정보 가져오기 
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    //썸네일 생성 
    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        }) //uploads/thumbnails/경로로 썸네일 저장 
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        }) //썸네일 생성이 끝나면 응답 보냄 
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        }); //썸네일 개수, 사이즈 및 파일 이름 설정 

});

router.post('/uploadVideo', (req, res)=>{

    //비디오 정보들을 저장한다.
    const video = new Video(req.body);

    video.save().then(() => {
        return res.status(200).json({
            success:true
        }) // status(200)은 성공했다는 뜻임
    }).catch((err)=>{
        return res.json({sucess: false, err}) //에러가 나면, json 형식으로 client에 출력 
    }) //save는 mongodb 기능으로 video collection에 데이터를 저장함 
})

router.get('/getVideos', (req, res)=>{

    //비디오를 DB에서 가져와서 클라이언트에게 보낸다.
    Video.find() //비디오 collection에 있는 모든 비디오를 가져옴 
        .populate('writer') //모든 writer의 user 정보를 가져옴 
        .exec()
        .then((videos)=>{
            return res.status(200).json({success:true, videos});

        })
        .catch((err)=>{
            return res.status(400).send(err)
        });
       
            
})

router.post('/getVideoDetail', (req, res)=>{

   Video.findOne({"_id":req.body.videoId}) //클라이언트에서 보낸 request body에 있는 videoId를 이용해 비디오를 찾음 
    .populate('writer') //populate함수를 통해 유저의 모든 정보를 가져올 수 있음 
    .exec() //쿼리를 execution
    .then((videoDetail)=>{
        return res.status(200).json({success:true, videoDetail}); //성공하면 비디오 디테일 정보를 클라이언트에게 보냄 

    })
    .catch((err)=>{
        console.log(err)
        return res.status(400).send(err)
    });
       
            
})

router.post('/getSubscriptionVideos', (req, res)=>{

   //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
   Subscriber.find({userFrom: req.body.userFrom}) //Subscriber collection 이용 
   .exec() //쿼리 실행 
   .then((subscriberInfo)=>{
        let subscribedUser = []; //userTo 데이터를 담을 어레이 생성
         subscriberInfo.map((subscriber, i)=>{ //map method를 이용해 userTo 정보 배열에 담기 
            subscribedUser.push(subscriber.userTo);
         })
        //  console.log(subscribedUser);

        //찾은 사람들의 비디오를 가지고 온다. 
        Video.find({writer: {$in: subscribedUser}}) //$in을 이용해 여러개의 데이터가 담긴 데이터를 모두 찾을 수 있음 
        .populate('writer')
        .exec()
        .then((videos)=>{
            return res.status(200).json({success: true, videos})
        
        })
        .catch((err)=>{
        console.log(err)
        return res.status(400).send(err)
        });
         
    })

   .catch((err)=>{
    console.log(err)
    return res.status(400).send(err)
    });

})   



module.exports = router;