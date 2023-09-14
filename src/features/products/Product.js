import React, { memo } from 'react'
import { useGetProductsQuery, useUpdateCartMutation } from './productsApiSlice'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'

function Product({ userId, product }) 
{
    const[addToCart, 
        {
            isLoading,
            isSuccess
        }] = useUpdateCartMutation()

    const { post } = useGetProductsQuery('productsList', 
    {
        selectFromResult: ({ data }) => ({
            post: data?.entities[product]
        })
    })

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
            <img src={post.image} alt={post.title} />
            {post.title} 
            {post.price}$ 
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