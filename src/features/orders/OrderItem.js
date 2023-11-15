import React, { memo } from 'react'
import { useGetProductQuery } from '../products/productsApiSlice'
import { Typography } from '@mui/material'

function OrderItem({ product }) 
{
    const
    {
        data: productData,
        isLoading
    } = useGetProductQuery({ id: product.product })

    if(isLoading) return <></>

    return (
        <Typography fontFamily='Poppins' fontWeight={400} fontSize={{ sm: 14, lg: 16 }}>{productData.title} x {product.count}</Typography>
    )
}

const memoizedItemOrder = memo(OrderItem)
export default memoizedItemOrder