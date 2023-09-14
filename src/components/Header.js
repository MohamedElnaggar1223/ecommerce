import React from 'react'
import useAuth from '../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useGetCustomersQuery } from '../features/customers/customersApiSlice'

export default function Header() 
{
    const { id, username, admin, delivery } = useAuth() 

    //const [userData, setUserData] = useState()

    // const 
    // { 
    //     data: usersData,
    //     isLoading,
    // } = useGetCustomersQuery('customersList', 
    // {
    //     pollingInterval: 12000000,
    //     refetchOnFocus: true,
    //     refetchOnMountOrArgChange: true,
    //     refetchOnReconnect: true
    // })

    // if(isLoading) return <p>Loading...</p>

    // const { ids, }

    // const[getUserData, 
    //     {
    //         isLoading,
    //     }] = useGetCustomerMutation()

    // const getUser = useCallback(async (id) => 
    // {
    //     //@ts-ignore
    //     const { data } = await getUserData({ id }).then(data => data).finally(data => data)
    //     setUserData(data)
    // }, [getUserData])

    // useEffect(() => 
    // {
    //     getUser(id)
    // }, [id, getUser])

    const
    {
        data: userData,
        isLoading
    } = useGetCustomersQuery({ id })

    if(isLoading) return <p>Loading...</p>

    const entities  = userData ? userData.entities : []

    const data = entities[id]

    async function handleCartClicked()
    {

    }

    let cartNumber = 0
    //@ts-ignore
    data?.cart?.items?.forEach(item => cartNumber += item.count)

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
