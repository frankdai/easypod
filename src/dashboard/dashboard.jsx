import React, { useEffect, useState, useMemo } from 'react'
import Header from "./header";

export default function ({user}) {
  let [currentUserChannels, setCurrentUserChannels] = useState([])
  let [allChannels, setAllChannels] = useState(null)
  useEffect(()=>{
    let database = firebase.database().ref(`/users/${sessionStorage.getItem('uid')}`);
    database.get().catch((error)=>{
      console.error(error)
    })
    database.on('value', (snapshot) => {
      setCurrentUserChannels(snapshot.val().channels || []);
    });
    firebase.database().ref(`/channels`).on('value', (snapshot)=>{
      setAllChannels(snapshot.val())
    })
  }, [])
  useEffect(()=>{
    if (currentUserChannels.length) {
      //firebase.functions().useEmulator('localhost', '5001')
      var refresh = firebase.functions().httpsCallable('refresh');
      refresh({channels: currentUserChannels})
    }
  }, [currentUserChannels])
  let userChannels = useMemo(()=>{
    let array = []
    if (currentUserChannels.length && allChannels) {
      array = currentUserChannels
    }
    return array.map((id)=>{
      return allChannels[id]
    })
  }, [currentUserChannels, allChannels])
  function addPodcastToUsr (key) {
    if (!currentUserChannels.length || currentUserChannels.indexOf(key) === -1) {
      firebase.database().ref(`/users/${sessionStorage.getItem('uid')}/channels`).set([...currentUserChannels, key])
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
    <Header user={user} addUrl={addUrl} />
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