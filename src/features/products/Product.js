import React, { memo, useState } from 'react'
import { useGetProductQuery, useGetProductsQuery, useUpdateCartMutation } from './productsApiSlice'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'
import ClipLoader from 'react-spinners/ClipLoader'
import { Icons } from '../../components/ProductIcons'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material'

function Product({ userId, product, selectedCategories }) 
{
    const [fav, setFav] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [count, setCount] = useState(1)

    const[addToCart, 
        {
            isLoading,
        }] = useUpdateCartMutation()

    async function handleAdd()
    {
        try
        {
            await addToCart({ id: userId, product: product, action: 'add', count: count }).unwrap()
            store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id: userId }]))
        }
        catch(e)
        {
            console.error(e)
        }
    }

    return (
        <Box boxShadow='2px 4px 12px 2px rgba(0, 0, 0, 0.25)' sx={{ width: 320, borderRadius: 5, bgcolor: '#FBFCFA' }}>
            <Box
                flexDirection='row'
                display='flex'
            >
                {Icons[product.categoryName]}
                <Box justifySelf='center'>
                    <img
                        width='auto'
                        height={256}
                        src={product.image}
                        alt={product.title}
                        style={{

                        }}
                    />
                </Box>
            </Box>
            <Typography
                fontSize={22}
                fontWeight={500}
                fontFamily='Poppins'
                textAlign='center'
            >
                {product.title}
            </Typography>
        </Box>
    )
}

const memoizedProduct = memo(Product)
export default memoizedProduct