import React, { memo, useEffect, useState } from 'react'
import { Icons } from '../../components/ProductIcons'
import { Box, Stack, SvgIcon, Typography } from '@mui/material'
import { useUpdateFavsMutation } from '../customers/customersApiSlice'
import useAuth from '../../hooks/useAuth'

function Product({ product, setProductClicked, favs }) 
{
    const [fav, setFav] = useState(favs?.includes(product.id))
    const { id } = useAuth()

    useEffect(() => 
    {
        if(favs) setFav(favs?.includes(product.id))
    }, [favs, product.id])

    const[updateFavs, 
    {
        isLoading: isFavsLoading
    }] = useUpdateFavsMutation()

    return (
        <Box 
            boxShadow='2px 4px 12px 2px rgba(0, 0, 0, 0.25)' 
            sx={{ 
                borderRadius: 5, 
                bgcolor: '#FBFCFA' ,
                width: '300px',
                height: '460px',
                flexShrink: 0,
                '&:hover': {
                    cursor: 'pointer'
                },
                position: 'relative',
            }}
            onClick={(e) => {
                if(!e.target.classList.contains('Heart'))
                setProductClicked(prev => prev.id !== null ? ({ id: null }) : ({ id: product.id }))}
            }
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
            <Stack
                marginTop='auto'
                top='88%'
                left='5%'
                position='absolute'
                direction='row'
                width='100%'
            >
                <Stack
                    direction='row'
                    gap={0.5}
                >
                    <SvgIcon
                        sx={{
                            fontSize: 36
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
                            <path d="M18.4998 37C18.9905 36.9999 19.4609 36.8049 19.8078 36.458L36.458 19.8105C36.6468 19.6218 36.7925 19.3945 36.8851 19.1441C36.9777 18.8938 37.015 18.6264 36.9945 18.3603L35.805 2.90214C35.7714 2.46178 35.5813 2.04797 35.2692 1.73552C34.957 1.42307 34.5433 1.23259 34.1029 1.19854L18.6423 0.0054677C18.3761 -0.0150384 18.1087 0.022287 17.8583 0.114881C17.608 0.207475 17.3806 0.353145 17.1919 0.541888L0.541662 17.1894C0.194836 17.5363 0 18.0067 0 18.4972C0 18.9877 0.194836 19.4581 0.541662 19.8049L17.1919 36.4525C17.3632 36.6253 17.5669 36.7626 17.7913 36.8565C18.0158 36.9505 18.2565 36.9992 18.4998 37ZM19.2066 3.76411L32.2381 4.76666L33.2408 17.7961L18.4998 32.5348L4.46556 18.5027L19.2066 3.76411ZM23.0195 13.9839C22.5019 13.4665 22.1494 12.8073 22.0065 12.0897C21.8637 11.372 21.9369 10.6281 22.2169 9.95209C22.4969 9.27603 22.9711 8.69819 23.5796 8.29164C24.1881 7.88509 24.9035 7.66809 25.6354 7.66809C26.3672 7.66809 27.0826 7.88509 27.6911 8.29164C28.2996 8.69819 28.7739 9.27603 29.0539 9.95209C29.3339 10.6281 29.4071 11.372 29.2643 12.0897C29.1214 12.8073 28.7689 13.4665 28.2513 13.9839C27.5575 14.6774 26.6165 15.067 25.6354 15.067C24.6543 15.067 23.7133 14.6774 23.0195 13.9839Z" fill="black"/>
                        </svg>
                    </SvgIcon>
                    <Typography
                        fontSize={18}
                        fontFamily='Poppins'
                        fontWeight={500}
                    >
                        ${product.price}
                    </Typography>
                </Stack>
                    {
                        fav 
                        ?
                            <SvgIcon
                                sx={{
                                    position: 'absolute',
                                    top: '35%',
                                    left: '81%'
                                }}
                                className='Heart'
                            >
                                <svg className='Heart' onClick={async () => {
                                        if(!isFavsLoading)
                                        {
                                            setFav(prev => !prev)
                                            await updateFavs({ id, product: product.id })
                                        }
                                    }}  
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                    <path className='Heart' d="M12 3.31952C8.8512 -2.20127 0 -0.589158 0 6.32741C0 10.8802 5.214 15.7715 11.1636 21.6541C11.3964 21.8851 11.6988 22 12 22C12.3012 22 12.6036 21.8851 12.8364 21.6541C18.8088 15.7495 24 10.8814 24 6.32741C24 -0.61238 15.1248 -2.15972 12 3.31952Z" fill="black" fill-opacity="0.3"/>
                                </svg>
                            </SvgIcon>
                        :
                            <SvgIcon
                                sx={{
                                    position: 'absolute',
                                    top: '35%',
                                    left: '81%'
                                }}
                                className='Heart'
                            >
                                <svg className='Heart' onClick={async () => {
                                        if(!isFavsLoading)
                                        {
                                            setFav(prev => !prev)
                                            await updateFavs({ id, product: product.id })
                                        }
                                    }} 
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                    <path className='Heart'  fillRule="evenodd" clipRule="evenodd" d="M12 20.593C6.37 15.054 1 10.296 1 6.191C1 2.4 4.068 1 6.281 1C7.593 1 10.432 1.501 12 5.457C13.59 1.489 16.464 1.01 17.726 1.01C20.266 1.01 23 2.631 23 6.191C23 10.26 17.864 14.816 12 20.593ZM17.726 0.00999999C15.523 0.00999999 13.28 1.052 12 3.248C10.715 1.042 8.478 0 6.281 0C3.098 0 0 2.187 0 6.191C0 10.852 5.571 15.62 12 22C18.43 15.62 24 10.852 24 6.191C24 2.18 20.905 0.00999999 17.726 0.00999999Z" fill="black"/>
                                </svg>
                            </SvgIcon>
                    }
            </Stack>
        </Box>
    )
}

const memoizedProduct = memo(Product)
export default memoizedProduct