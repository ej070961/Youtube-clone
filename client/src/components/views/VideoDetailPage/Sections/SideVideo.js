import React, {useEffect, useState} from 'react'
import axios from 'axios'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(()=>{
        axios.get('/api/video/getVideos')
          .then(response => {
            if (response.data.success) {
                setsideVideos(response.data.videos) //Video 배열에 데이터 담아주기 
            } else {
                alert('비디오 가져오기를 실패 했습니다. ')
            }
           })
    
      })

    const renderSideVideo = sideVideos.map((video, index)=>{
      
        var minutes = Math.floor(video.duration/60);//러닝타임 minute 계산 
        var seconds = Math.floor((video.duration - minutes*60)); //러닝타임 seconds 계산 

        return <div key={index} style={{display:'flex', marginBottom:'1rem', padding: '0 2rem'}}>
            {/*왼쪽 이미지 부분 */}
            <div style={{width: '40%', marginRight: '1rem'}}>
                <a href={`/video/${video._id}`}>
                    <img style={{width:'100%', height: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail'/>
                </a>
            </div>
            {/*오른쪽 비디오 정보 부분 */}
            <div style={{width:'50%'}}>
                <a href={`/video/${video._id}`} style={{color:'gray'}}>
                    <span style={{fontsize:'1rem', color: 'black'}}>{video.title}</span><br/>
                
                    <span>{video.writer.name}</span><br/>
                    <span>{video.views} views</span><br/>
                    <span>{minutes}:{seconds}</span><br/>
                </a>

            </div>

        </div>
    
        
    })
    return(
        <React.Fragment>
            <div style={{marginTop:'3rem'}}/>
            {renderSideVideo}
        </React.Fragment>
    )
    
    }

export default SideVideo