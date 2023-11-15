import { Box } from '@mui/material'
import React from 'react'
import { ClipLoader } from 'react-spinners'
import logo from '../logo.png'

export default function Loading(){
    return (
        <Box
            display='flex'
            flexDirection='column'
            width='100%'
            height='100%'
            alignItems='center'
            justifyContent='center'
            sx={{
                background: 'radial-gradient(circle, hsla(10, 100%, 90%, 1) 0%, hsla(10, 46%, 95%, 1) 100%)'
            }}
        >
            <img style={{ marginBottom: '20px' }} src={logo} alt='nj' />
            <ClipLoader />
        </Box>
    )
}