import React from 'react'
import { useContext } from 'react'
import { authContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'


export default function ProtectRoute({children}) {

    const {token} = useContext(authContext)

    if(token === null){
        return <Navigate to="/login" />
    }



  return (
    <>
    {children}
    </>
  )
}
