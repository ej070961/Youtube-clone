import React, { useState, useEffect } from 'react'
import {Tooltip} from 'antd';
import Icon, { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled} from '@ant-design/icons';
import Axios from 'axios';

function LikeDislikes(props){

    const [ Likes, setLikes] = useState(0) //좋아요 수를 담기 위한 변수 
    const [ Dislikes, setDislikes] = useState(0) //좋아요 수를 담기 위한 변수 
    const [LikeAction, setLikeAction] = useState(null) //이미 좋아요를 눌렀을 시 상태를 표시하기 위한 변수 
    const [DislikeAction, setDislikeAction] = useState(null) //이미 좋아요를 눌렀을 시 상태를 표시하기 위한 변수 
    let variable = {}
    //props가 video일경우
    if(props.video) {
        variable = {videoId: props.videoId, userId: props.userId}

    }else{ //props가 comment일경우
        variable = {commentId: props.commentId , userId: props.userId}
    }

    useEffect(()=>{
        Axios.post('/api/like/getLikes', variable)
        .then(response=>{
            if(response.data.success){
               //얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)

               //내가 이미 그 좋아요를 눌렀는지
                response.data.likes.map(like=>{
                    if(like.userId===props.userId){ //likes 데이터에 해당 유저의 id가 있다면, 해당 유저가 이미 좋아요를 누른 것 
                        setLikeAction('liked')
                    }
                })
            }else{
                alert('Likes에 대한 정보를 가져오는데 실패하였습니다.')
            }
        })
        Axios.post('/api/like/getDislikes', variable)
        .then(response=>{
            if(response.data.success){
               //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)

               //내가 이미 그 싫어요를 눌렀는지
                response.data.dislikes.map(dislike=>{
                    if(dislike.userId===props.userId){ //dislikes 데이터에 해당 유저의 id가 있다면, 해당 유저가 이미 싫어요를 누른 것 
                        setDislikeAction('disliked')
                    }
                })
            }else{
                alert('Dislike에 대한 정보를 가져오는데 실패하였습니다.')
            }
        })
    },[])

    const onLike = () => {

        if(LikeAction === null){
        //Like 버튼이 클릭이 안되어 있을 때 버튼을 누르면 좋아요 수 1 증가 
            Axios.post('/api/like/upLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(Likes+1)
                        setLikeAction('liked')

                        if(DislikeAction!==null){//Dislike버튼이 클릭이 되어있었을 경우 
                            setDislikeAction(null)
                            setDislikes(Dislikes-1)
                        }
                    }
                })
        }else{
            //Like 버튼이 클릭이 되어 있을 때 버튼을 누르면 좋아요 수 1 감소
            Axios.post('/api/like/unLike', variable)
                .then(response=>{
                    if(response.data.success){
                        setLikes(Likes-1)
                        setLikeAction(null)
                    }
                })

        }
    }

    const onDislike = () => {

        if(DislikeAction === null){
        //Dislike 버튼이 클릭이 안되어 있을 때 버튼을 누르면 싫어요 수 1 증가 
            Axios.post('/api/like/upDislike', variable)
                .then(response=>{
                    if(response.data.success){
                        setDislikes(Dislikes+1)
                        setDislikeAction('disliked')

                        if(LikeAction!==null){//like버튼이 클릭이 되어있었을 경우 
                            setLikeAction(null)
                            setLikes(Likes-1)
                        }
                    }
                })
        }else{
            //Dislike 버튼이 클릭이 되어 있을 때 버튼을 누르면 싫어요 수 1 감소
            Axios.post('/api/like/unDislike', variable)
                .then(response=>{
                    if(response.data.success){
                        setDislikes(Dislikes-1)
                        setDislikeAction(null)
                    }
                })

        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {/* LikeAction 상태에 따라 다른 아이콘을 렌더링 */}
                    {LikeAction === 'liked' ? <LikeFilled onClick={onLike} /> : <LikeOutlined onClick={onLike}/>}
                </Tooltip>
            <span style={{paddingLeft: '8px', cursor: 'auto'}}> {Likes} </span> {/* 좋아요수*/}
            </span>
            
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    {/* DislikeAction 상태에 따라 다른 아이콘을 렌더링 */}
                    {DislikeAction === 'disliked' ? <DislikeFilled onClick={onDislike} /> : <DislikeOutlined onClick={onDislike}  />}
                </Tooltip>
            <span style={{paddingLeft: '8px', cursor: 'auto'}}> {Dislikes} </span> {/* 싫어요수*/}
            </span>
        </div>
    )
    
}



export default LikeDislikes