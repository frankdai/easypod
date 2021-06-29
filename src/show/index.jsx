import React, { useEffect, useState, useMemo } from 'react'

export default function Show({show}){
  return (<div>{show.meta.title}</div>)
}