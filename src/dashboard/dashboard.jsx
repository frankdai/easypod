import React, { useEffect, useState, useMemo } from 'react'
import Header from "./header";

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
    if (currentUser && currentUser.channels) {
      //firebase.functions().useEmulator('localhost', '5001')
      var refresh = firebase.functions().httpsCallable('refresh');
      refresh({channels: currentUser.channels})
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
        let id = Object.keys(result.data)[0]
        addPodcastToUsr(id)
      })
    } else {
      addPodcastToUsr(key)
    }
  }
  return <div>
    <Header user={currentUser} addUrl={addUrl} />
    {userChannels.map((channel, index)=>{
      let {meta, episodes} = channel
      let episode = episodes[0] || {}
      return <div key={index}>
        <img src={meta.imageURL} width={300} alt={meta.title}/>
        <div>{meta.title}</div>
        <div>{episode.title}</div>
        <p dangerouslySetInnerHTML={{__html: episode.description}} />
        <audio src={episode.enclosure.url} controls></audio>
      </div>
    })}
  </div>
}