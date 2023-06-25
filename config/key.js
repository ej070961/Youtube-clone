if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}//노드 환경 변수가 production(배포 후)일 경우 module export를 prod 파일 사용, development(배포 전)일 경우 module export를 dev파일 사용 