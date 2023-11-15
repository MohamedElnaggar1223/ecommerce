import React, { useEffect } from 'react'
import { useOrderCompletedMutation } from './customersApiSlice'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'

export default function OrderCompleted() 
{
    const { id } = useAuth()
    const[success, { isSuccess, isLoading, error }] = useOrderCompletedMutation()
    const navigate = useNavigate()

    console.log(isSuccess)
    console.log(error)

    useEffect(() => 
    {
        async function confirmSuccess()
        {
            try
            {
                await success({ id }).unwrap()
            }
            catch(e)
            {
                console.error(e)
            }
        }
        if(id) {
            console.log('test')
            confirmSuccess()
        }
        // eslint-disable-next-line
    }, [id])

    useEffect(() => 
    {
        if(isSuccess) console.log('successs')
        if(isSuccess) navigate('/products')
    }, [isSuccess, navigate])
    
    if(isLoading) return (
        <Loading />
    )
    return (
        <div>Your Order Was Completed :{`)`}</div>
    )
}
