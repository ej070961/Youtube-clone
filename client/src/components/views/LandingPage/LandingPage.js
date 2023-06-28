import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();
  useEffect(()=>{
    axios.get('/api/hello')
    .then(response=>console.log(response.data))
  }, [])

  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response=>{
      if(response.data.success){
        navigate('/login')
      }else{
        alert('로그아웃 실패')

      }
    })
  }

  return (
    <div>LandingPage
      <button onClick={onClickHandler}>
        logout
      </button>
    </div>
  )
}

export default LandingPage