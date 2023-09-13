import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const ordersAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.createdAt.localeCompare(a.createdAt)
})

const initialState = ordersAdapter.getInitialState()

export const ordersApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getOrders: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/orders',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedOrders = response.map(order => 
                                {
                                    order.id = order._id
                                    return order
                                })
                            return ordersAdapter.setAll(initialState, loadedOrders)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Order', id })),
                                    { type: 'Order', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Order', id: 'LIST' }]
                        }
                    })
            })
    })

export const
{
    useGetOrdersQuery
} = ordersApiSlice