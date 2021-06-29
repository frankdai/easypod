import React, { useEffect, useState, useMemo } from 'react'
import Header from "./header";
import DashboardItem from "./item";
import { useHistory } from 'react-router-dom';


export default function Show({user, onSetCurrentShow}) {
  let [currentUserChannels, setCurrentUserChannels] = useState([])
  let [allChannels, setAllChannels] = useState(null)
  const history = useHistory()
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
      return {
        id,
        ...allChannels[id]
      }
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
    {userChannels.map((channel)=>{
      return <DashboardItem channel={channel} key={channel.id} user={user} onClickItem={(show)=>{
        onSetCurrentShow && onSetCurrentShow(show, userChannels)
        history.push('show', '')
      }} />
    })}
  </div>
}