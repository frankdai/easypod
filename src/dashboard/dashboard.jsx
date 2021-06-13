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
  let userChannels = useMemo(()=>{
    let array = []
    if (currentUser && currentUser.channels && allChannels) {
      array = currentUser.channels
    }
    return array.map((id)=>{
      return allChannels[id]
    })
  }, [currentUser, allChannels])
  function addUrl () {
    let url = window.prompt("Add URL")
    let key = ''
    Object.keys(allChannels).forEach((k)=>{
      if (allChannels[k].url === url) {
        key = k
      }
    })
    if (!key) {
      let updates = {};
      key = firebase.database().ref().child('channels').push().key;
      updates['/channels/' + key] = {
        url: url
      }
      firebase.database().ref().update(updates);
    }
    if (!currentUser.channels || currentUser.channels.indexOf(key) === -1) {
      firebase.database().ref(`/users/${sessionStorage.getItem('uid')}`).set({
        ...currentUser,
        channels: [...currentUser.channels || [], key]
      })
    }
  }
  return <div>
    {currentUser?currentUser.displayName:'loading'}
    <button onClick={addUrl}>Add a new podcast</button>
    {userChannels.map(channel=>{
      return (<a href={channel.url} key={channel.url}>{channel.name}</a>)
    })}
  </div>
}