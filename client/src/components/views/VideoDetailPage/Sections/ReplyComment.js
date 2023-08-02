import React, {useEffect, useState} from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(()=>{
        let commentNumber = 0;
        props.commentLists.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber++;
            }
        })
        setChildCommentNumber(commentNumber);
    }, [props.commentLists])//commentList가 바뀔 때마다 재 렌더링 

    const renderReplyComment = (parentCommentId) => (
        props.commentLists.map((comment, index) => (
            <React.Fragment>
            {comment.responseTo===parentCommentId &&
                <div style={{width:'80%', marginLeft:'40px'}}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={props.videoId}/>
                    <ReplyComment parentCommentId={comment._id} videoId={props.videoId} commentLists={props.commentLists}/>
                </div>
            }
            </React.Fragment>
        )
    ))

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        <div>
             {/*자식 댓글 수가 0보다 크면 View 1 more comment 렌더링 */}
            {ChildCommentNumber > 0 &&  
                <p style={{fontSize: '14px', margin: 0, color: 'gray'}} onClick={onHandleChange}>
                    View 1 more comment(s)
                </p>
            }
            {/*OpenReplyComments가 true 이면, replycomment 렌더링 */}
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment