import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

export default function (props) {
  const history = useHistory()
  useEffect(()=>{
    if (firebase.auth().currentUser) {
      props.onUserLogin(firebase.auth().currentUser)
      history.push('dashboard', '')
    } else {
      history.push('login', '')
      firebase.auth().onAuthStateChanged((user)=>{
        if (!user) {
          history.push('login', '')
        } else {
          props.onUserLogin(firebase.auth().currentUser)
          history.push('dashboard', '')
        }
      });
    }
  }, [])
  return null
}