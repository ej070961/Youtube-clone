
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux'
import {logoutUser} from '../../../../_actions/user_action'

function RightMenu(props) {
  const user = useSelector(state => state.User)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logoutUser())
    .then(response => {
      if (response.payload.success) {
        navigate("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };


  if ( user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="login">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="register">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="app">
          <a href="/video/upload">Video</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default RightMenu;