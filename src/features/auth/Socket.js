// import React from 'react'
// import { socket } from '../../config/socket'
// // import { Outlet } from 'react-router-dom'
// import { store } from '../../app/store'
// import useAuth from '../../hooks/useAuth'
// import { customersApiSlice } from '../customers/customersApiSlice'
// import { Outlet } from 'react-router-dom'

// export default function Socket()
// {
//     const { id } = useAuth()
    
//     socket.connect()

//     console.log(socket.id)

//     socket.on('cartUpdated', () => 
//     {
//         console.log('updated')
//         store.dispatch(customersApiSlice.util.invalidateTags([{ type: 'Customer', id }]))
//     })

//     return <Outlet />
// }