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
                        query: () => 
                        ({
                            url: '/customers',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedCustomer = response.map(customer => 
                                {
                                    customer.id = customer._id
                                    return customer
                                })
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
                getCustomer: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/customers/get/${id}`,
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        providesTags: (result, error, arg) => [{ type: 'Customer', id: arg.id }]
                    }),
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
                            url: `/customers/get/${updatedItems.id}`,
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
                    }),
                orderCompleted: builder.mutation(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/customers/success/${id}`,
                            method: 'GET'
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Customer', id: args.id }, { type: 'Order', id: 'LIST' }]
                    }),
                getFavs: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/customers/favs/${id}`,
                            method: 'GET',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        providesTags: (result, error, arg) => [{ type: 'Customer', id: arg.id }]
                    }),
                updateFavs: builder.mutation(
                    {
                        query: (updatedFavs) => 
                        ({
                            url: `customers/favs`,
                            method: 'PATCH',
                            body: {...updatedFavs}
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Customer', id: args.id }]
                    })
            })
    })

export const 
{
    useGetCustomersQuery,
    useGetCustomerQuery,
    useAddCustomerMutation,
    useUpdateCartMutation,
    useChechOutMutation,
    useOrderCompletedMutation,
    useGetFavsQuery,
    useUpdateFavsMutation
} = customersApiSlice