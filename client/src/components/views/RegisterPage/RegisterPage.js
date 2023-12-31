import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import {registerUser} from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import Auth from '../../../hoc/auth';

function RegisterPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value) //state를 바꿔줌
      }

    const onNameHandler = (event) => {
     setName(event.currentTarget.value) //state를 바꿔줌
    }

    const onPasswordHandler = (event) => {
     setPassword(event.currentTarget.value) //state를 바꿔줌
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value) //state를 바꿔줌
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //이걸 쓰지 않으면 버튼을 누를 때마다 페이지가 refresh가 되어버림
       
        if(Password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        //서버에 보내고자 하는 값을 state에서 가지고 있음 
        let body = {
          email:Email,
          password: Password,
          name: Name

        }
    
        dispatch(registerUser(body)) //loginUser라는 액션에 body를 넣어줌 
          .then(response => {
            if(response.payload.success){
              navigate('/login')
            }else{
              alert('Failed to sighn up')
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
  
          <label>Name</label>
          <input type="text" value={Name} onChange={onNameHandler}/>
  
          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler}/>

          <label>Confirm Password</label>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>

          <br />

          <button>
            회원가입 
          </button>
        </form>
      
      </div>
  )
}

export default Auth(RegisterPage, false)