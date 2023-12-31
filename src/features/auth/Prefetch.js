import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { store } from '../../app/store'
import { adminsApiSlice } from '../admins/adminsApiSlice'
import { deliveryApiSlice } from '../delivery/deliveryApiSlice'
import { categoriesApiSlice } from '../category/categoryApiSlice'
import { customersApiSlice } from '../customers/customersApiSlice'
import { ordersApiSlice } from '../orders/ordersApiSlice'
import { productsApiSlice } from '../products/productsApiSlice'

export default function Prefetch() 
{
    const { id, admin, delivery } = useAuth()

    useEffect(() => 
    {
        if(admin) store.dispatch(adminsApiSlice.util.prefetch('getAdmins', 'adminsList', { force: true }))
        if(delivery) 
        {
            store.dispatch(deliveryApiSlice.util.prefetch('getDeliveries', 'deliveriesList', { force: true }))
            store.dispatch(ordersApiSlice.util.prefetch('getOrders', 'OrdersList', { force: true }))
        }
        store.dispatch(categoriesApiSlice.util.prefetch('getCategories', 'categoriesList', { force: true }))
        if(admin) store.dispatch(customersApiSlice.util.prefetch('getCustomers', 'customersList', { force: true }))
        if(!admin && !delivery) 
        {
            store.dispatch(customersApiSlice.util.prefetch('getCustomer', { id }, { force: true }))
            store.dispatch(customersApiSlice.util.prefetch('getFavs', { id }, { force: true }))
            store.dispatch(ordersApiSlice.util.prefetch('getMyOrders', { id }, { force: true }))
        }
        store.dispatch(productsApiSlice.util.prefetch('getProducts', 'productsList', { force: true }))
    }, [id, admin, delivery])
    
    return <Outlet />
}
