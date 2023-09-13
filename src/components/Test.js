import React, { useEffect } from 'react'
import { useChechOutMutation, useGetCustomersQuery, useUpdateCartMutation } from '../features/customers/customersApiSlice'
import { useGetOrdersQuery } from '../features/orders/ordersApiSlice'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Test() 
{
    const { username } = useAuth()
    console.log(username)
    const 
    {
        data: customers,
        isLoading,
        isSuccess,
        //@ts-ignore
    } = useGetCustomersQuery(undefined, 
        {
            pollingInterval: 1200000000,
            refetchOnFocus: false,
            refetchOnReconnect: false,
            refetchOnMountOrArgChange: false,
        })

    const
    {
        data: orders,
        isLoading: isLoadingOrders
    } = useGetOrdersQuery(undefined, 
        {
            pollingInterval: 1200000000,
            refetchOnFocus: false,
            refetchOnReconnect: false,
            refetchOnMountOrArgChange: false,
        })

    const [updateCart, 
        {
            isLoading: isLoadingCart
        }] = useUpdateCartMutation()

    const [checkout, 
        {
            isSuccess: isSuccessCheckOut
        }] = useChechOutMutation()

    const [logout, 
        {
            isSuccess: logoutSucc
        }] = useSendLogoutMutation()

    const navigate = useNavigate()

    useEffect(() => 
    {
        if(logoutSucc) navigate('/')
    }, [logoutSucc, navigate])

    if(isLoading || isLoadingCart || isLoadingOrders) return <p>Loading...</p>

    async function handleClick()
    {
        try
        {
            await updateCart({id: '64fc8d2acc3dd5a534b94d33', product: '64fb7a363c2b8fde1a7875c3', action: 'add'}).unwrap()
        }
        catch(e)
        {
            console.error(e?.data?.message)
        }
    }

    async function handleClickCheck()
    {
        try
        {
            await checkout({ id: '64fc8d2acc3dd5a534b94d33' }).unwrap()
        }
        catch(e)
        {
            console.error(e?.data?.message)
        }
    }

    async function handleLogout()
    {
        try
        {
            await logout({})
        }
        catch(e)
        {
            console.error(e)
        }
    }

    const addToCart = (
        <button
            onClick={handleClick}
        >
            add
        </button>
    )

    const checkoutBtn = (
        <button
            onClick={(handleClickCheck)}
        >
            checkout
        </button>
    )

    const logoutBtn = (
        <button
            onClick={(handleLogout)}
        >
            logout
        </button>
    )

    const { ids, entities } = customers
    const { ids: ordersIds } = orders
    const customersDisplay = ids.map(id => <p key={id}>{id} {entities[id].username}</p>)
    const ordersDisplay = ordersIds.map(id => <p key={id}>{id} </p>)
    let content
    isSuccess ? content =  <> { customersDisplay } </> : content =  <p>Loading...</p>
    return (
        <>
            {content}
            {addToCart}
            {checkoutBtn}
            {ordersDisplay}
            {logoutBtn}
        </>
    )
}
