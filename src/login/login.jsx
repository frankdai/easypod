import React, { useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom';
export default function ({setCurrentUser}) {
  const history = useHistory()
  useEffect(()=>{
    if (firebase.auth().currentUser) {
      history.push('dashboard', '')
    } else {
      firebase.auth().onAuthStateChanged((user)=>{
        if (user) {
          let databaseRef = firebase.database().ref(`/users/${user.uid}`)
          databaseRef.get().catch((error)=>{
            console.error(error)
            /*let {photoURL, displayName, email} = user
            firebase.database().ref(`/users/${sessionStorage.getItem('uid')}`).set({
              photoURL,
              displayName,
              email
            })*/
          }).finally(()=>{
            let {photoURL, displayName, email} = user
            sessionStorage.setItem('uid', user.uid)
            setCurrentUser({photoURL, displayName, email})
            history.push('dashboard', '')
          })
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