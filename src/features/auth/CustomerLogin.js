import React, { useState, useEffect, useRef } from 'react'
import { useCustomerLoginMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'

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
            console.error(e)
        }
    }

    return (
        <>
            {err}
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    value={username}
                    onChange={onUsernameChanged}
                    autoComplete='off'
                    //@ts-ignore
                    ref={userRef}
                    required
                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={onPasswordChanged}
                    autoComplete='off'
                    required
                />
                <button
                    disabled={!canSave}
                >
                    Login
                </button>
            </form>
        </>
    )
}
