import { Box, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import OrderItem from './OrderItem'

function Order({ order }) 
{
    const displayedItem = order?.products.map(product => <OrderItem product={product} />)

    return (
        <Box
            borderRadius='2rem'
            bgcolor='#fcfcfc'
            width={{xs: 300, sm: 500, lg: 1100}}
            px={4}
            py={1}
            display='flex'
            flexDirection={{xs: 'column', sm: 'row', lg: 'row'}}
            justifyContent='space-between'
            boxShadow= '0px 2px 19px 0px rgba(0,0,0,0.1)'
        >
            <Stack
                direction='column'
                gap={0.5}
                justifyContent='flex-start'
                alignItems={{xs: 'flex-start', sm: 'center', lg: 'center'}}
            >
                <Typography fontSize={{xs: 16, sm: 14, lg: 14}} fontFamily='Poppins' fontWeight={500}>Order No.</Typography>
                <Typography ml={{xs: 2, sm: '0', lg: '0'}} fontSize={14} mb={0.5}>{order._id}</Typography>
            </Stack>
            <Stack
                direction='column'
                gap={0.5}
                justifyContent='flex-start'
                alignItems={{xs: 'flex-start', sm: 'center', lg: 'center'}}
            >
                <Typography fontSize={{xs: 16, sm: 14, lg: 14}} fontFamily='Poppins' fontWeight={500}>Items</Typography>
                <Typography ml={{xs: 2, sm: '0', lg: '0'}} mb={0.5} fontSize={{ sm: 14, lg: 16 }}>{displayedItem}</Typography>
            </Stack>
            <Stack
                direction='column'
                gap={0.5}
                justifyContent='flex-start'
                alignItems={{xs: 'flex-start', sm: 'center', lg: 'center'}}
            >
                <Typography fontSize={{xs: 16, sm: 14, lg: 14}} fontFamily='Poppins' fontWeight={500}>Total</Typography>
                <Typography ml={{xs: 2, sm: '0', lg: '0'}} mb={0.5} fontFamily='Poppins' fontSize={{ sm: 14, lg: 16 }}>${order.total.toFixed(2)}</Typography>
            </Stack>
            <Stack
                direction='column'
                gap={0.5}
                justifyContent='flex-start'
                alignItems={{xs: 'flex-start', sm: 'center', lg: 'center'}}
            >
                <Typography fontSize={{xs: 16, sm: 14, lg: 14}} fontFamily='Poppins' fontWeight={500}>Status</Typography>
                <Typography fontSize={{ sm: 14, lg: 16 }} ml={{xs: 2, sm: '0', lg: '0'}} mb={0.5} color={order.deliveryStatus === 'pending' || order.deliveryStatus === 'accepted' ? '#F7CB73' : order.deliveryStatus === 'delivered' ? '#4BB543' : '#ff3333' } fontFamily='Poppins'>{order.deliveryStatus}</Typography>
            </Stack>
        </Box>
    )
}

const memoizedOrder = memo(Order)
export default memoizedOrder