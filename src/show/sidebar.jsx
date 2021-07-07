import React, { useEffect, useState, useMemo } from 'react'

export default function Sidebar({channels}){
  let [searchKey, setSearchKey] = useState('')
  let displayChannels = useMemo(()=>{
    return channels.filter(channel=>{
      return channel.meta.title.toLowerCase().indexOf(searchKey) > -1
    })
  }, [channels, searchKey])
  function onChange (e){
    setSearchKey(e.target.value)
  }
  return (<aside className="h-screen overflow-y-auto p-8 relative border-r-2 border-gray-600	border-solid">
    <input value={searchKey} className="absolute left-0	top-0 w-full border-b border-gray-600	border-solid" placeholder="Search" onChange={onChange}/>
    <ul>
      {displayChannels.map((channel)=>{
          return <li className="mb-4">
            <img src={channel.meta.imageURL} alt={channel.meta.title} style={{width: '20vw'}} className="block"/>
            <h3 className="text-center">{channel.meta.title}</h3>
          </li>
        })
      }
    </ul>
  </aside>)
}