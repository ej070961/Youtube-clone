import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import {loginUser} from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import Auth from '../../../hoc/auth';

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value) //state를 바꿔줌
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault(); //이걸 쓰지 않으면 버튼을 누를 때마다 페이지가 refresh가 되어버림
   
    //서버에 보내고자 하는 값을 state에서 가지고 있음 
    let body = {
      email:Email,
      password: Password
    }

    dispatch(loginUser(body)) //loginUser라는 액션에 body를 넣어줌 
      .then(response => {
        if(response.payload.loginSuccess){
          localStorage.setItem('userId', response.payload.userId) //localStorage에 userId를 저장
          navigate('/')
        }else{
          alert('Error')
        }
      })

    
  }
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      width: '100%', height: '100vh'      
    }}>
      <form style={{display:'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}
        >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}/>

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}/>

        <br />
        <button>
          Login 
        </button>
      </form>
    
    </div>
  )
}

export default Auth(LoginPage, null)