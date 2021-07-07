import React, { useEffect, useState, useMemo } from 'react'
import Sidebar from "./sidebar";

export default function Show({show, channels}){
  return (<section className="flex">
    <Sidebar channels={channels} />
    <main>
      <div>{show.meta.title}</div>
    </main>
  </section>)
}