import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { useGetMyOrdersQuery } from './ordersApiSlice'
import useAuth from '../../hooks/useAuth'
import Order from './Order'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'

export default function MyOrders() 
{
    const { id } = useAuth()

    const navigate = useNavigate()

    const 
    {
        data: orders,
        isLoading,
        isSuccess
    } = useGetMyOrdersQuery({ id }, {
        pollingInterval: 12000000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    })

    console.log(orders)

    if(isLoading) return (
        <Loading />
    )
    else if(isSuccess) 
    {

        const displayedOrders = orders?.map(order => <Order order={order} />)

        console.log(displayedOrders?.length)

        return (
            <Box
                width='100%'
                display='flex'
                flexDirection='column'
                alignItems='center'
                bgcolor='#fff'
                minHeight='100%'
                height='100%'
            >
                <Typography
                    fontSize={38}
                    fontWeight={500}
                    fontFamily='Poppins'
                    textAlign='left'
                    width='96%'
                    py={3}
                    px={4}
                >
                    My Orders
                </Typography>
                <Box
                    overflow='auto'
                    height='auto'
                    width='100%'
                >
                    <Stack
                        width='100%'
                        direction='column'
                        gap={4}
                        alignItems='center'
                        justifyContent='flex-start'
                        py={4}
                        sx={{
                            overflowX: 'auto'
                        }}
                    >
                        {displayedOrders}
                    </Stack>
                </Box>
                <Box
                    mt='auto'
                    display='flex'
                    flexDirection='row'
                    width='100%'
                    py={2}
                    minHeight={{xs: 55, sm: 30, lg: 30}}
                    justifyContent='flex-end'
                >
                    <Button
                        sx={{
                            width: '250px',
                            height: '52px',
                            backgroundColor: '#F8EEEC',
                            '&:hover': {
                                backgroundColor: '#f5e0dc',
                            },
                            color: '#000',
                            fontSize: 18,
                            fontWeight: 600,
                            fontFamily: 'Poppins',
                            borderRadius: 2.5,
                            marginRight: {xs: 2, sm: 5, lg: 5},
                            marginBottom: 1
                        }}
                        onClick={() => navigate('/products')}
                        className='ProductBox'
                    >
                        Continue Shopping!
                    </Button>
                </Box>
            </Box>
        )
    }
    else return <></>
}
