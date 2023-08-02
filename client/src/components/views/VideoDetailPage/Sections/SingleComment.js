import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';
const {textarea} = Input;

function SingleComment(props) {

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const handleComment = (event) =>{
        setCommentValue(event.currentTarget.value);
    }
    
    const onSubmitHandler = (event) => {
        event.preventDefault(); //아무것도 안쓰고 submit 버튼 눌렀을 때, 화면이 refresh 되지 않도록 함 

        const variables = {
            content: CommentValue,
            writer: localStorage.getItem("userId"),
            videoId: props.videoId, //Comment.js에서 props로 넘겨준 videoId 
            responseTo: props.comment._id //Comment.js에서 porps로 넘겨준 코멘트의 id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.result);
                    props.refreshFunction(response.data.result)
                    setCommentValue("")
                    setOpenReply(false)

                }else{
                    alert('댓글 저장에 실패했습니다. ')
                }
            })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            {/*Comment.js에서 넘겨받은 comment props로 정보 매핑 */}
            <Comment    
                actions={actions}
                author={props.comment.writer.name}
                avatar = {<Avatar src={props.comment.writer.image} alt/>}
                content={<p>{props.comment.content}</p>}
            />

            {/*Comment Form - OpenReply가 true일때만 보일 수 있게 함 */}
            { OpenReply && <form style={{display:'flex'}}>
                    <textarea
                        style={{width:'100%', borderRadius:'5px'}}
                        onChange={handleComment}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요"/>
                    <br/>
                    <button style={{width:'20%', height:'52px'}} onClick={onSubmitHandler}>Submit</button>
                </form>
            }
        </div>
    )

}

export default SingleComment