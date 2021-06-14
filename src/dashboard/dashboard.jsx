import React, { useEffect, useState, useMemo } from 'react'

export default function () {
  let [currentUser, setCurrentUser] = useState(null)
  let [allChannels, setAllChannels] = useState(null)
  useEffect(()=>{
    let database = firebase.database().ref(`/users/${sessionStorage.getItem('uid')}`);
    database.get().catch((error)=>{
      console.error(error)
    })
    database.on('value', (snapshot) => {
      setCurrentUser(snapshot.val());
    });
    firebase.database().ref(`/channels`).on('value', (snapshot)=>{
      setAllChannels(snapshot.val())
    })
  }, [])
  useEffect(()=>{
    if (currentUser) {
      let {channels} = currentUser
      //firebase.functions().useEmulator('localhost', '5001')
      var refresh = firebase.functions().httpsCallable('refresh');
      refresh({channels}).then((result) => {console.log(result)});
    }
  }, [currentUser])
  let userChannels = useMemo(()=>{
    let array = []
    if (currentUser && currentUser.channels && allChannels) {
      array = currentUser.channels
    }
    return array.map((id)=>{
      return allChannels[id]
    })
  }, [currentUser, allChannels])
  function addPodcastToUsr (key) {
    if (!currentUser.channels || currentUser.channels.indexOf(key) === -1) {
      firebase.database().ref(`/users/${sessionStorage.getItem('uid')}`).set({
        ...currentUser,
        channels: [...currentUser.channels || [], key]
      })
    }
  }
  function addUrl () {
    let url = window.prompt("Add URL")
    let key = ''
    Object.keys(allChannels).forEach((k)=>{
      if (allChannels[k].url === url) {
        key = k
      }
    })
    if (!key) {
      //firebase.functions().useEmulator('localhost', '5001')
      const add = firebase.functions().httpsCallable('add');
      add({url}).then(result=>{
        let id = Object.keys(result)[0]
        addPodcastToUsr(id)
      })
    } else {
      addPodcastToUsr(key)
    }
  }
  return <div>
    {currentUser?currentUser.displayName:'loading'}
    <button onClick={addUrl}>Add a new podcast</button>
    {userChannels.map(channel=>{
      let {meta} = channel
      return <div>
        <img src={meta.imageURL} width={300} />
        <div>{meta.title}</div>
      </div>
    })}
  </div>
}