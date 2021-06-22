import React, { useEffect, useState, useMemo } from 'react'
import style from '../theme/dashboard/index.module.css'

const map = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function DashboardItem({channel, user}) {
  let {meta, episodes} = channel
  let episode = episodes[0] || {}
  let [lastUpdateDate, setLastUpdateTime] = useState('')
  useEffect(()=>{
    let {pubDate} = episode
    let date = new Date(pubDate)
    if (date.getTime() > Date.now() - 24 * 60 * 60 * 1000) {
      setLastUpdateTime('Today')
    } else if (date.getTime() > Date.now() - 2 * 24 * 60 * 60 * 1000) {
      setLastUpdateTime('Yesterday')
    } else if (date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
      setLastUpdateTime(map[date.getDay()])
    } else {
      setLastUpdateTime(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    }
  }, [episode])
  return <div className="flex px-6 py-4 border-b-2 border-gray-400">
    <div className={style.left}>
      <img src={meta.imageURL} alt={meta.title} width={300}/>
    </div>
    <div className="pl-4 flex flex-col w-full	">
      <h2 className="text-xl">{meta.title}</h2>
      <p className={style.description} dangerouslySetInnerHTML={{__html: meta.summary}} />
      <div className="mt-auto flex items-center">
        <span className={`font-semibold ${style.time}`}>{lastUpdateDate}</span>
        <span className="mx-4 truncate flex-grow" title={episode.title}>
          {episode.title}
        </span>
        <span className="ml-auto">
          <button className="btn btn-sm mx-3">
            Unfollow
          </button>
          <button className="btn btn-hollow btn-sm ml-auto">
            <i className="icon-play"></i>Play
          </button>
        </span>
      </div>
    </div>
  </div>
}