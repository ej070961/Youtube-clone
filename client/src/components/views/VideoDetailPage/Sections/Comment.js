import React,{useState} from 'react'
import Axios from 'axios';
import {useParams} from 'react-router-dom'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
function Comment(props) {

    const videoId = props.videoId; //App.js 라우트 파라미터에 있는 videoId를 가져옴 
    const [commentValue, setcommentValue] = useState("")


    //handleChange function
    const handleComment = (event) =>{
        setcommentValue(event.currentTarget.value);
    }


    const onSubmitHandler = (event)=>{
        event.preventDefault(); //아무것도 안쓰고 submit 버튼 눌렀을 때, 화면이 refresh 되지 않도록 함 \

        const variables = {
            content: commentValue,
            writer: localStorage.getItem("userId"),
            videoId: videoId
        }
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success){
                    console.log(response.data.result);
                    
                    props.refreshFunction(response.data.result)
                }else{
                    alert('댓글 저장에 실패했습니다. ')
                }
            })
    }
    return (
        <div>
            <br/>
            <p>Replies</p>
            <hr/>
            {/*Comment Lists - commentList가 있으면, singleComment 매핑 */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={videoId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} videoId={videoId} commentLists={props.commentLists}/>
                    </React.Fragment>
                ) //responseTo가 없는 comment만 출력 
               
            ))}
            
            {/*Root Comment Form */}
            <form style={{display:'flex'}}>
                <textarea
                    style={{width:'100%', borderRadius:'5px'}}
                    onChange={handleComment}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"/>
                <br/>
                <button style={{width:'20%', height:'52px'}} onClick={onSubmitHandler}>Submit</button>
            </form>

            
        </div>
    )
    }

    export default Comment