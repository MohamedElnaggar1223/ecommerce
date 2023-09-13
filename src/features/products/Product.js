import React, { memo } from 'react'
import { useUpdateCartMutation } from './productsApiSlice'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'

function Product({ userId, product }) 
{
    const[addToCart, 
        {
            isLoading,
            isSuccess
        }] = useUpdateCartMutation()

    async function handleAdd()
    {
        try
        {
            await addToCart({ id: userId, product: product.id, action: 'add' }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id: userId }]))
        }
        catch(e)
        {

        }
    }

    return (
        <div className='Product'>
            <img src={product.image} alt={product.title} />
            {product.title} 
            {product.price}$ 
            <button
                onClick={handleAdd}
            >
                Add To Cart
            </button>
        </div>
    )
}

const memoizedProduct = memo(Product)
export default memoizedProduct