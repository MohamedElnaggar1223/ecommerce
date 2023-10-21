import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useChechOutMutation, useGetCustomerQuery } from '../features/customers/customersApiSlice'
import CartItem from '../features/products/CartItem'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() 
{
    const { id, username, admin, delivery } = useAuth() 
    const [cartHovered, setCartHovered] = useState(false)
    const [animationParent] = useAutoAnimate()

    const [checkout, 
        {
            isSuccess
        }] = useChechOutMutation()

    const
    {
        data: userData,
        isLoading,
    } = useGetCustomerQuery({ id })

    if(isLoading) return <p>Loading...</p>

    async function handleCartClicked()
    {
        console.log('cart clicked')
    }

    async function onCheckOut()
    {
        try
        {
            const { url } = await checkout({ id }).unwrap()
            window.location.replace(url);
        }
        catch(e)
        {
            console.error(e)
        }
    }

    let cartNumber = 0
    //@ts-ignore
    userData?.cart?.items?.forEach(item => cartNumber += item.count)

    const cartItems = userData?.cart?.items.map(item => <CartItem key={item.product} product={item} />)

    const cartTotal = (
        <div className='CartItem'>
            <div className='CartTotal'>Total: {userData?.cart?.total.toFixed(2)}$</div>
            <div className='CartCheckOut'>
                <button 
                    className='CheckOutButton'
                    onClick={onCheckOut}
                >
                        Check Out
                </button>
            </div>
        </div>
    )

    return (
        <header>
            <div className='HeaderTitle'>
                <h1>NJ Shop</h1>
            </div>
            <div className='HeaderButtons'>
                {username && <div className='HeadersName'>Hello, {username}!</div>}
                {!admin && !delivery && 
                    <div 
                        className='Cart' 
                        onClick={handleCartClicked}
                        onMouseEnter={() => setCartHovered(prev => !prev)}
                        onMouseLeave={() => setCartHovered(prev => !prev)}
                    >
                        <FontAwesomeIcon style={{ }} icon={faCartShopping} size='xl'/>
                        <span className="CartNumber">{cartNumber}</span>
                        <AnimatePresence>
                            { cartHovered && 
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }} 
                                    className='CartItems'
                                >
                                    {cartItems}
                                    {cartTotal}
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                }
            </div>
        </header>
    )
}
