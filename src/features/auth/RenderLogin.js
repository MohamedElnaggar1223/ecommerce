import React, { useEffect, useRef, useState } from 'react'
import { selectCurrentToken } from './authSlice'
import { useSelector } from 'react-redux'
import { useRefreshMutation } from './authApiSlice'
import { Outlet, Link } from 'react-router-dom'
import Loading from '../../components/Loading'

export default function RenderLogin() 
{
    const token = useSelector(selectCurrentToken)
    const [ran, setRan] = useState(false)
    const effRef = useRef(false)

    const [refresh,
        {
            isUninitialized,
            isLoading,
            isSuccess,
            isError,
            error
        }] = useRefreshMutation()

    //@ts-ignore
    useEffect(() => 
    {
        if(effRef.current === true || process.env.NODE_ENV !== 'development')
        {
            async function verifyRefresh()
            {
                try
                {
                    //@ts-ignore
                    await refresh()
                    setRan(true)
                }
                catch(e)
                {
                    console.error(e)
                }
            }

            if(!token) verifyRefresh()
        }

        return () => effRef.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if(isLoading) content = <Loading />
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message} <Link to='/login'>Please Log In Again</Link></p>
    else if(token && isUninitialized) content = <Outlet />
    else if(isSuccess && ran) content = <Outlet />
    
    return content
}
