import React, { useEffect, useState, useMemo } from 'react'

export default function Header(props) {
  const user = props.user || {}
  function onClick() {
    props.addUrl()
  }
  return <header className="w-full flex justify-between	items-center">
    <div className="w-1/6 mx-2">
      <img src={user.photoURL} className="w-10 h-10 rounded-full" alt={user.displayName} />
    </div>
    <div className="text-2xl font-semibold text-black text-center my-4 relative">
      {user.displayName?user.displayName + '\'s Podcast':''}
    </div>
    <div className="w-1/6 text-right right-0	top-0 text-m">
      <button className="btn btn-hollow hover:btn-hollow-hover btn-round icon-search mx-2	" />
      <button className="btn btn-hollow hover:btn-hollow-hover btn-round icon-plus mx-2	" onClick={onClick} />
    </div>
  </header>
}