import React, { useEffect, useState} from 'react'
import Axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(()=>{

        //해당 비디오를 작성한 사람의 구독자 수 정보 요청 
        //비디오를 작성한 사람의 id를 서버로 보내 해당 유저를 구독한 사람이 얼마나 되는지 정보를 얻음
        let variable = {userTo: props.userTo}

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber);
                }
                else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        //해당 유저를 구독하는지 정보 요청
        //나의 유저 id와 비디오를 작성한 유저의 id를 서버로 보내 정보를 얻음 
        let subscribedVariable = {userTo: props.userTo, userFrom: props.userFrom }
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                }
                else{
                    alert('정보를 받아오지 못했습니다.')
                }
            })

    },[])

    const onSubscribe = () => {

        let subscribedVariable = {
            userTo: props.userTo, 
            userFrom: props.userFrom
        }
        //이미 구독 중이라면
        if(Subscribed){

            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response=>{
                    if(response.data.success){
                        setSubscribeNumber(SubscribeNumber-1)
                        setSubscribed(!Subscribed)

                    }else{
                        alert('구독 취소 하는데 실패 했습니다.')
                    }
                })
            
        }else{
            Axios.post('/api/subscribe/Subscribe', subscribedVariable)
            .then(response=>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber+1)
                    setSubscribed(!Subscribed)

                }else{
                    alert('구독 하는데 실패 했습니다.')
                }
            })

        }

    }

    return (
        <div>
            <button
                style={{
                    backgroundColor:  `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                    borderRadius: '4px', color: 'white',
                    padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe} //클릭 시 onSubscribe 함수 호출
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'} {/*Subscribed가 true: Subscribed, false: Subscribe}*/}
            </button>
        </div>
    )
}

export default Subscribe