import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const deliveryAdapter = createEntityAdapter()

const initialState = deliveryAdapter.getInitialState()

export const deliveryApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getDeliveries: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/delivery',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedDeliveries = response.map(delivery => 
                                {
                                    delivery.id = delivery._id
                                    return delivery
                                }) 
                            return deliveryAdapter.setAll(initialState, loadedDeliveries)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Delivery', id })),
                                    { type: 'Delivery', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Delivery', id: 'LIST' }]
                        }
                    }),
                addDelivery: builder.mutation(
                    {
                        query: (addedDelivery) => 
                        ({
                            url: '/delivery',
                            method: 'POST',
                            body: { ...addedDelivery }
                        }),
                        invalidatesTags: [{ type: 'Delivery', id: 'LIST' }]
                    }),
                updateDelivery: builder.mutation(
                    {
                        query: (updatedDelivery) => 
                        ({
                            url: '/delivery',
                            method: 'PATCH',
                            body: { ...updatedDelivery }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Delivery', id: args.id }]
                    }),
                acceptOrder: builder.mutation(
                    {
                        query: (acceptedOrder) => 
                        ({
                            url: '/delivery/orders',
                            method: 'POST',
                            body: { ...acceptedOrder }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Delivery', id: args.id }, { type: 'Order', id: args.order }]
                    }),
                deliveredOrder: builder.mutation(
                    {
                        query: (deliveredOrder) => 
                        ({
                            url: '/delivery/orders',
                            method: 'POST',
                            body: { ...deliveredOrder }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Delivery', id: args.id }, { type: 'Order', id: args.order }]
                    })
            })
    })

export const 
{
    useGetDeliveriesQuery,
    useAddDeliveryMutation,
    useUpdateDeliveryMutation,
    useAcceptOrderMutation,
    useDeliveredOrderMutation
} = deliveryApiSlice