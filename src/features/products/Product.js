import React, { memo } from 'react'
import { useGetProductQuery, useGetProductsQuery, useUpdateCartMutation } from './productsApiSlice'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'
import ClipLoader from 'react-spinners/ClipLoader'

function Product({ userId, product, selectedCategories }) 
{
    const[addToCart, 
        {
            isLoading,
        }] = useUpdateCartMutation()

    async function handleAdd()
    {
        try
        {
            await addToCart({ id: userId, product: product, action: 'add' }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id: userId }]))
        }
        catch(e)
        {
            console.error(e)
        }
    }

    return (
        <div className='Product'>
            <img src={product.image} alt={product.title} />
            {product.title} {' '}
            ${product.price}
            <button
                onClick={handleAdd}
                disabled={isLoading}
                name='addToCart'
            >
                Add To Cart
            </button>
        </div>
    )
}

const memoizedProduct = memo(Product)
export default memoizedProduct