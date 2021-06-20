import React, { useEffect, useState, useMemo } from 'react'

export default function Header(props) {
  function onClick() {
    props.addUrl()
  }
  return <header className="w-full text-2xl font-semibold text-black text-center my-4 relative">
    {props.user?props.user.displayName + '\'s Podcast':''}
    <div className="absolute w-1/6 text-right right-0	top-0 text-m">
      <button className="btn btn-hollow hover:btn-hollow-hover icon-plus" onClick={onClick} />
      <button className="btn btn-hollow hover:btn-hollow-hover">Search</button>
      <button className="btn btn-hollow hover:btn-hollow-hover">Me</button>
    </div>
  </header>
}