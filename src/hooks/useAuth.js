import jwtDecode from 'jwt-decode'
import { selectCurrentToken } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'

export default function useAuth() 
{
    const token = useSelector(selectCurrentToken)

    if(token)
    {
        const decoded = jwtDecode(token)
        //@ts-ignore
        if(decoded.UserInfo?.admin)
        {
            //@ts-ignore
            const { id, username, admin } = decoded.UserInfo
            return { id, username, admin, email: '', cart: [], orders: [], delivery: false }
        }
        //@ts-ignore
        else if(decoded.UserInfo?.delivery)
        {
            //@ts-ignore
            const { id, username, orders, delivery } = decoded.UserInfo
            return { id, username, admin: false, email: '', cart: [], orders, delivery}
        }
        else
        {
            //@ts-ignore
            const { id, username, email, cart, orders } = decoded.UserInfo
            return { id, username, admin: false, email, cart, orders, delivery: false}
        }
    }

    return { id: '', username: '', admin: false, email: '', cart: [], orders: [], delivery: false}
}
