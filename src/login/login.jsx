import React, { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom';
export default function ({setCurrentUser}) {
  const history = useHistory()
  const onLogin = useCallback(setCurrentUser, [setCurrentUser])
  useEffect(()=>{
    if (firebase.auth().currentUser) {
      history.push('dashboard', '')
    } else {
      firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          let {pictureUrl, displayName, email} = user
          onLogin({pictureUrl, displayName, email})
          sessionStorage.setItem('uid', user.uid)
          history.push('dashboard', '')
        }
      });
      let ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            sessionStorage.setItem('uid', authResult.user.uid)
            //history.push('login', '')
            return false;
          }
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        // Other config options...
      });
    }
  }, [])
  return <div id="firebaseui-auth-container"></div>
}