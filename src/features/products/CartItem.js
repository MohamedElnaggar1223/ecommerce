import React, { memo } from 'react'
import { useGetProductQuery, useUpdateCartMutation } from './productsApiSlice'
import useAuth from '../../hooks/useAuth'
import { store } from '../../app/store'
import { customersApiSlice } from '../customers/customersApiSlice'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, Stack, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { ClipLoader } from 'react-spinners'

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
        
    if(isLoading) return <ClipLoader />

    let additionalInfo = null
    if(productData?.additionalInfo && Object.keys(productData?.additionalInfo).length !== 0)
    {
        additionalInfo = Object.keys(productData?.additionalInfo).map(data => 
        <Typography 
            key={data}
            fontWeight={400}
            fontFamily='Poppins'
            sx={{ overflowY: 'auto' }}
            noWrap
        >
            {data}: {productData?.additionalInfo[data]}
        </Typography> 
        )
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
        if(!CartLoading)
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
    }

    async function handleDel()
    {
        if(!CartLoading)
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
    }

    return (
        <Box
            display='flex'
            flexDirection='row'
            width='100%'
            alignItems='center'
            gap={1}
            justifyContent='space-between'
        >
            <Stack
                alignItems='center'
                direction={{xs: 'column', sm: 'row', lg: 'row'}}
                gap={1}
            >
                <HighlightOffIcon onClick={handleDel} sx={{ flexWrap: 'wrap' }} />
                <Typography
                    fontWeight={500}
                    fontFamily='Poppins'
                    flexWrap='wrap'
                >
                    ${(productData.price * product.count).toFixed(2)}
                </Typography>
            </Stack>
            <Box
                sx={{ display: 'flex', flex: '1 1 0', alignSelf: 'center', height: 100 }}
            >
                <img style={{ height: '100%', maxWidth: '100%' , flex: '1 1 0', alignSelf: 'center', objectFit: 'contain'}} src={productData.image} alt={productData._id}/>
            </Box>
            <Stack
                direction='column'
                alignItems='flex-start'
                justifyContent='space-around'
                flex={1}
                sx={{
                    overflowY: 'auto'
                }}
                maxHeight='100%'
            >
                <Typography
                    fontWeight={600}
                    fontFamily='Poppins'
                    mb='5px'
                    noWrap
                    textAlign='left'
                >
                    {productData.title}
                </Typography>
                {additionalInfo}
            </Stack>
            <Stack
                direction='column'
                alignItems='center'
                justifyContent='center'
                marginRight={1}
                border={1}
                borderRadius={0.8}
                className='ProductBox'
                borderColor='#ebebeb'
                color='#595959'
                boxShadow='0px 0px 4px 1px rgba(0,0,0,0.2)'
                fontSize={18}
            >
                <AddIcon className='ProductBox' onClick={handleAdd} sx={{ marginTop: 0.5, cursor: 'pointer', opacity: CartLoading ? 0.5 : 1 }} style={{ fontSize: '1px' }} />
                <Box
                    bgcolor='#fcfcfc'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    borderTop={1}
                    borderBottom={1}
                    width= '100%'
                    borderColor='#ebebeb'
                    className='ProductBox'
                >
                    <Typography
                        fontFamily='Poppins'
                        fontWeight={500}
                        className='ProductBox'
                        fontSize={18}
                    >
                        {product.count}
                    </Typography>
                </Box>
                <RemoveIcon style={{ fontSize: '1px' }} className='ProductBox' onClick={handleRem} sx={{ marginBottom: 0.5, cursor: 'pointer', opacity: CartLoading ? 0.5 : 1 }}  />
            </Stack>
        </Box>
    )
}

const memoizedItem = memo(CartItem)
export default memoizedItem