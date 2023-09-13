import React, { useState, useEffect, useRef } from 'react'
import { useDeliveryLoginMutation } from './authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useAddDeliveryMutation } from '../delivery/deliveryApiSlice'

const USER_REGEX = /^[A-z]{4,12}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{8,16}$/

export default function DeliveryLogin() 
{
    const errRef = useRef()
    const userRef = useRef()

    const[login, 
        {
            isLoading,
            isSuccess,
        }] = useDeliveryLoginMutation()

    const [signup, 
        {
            isLoading: isLoadingSignUp,
            isSuccess: isSuccessSignUp,
            isError: isErrorSignUp,
            error: errorSignUp
        }] = useAddDeliveryMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validConfirmPassword, setValidConfirmPassword] = useState(false)
    const [matchingPasswords, setMatchingPasswords] = useState(false)

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
        setValidConfirmPassword(PWD_REGEX.test(confirmPassword))
    }, [confirmPassword])

    useEffect(() => 
    {
        setMatchingPasswords(password === confirmPassword)
    }, [password, confirmPassword])

    useEffect(() => 
    {
        if(isSuccess && isSuccessSignUp)
        {
            setUsername('')
            setPassword('')
            navigate('/')
        }
    }, [isSuccess, isSuccessSignUp, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onPasswordChanged = (e) => setPassword(e.target.value)
    const onConfirmPasswordChanged = (e) => setConfirmPassword(e.target.value)
    
    const canSave = [validUsername, validPassword, validConfirmPassword, matchingPasswords].every(Boolean) && !isLoading && !isLoadingSignUp

    //@ts-ignore
    const signupErr = isErrorSignUp ? <p ref={errRef}>{errorSignUp?.data?.message}</p> : null

    async function handleSubmit(e)
    {
        e.preventDefault()
        try
        {
            await signup({ username, password }).unwrap()
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
            {signupErr}
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    value={username}
                    onChange={onUsernameChanged}
                    autoComplete='off'
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
                <label htmlFor='confirmPassword'>Confirm Password:</label>
                <input
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={onConfirmPasswordChanged}
                    autoComplete='off'
                    required
                />
                <button
                    disabled={!canSave}
                >
                    Add Delivery
                </button>
            </form>
        </>
    )
}
