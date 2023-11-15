import React, { useState, useEffect, useRef } from 'react'
import { useCustomerLoginMutation } from './authApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { Box, Button, FormControl, FormHelperText, Input, Typography } from '@mui/material'

const USER_REGEX = /^[A-z]{4,12}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{8,16}$/

export default function CustomerLogin() 
{
    const errRef = useRef()
    const userRef = useRef()

    const[login, 
        {
            isLoading,
            isSuccess,
            isError,
            error
        }] = useCustomerLoginMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => 
    {
        //@ts-ignore
        userRef.current.focus()
    }, [])
    
    useEffect(() => 
    {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => 
    {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => 
    {
        if(isSuccess)
        {
            setUsername('')
            setPassword('')
            navigate('/')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    
    const canSave = [validUsername, validPassword].every(Boolean) && !isLoading

    //@ts-ignore
    const err = isError ? <p ref={errRef}>{error?.data?.message}</p> : null

    async function handleSubmit(e)
    {
        e.preventDefault()
        try
        {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
        }
        catch(e)
        {
            // console.error(e)
        }
    }

    console.log(err?.props?.children)

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
                <Box
                    sx={{
                        borderRadius: '10px', 
                        paddingTop: {xs: 4, sm: 8, lg: 8}, 
                        paddingBottom: {xs: 4, sm: 8, lg: 8}, 
                        paddingRight: {xs: 4, sm: 8, lg: 8}, 
                        paddingLeft: {xs: 4, sm: 8, lg: 8}, 
                        // background: 'linear-gradient(200deg, hsla(150, 33%, 1%, 1) 0%, hsla(222, 9%, 22%, 1) 75%)', 
                        background: 'radial-gradient(circle, hsla(154, 12%, 11%, 1) 0%, hsla(222, 9%, 22%, 1) 100%)',
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flexDirection: 'column', 
                        gap: {xs: 4, sm: 10, lg: 10},
                        width: {xs: 280, sm: 'fit-content', lg: 'fit-content'},
                        height: {xs: 'fit-content'}
                    }}
                >
                    <form style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            flexDirection: 'column',
                            gap: 10
                        }} 
                        onSubmit={handleSubmit}
                    >
                        <Typography
                            fontWeight={500}
                            fontSize={{xs: 28, sm: 36, lg: 36}}
                            textAlign='center'
                            fontFamily= 'Poppins'
                            mt={5}
                            sx={{
                                color: '#fcfcfc'
                            }}
                            noWrap
                        >
                            Welcome to NJ Shop!
                        </Typography>
                        <Typography
                            textAlign='center'
                            fontFamily= 'Poppins'
                            sx={{
                                color: '#cc0000'
                            }}
                        >
                            {err?.props?.children}
                        </Typography>
                        <FormControl>
                            <FormHelperText
                                sx={{
                                    fontSize: {xs: 14, sm: 18, lg: 18},
                                    fontFamily: 'Poppins',
                                    color: '#fcfcfc'
                                }}
                            >
                                Username:
                            </FormHelperText>
                            <Input
                                type='text'
                                id='username'
                                value={username}
                                onChange={onUsernameChanged}
                                autoComplete='off'
                                //@ts-ignore
                                ref={userRef}
                                required
                                disableUnderline
                                sx={{
                                    border: '0px',
                                    borderRadius: '6px',
                                    backgroundColor: '#fcfcfc',
                                    width: {xs: 'auto', sm: 390, lg: 390},
                                    fontSize: {xs: 18, sm: 20, lg: 20},
                                    paddingY: 0.5,
                                    paddingX: 2,
                                    color: '#000',
                                    fontFamily: 'Poppins'
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormHelperText
                                sx={{
                                    fontSize: {xs: 14, sm: 18, lg: 18},
                                    fontFamily: 'Poppins',
                                    color: '#fcfcfc'
                                }}
                            >
                                Password:
                            </FormHelperText>
                            <Input
                                type='password'
                                id='password'
                                value={password}
                                onChange={onPasswordChanged}
                                autoComplete='off'
                                required
                                disableUnderline
                                sx={{
                                    border: '0px',
                                    borderRadius: '6px',
                                    backgroundColor: '#fcfcfc',
                                    width: {xs: 'auto', sm: 390, lg: 390},
                                    fontSize: {xs: 18, sm: 20, lg: 20},
                                    paddingY: 0.5,
                                    paddingX: 2,
                                    color: '#000',
                                    fontFamily: 'Poppins'
                                }}
                            />
                        </FormControl>
                        <FormControl>
                        <Button
                            disabled={!canSave}
                            sx={{
                                width: {xs: '144px', sm: '156px', lg: '156px'},
                                height: {xs: '42px', sm: '52px', lg: '52px'},
                                backgroundColor: '#F8EEEC',
                                '&:hover': {
                                    backgroundColor: '#f5e0dc',
                                },
                                color: '#000',
                                fontSize: 18,
                                fontWeight: 600,
                                fontFamily: 'Poppins',
                                borderRadius: 2.5,
                                marginTop: '15px'
                            }}
                            type='submit'
                        >
                            Login
                        </Button>
                        </FormControl>
                        <Typography
                            fontFamily='Poppins'
                            mt='15px'
                            sx={{
                                color: '#fcfcfc'
                            }}
                        >
                            Don't have an account? <Link to='/signup' style={{ color: '#F9EDEA', textDecoration: 'none', fontWeight: 500 }}>Signup</Link>
                        </Typography>
                    </form>
                </Box>
        </Box>
    )
}
