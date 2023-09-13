import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function PublicLayout() 
{   
    const navigate = useNavigate()

    useEffect(() => 
    {
        //@ts-ignore
        if(JSON.parse(localStorage.getItem('loggedIn'))) navigate('/test')
        else navigate('/login')
    }, [navigate])

    return <Outlet />
}
