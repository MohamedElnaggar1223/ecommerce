import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const customersAdapter = createEntityAdapter()

const initialState = customersAdapter.getInitialState()

export const customersApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getCustomers: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/customers/get/${id}`,
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedCustomer = 
                                [{
                                    //@ts-ignore
                                    ...response,
                                    //@ts-ignore
                                    id : response._id
                                }]
                            return customersAdapter.setAll(initialState, loadedCustomer)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Customer', id })),
                                    { type: 'Customer', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Customer', id: 'LIST' }]
                        }
                    }),
                // getCustomer: builder.mutation(
                //     {
                //         query: ({ id }) => 
                //         ({
                //             url: `/customers/get/${id}`,
                //             method: 'GET'
                //         }),
                //         invalidatesTags: (result, err, args) => [{ type: 'Customer', id: args.id }]
                //     }),
                addCustomer: builder.mutation(
                    {
                        query: (addedCustomer) => 
                        ({
                            url: '/customers',
                            method: 'POST',
                            body: { ...addedCustomer }
                        }),
                        invalidatesTags: [{ type: 'Customer', id: 'LIST' }]
                    }),
                updateCart: builder.mutation(
                    {
                        query: (updatedItems) => 
                        ({
                            url: '/customers',
                            method: 'PATCH',
                            body: { ...updatedItems }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Customer', id: args.id }]
                    }),
                chechOut: builder.mutation(
                    {
                        query: ({ id }) => 
                        ({
                            url: '/customers/orders',
                            method: 'POST',
                            body: { id }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Customer', id: args.id }, { type: 'Order', id: 'LIST' }]
                    })
            })
    })

export const 
{
    useGetCustomersQuery,
    //useGetCustomerMutation,
    useAddCustomerMutation,
    useUpdateCartMutation,
    useChechOutMutation
} = customersApiSlice