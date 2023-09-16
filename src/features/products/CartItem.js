import React, { memo } from 'react'
import { useGetProductQuery, useUpdateCartMutation } from './productsApiSlice'
import useAuth from '../../hooks/useAuth'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function CartItem({ product }) 
{
    const { id } = useAuth()
    const 
    { 
        data: productData,
        isLoading
    } = useGetProductQuery({ id: product.product })

    const[updateCart, 
    {
        isLoading: CartLoading,
    }] = useUpdateCartMutation()
        
    if(isLoading) return <p>Loading...</p>

    let additionalInfo = null
    if(productData?.additionalInfo && Object.keys(productData?.additionalInfo).length !== 0)
    {
        additionalInfo = Object.keys(productData?.additionalInfo).map(data => <p key={data}>{data}: {productData?.additionalInfo[data]}</p> )
    }

    async function handleAdd()
    {
        try
        {
            await updateCart({ id, product: productData._id, action: 'add' }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id }]))
        }
        catch(e)
        {
            console.error(e)
        }
    }

    async function handleRem()
    {
        try
        {
            console.log(productData)
            await updateCart({ id, product: productData._id, action: 'remove' }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id }]))
        }
        catch(e)
        {
            console.error(e)
        }
    }

    async function handleDel()
    {
        try
        {
            console.log(productData)
            await updateCart({ id, product: productData._id, action: 'delete' }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id }]))
        }
        catch(e)
        {
            console.error(e)
        }
    }

    return (
        <div className='CartItem'>
            <div className='CartTitle'>
            <div className='CartItemRemover'>
                <button disabled={CartLoading} onClick={handleDel} ><FontAwesomeIcon icon={faCircleXmark} /></button>
            </div>
                <div className='CartItemPrice'>USD {productData.price * product.count}$</div>
                <img src={productData.image} alt={productData._id}/>
                <div className='CartTitleName'>
                    <div className='CartMainTitle'>{productData.title}</div>
                    <div className='CartAddInfo'>
                        {additionalInfo}
                    </div>
                </div>
            </div>
            <div className='CartCount'>
                <div className='CartItemUpdater'><button disabled={CartLoading} onClick={handleAdd} >+</button></div>
                <div className='CartItemCount'>{product.count}</div>
                <div className='CartItemUpdater'><button disabled={CartLoading} onClick={handleRem}>-</button></div>
            </div>
        </div>
    )
}

const memoizedItem = memo(CartItem)
export default memoizedItem