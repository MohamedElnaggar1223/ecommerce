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
            <div className='CartTotal'>Total: ${userData?.cart?.total.toFixed(2)}</div>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
                            <path d="M30.333 29.7778C28.0187 29.7778 26.1426 31.6183 26.1426 33.8889C26.1426 36.1595 28.0187 38 30.333 38C32.6474 38 34.5235 36.1595 34.5235 33.8889C34.5235 31.6183 32.6474 29.7778 30.333 29.7778ZM30.333 29.7778H14.1872C13.2211 29.7778 12.7373 29.7778 12.3395 29.6092C11.9887 29.4604 11.6843 29.2209 11.4625 28.9155C11.214 28.5732 11.114 28.1154 10.9161 27.2094L5.75924 3.59956C5.55676 2.67246 5.45416 2.20945 5.20271 1.86317C4.98095 1.55777 4.67662 1.3174 4.32578 1.16866C3.92798 1 3.44677 1 2.48033 1H1M7.28565 7.16667H34.2578C35.7701 7.16667 36.5254 7.16667 37.0331 7.47574C37.4777 7.74646 37.8031 8.17105 37.9449 8.66517C38.1071 9.22927 37.8989 9.94158 37.4798 11.3671L34.5788 21.2339C34.3282 22.0861 34.2027 22.5114 33.9485 22.8277C33.7241 23.1069 33.4281 23.3254 33.0924 23.4596C32.7134 23.6111 32.2629 23.6111 31.3641 23.6111H10.9114M11.4761 38C9.16177 38 7.28565 36.1595 7.28565 33.8889C7.28565 31.6183 9.16177 29.7778 11.4761 29.7778C13.7904 29.7778 15.6665 31.6183 15.6665 33.8889C15.6665 36.1595 13.7904 38 11.4761 38Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
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
