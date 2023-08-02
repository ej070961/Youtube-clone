import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Auth from '../../../hoc/auth';
import { Typography, Col, Row, Avatar} from 'antd';
import Meta from 'antd/lib/card/Meta';
import moment from 'moment';
const {Title} = Typography;


function SubscriptionPage() {

    const [Video, setVideo] = useState([])//비디오 어레이에 담기 
    
    //사용자가 구독한 비디오 데이터 가져오기 
    //useEffect > DOM이 로드되자마자 무엇을 할건지 정하는 훅 
    useEffect(()=>{

        const subscriptionVariables = {userFrom: localStorage.getItem('userId')} //local storage에 저장되어 있는 유저 아이디를 서버에 넘겨줌 

        axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
        .then(response => {
            if (response.data.success) {
                setVideo(response.data.videos) //Video 배열에 데이터 담아주기 
            } else {
                alert('구독한 비디오 가져오기를 실패 했습니다. ')
            }
        })

    })
    
    const renderCards = Video.map((video, index)=>{
        var minutes = Math.floor(video.duration/60);//러닝타임 minute 계산 
        var seconds = Math.floor((video.duration - minutes*60)); //러닝타임 seconds 계산 


        return <Col key={index} lg={6} md={8} xs={24}> 
        {/*전체 사이즈가 24인데, 가장 작을때는 column 하나가 24사이즈, middle 사이즈일때는 8사이즈로 3개의 컬럼이 보임 , 가장 클때는 6사이로 4개의 컬럼이 보임  */}
            <a href={`/video/${video._id}`} > {/*하나의 게시물 클릭 시 링크 이동*/}
            <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
            <div className="duration"
                style={{ bottom: 0, right:0, position: 'absolute', margin: '4px', 
                color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8, 
                padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                fontWeight:'500', lineHeight:'12px' }}>
                <span>{minutes} : {seconds}</span>
            </div>
            </a>
        <br/><br/>
        <Meta
            avatar={
                    <Avatar src={video.writer.image} /> //유저 이미지 
                }
            title={video.title}
            description=""
            />
        <span>{video.writer.name} </span><br />
        <span style={{ marginLeft: '3rem' }}> {video.views}Views</span> - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>


    })
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
        <Title level={2} > Recommended </Title>
        <hr />
        <Row gutter={[32,16]}> {/*1개의 row에 4개의 컬럼 */}
            {renderCards}
        </Row>
        </div>
    )
    }

export default Auth(SubscriptionPage, null)