import React from 'react'
import { useGetProductsQuery } from './productsApiSlice'
import Product from './Product'
import ClipLoader from 'react-spinners/ClipLoader'
import useAuth from '../../hooks/useAuth'

export default function ProductsList() 
{
    const { id: userId } = useAuth()
    const 
    {
        data: products,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetProductsQuery('productsList', 
    {
        pollingInterval: 12000000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    let content
    if(isLoading) content = <ClipLoader />
    else if(isSuccess)
    {
        const { ids } = products
        const displayedProducts = ids.map(id => <Product key={id} userId={userId} product={id} />)
        content = (
            <div className='ProductsList'>
                {displayedProducts}
            </div>
        )
    }
    //@ts-ignore
    else if(isError) content = <p>{error?.data?.message}</p>

    return content
}
