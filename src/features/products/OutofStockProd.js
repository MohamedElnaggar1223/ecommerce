import React, { memo, useState } from 'react'
import { useUpdateCartMutation } from './productsApiSlice'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'
import { Icons } from '../../components/ProductIcons'
import { Box, Typography } from '@mui/material'

function OutofStockProd({ userId, product, selectedCategories }) 
{
    const [fav, setFav] = useState(false)

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
        <Box 
            boxShadow='2px 4px 12px 2px rgba(0, 0, 0, 0.25)' 
            sx={{ 
                borderRadius: 5, 
                bgcolor: '#FBFCFA' ,
                width: '300px',
                height: '460px',
                flexShrink: 0
            }}
        >
            <Box
                flexDirection='row'
                display='flex'
                justifyContent='center'
                position='relative'
            >
                {Icons[product.categoryName]}
                <Box justifyContent='center'>
                    <img
                        width='auto'
                        height={256}
                        src={product.image}
                        alt={product.title}
                        style={{
                            marginTop: '25px',
                            backgroundBlendMode: 'inherit',
                            maxWidth: '180px',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Box>
            <Typography
                fontSize={22}
                fontWeight={500}
                fontFamily='Poppins'
                textAlign='center'
                mt='10px'
            >
                {product.title}
            </Typography>
        </Box>
    )
}

const memoizedOutofStockProd = memo(OutofStockProd)
export default memoizedOutofStockProd