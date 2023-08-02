import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Auth from '../../../hoc/auth'
import {useParams} from 'react-router-dom'
import {Row, Col, List, Avatar} from 'antd';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage() {
    
    const videoId = useParams().videoId; //App.js 라우트 파라미터에 있는 videoId를 가져옴 
    const variable = { videoId: videoId} //videoId를 변수에 담음 

    const[VideoDetail, setVideoDetail] = useState([]); //서버로부터 받아온 비디오 디테일을 담을 변수 
    const[Comments, setComments] = useState([]) //서버로부터 받아온 코멘트 정보를 담을 변수 

    useEffect(()=>{
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response=>{
                if(response.data.success){
                    setVideoDetail(response.data.videoDetail); // 서버 응답 시 비디오 디테일을 변수에 set 

                }else{
                    alert('비디오 정보를 가져오는데 실패하였습니다.')
                }
            })

        //해당 비디오 게시물의 모든 Comment 정보 가져오기 
        Axios.post('/api/comment/getComments', variable)
        .then(response=>{
            if(response.data.success){
                setComments(response.data.comments); // 서버 응답 시 비디오 디테일을 변수에 set

            }else{
                alert('코멘트 정보를 가져오는데 실패하였습니다.')
            }
        })

    },[])

    const refreshFunction = (newComment) =>{
        setComments(Comments.concat(newComment))
        
    }

    if(VideoDetail.writer){
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>
        {/*로그인한 유저와 비디오를 작성한 유저의 id가 다르면, Subscribe 컴포넌트 호출, 비디오를 작성한 사람의 id와 로그인한 유저 id 정보를 props로 넘겨줌 */}
        return (
            <div>
                <Row gutter={[16,16]}>
                    {/*Row 하나 당 24사이즈임 */}
                    <Col lg={18} xs={24}> {/*메인비디오> 화면이 가장 클때는 메인 비디오는 18사이즈 차지, 가장 작을 때는 24사이즈*/}
                    <div style={{width:'100%', padding: '3rem 4rem'}}>
                        <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        <List.Item 
                            actions={[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}/>, subscribeButton]}
                        >  {/*좋아요 싫어요 버튼과 구독 버튼*/}
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}/>
                            <div></div>
                        </List.Item>
                        {/*Comments*/}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} videoId={videoId} />
                    </div>
        
                    </Col>
                    <Col lg={6} xs={24}> {/*사이드비디오> 화면이 가장 클때는 사이드 비디오는 6사이즈, 가장 작을 때는 24사이즈*/}
                        <SideVideo/> {/*사이드비디오 컴포넌트 호출 */}
                    </Col>
                </Row>
            </div>
          )

    }else{
        <div> loading... </div>
    }
 
}

export default Auth(VideoDetailPage, null) //모두가 접근 가능해야 하므로 null 