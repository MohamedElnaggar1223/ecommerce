import React from 'react'
import useAuth from '../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useGetCustomersQuery } from '../features/customers/customersApiSlice'

export default function Header() 
{
    const { id, username, admin, delivery } = useAuth() 

    const { userData } = useGetCustomersQuery('customersList', 
    {
        pollingInterval: 12000000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        selectFromResult: ({ data }) => 
        ({
            userData: data?.entities[id]
        })
    })

    async function handleCartClicked()
    {

    }

    let cartNumber = 0
    userData?.cart?.items?.forEach(item => cartNumber += item.count)

    return (
        <header>
            <div>
                <h3>NJ Shop</h3>
            </div>
            <div>
                {username && <p>Hi!, {username}</p>}
                {!admin && !delivery && <div style={{position: 'relative', width: 'fit-content'}}><FontAwesomeIcon style={{ cursor: 'pointer' }} onClick={handleCartClicked} icon={faCartShopping} size='xl'/><span className="CartItems">{cartNumber}</span></div>}
            </div>
        </header>
    )
}
