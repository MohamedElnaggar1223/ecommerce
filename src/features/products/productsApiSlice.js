import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const productsAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.updatedAt.localeCompare(a.updatedAt)
})

const initialState = productsAdapter.getInitialState()

export const productsApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getProducts: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/products',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedProducts = response.map(product => 
                                {
                                    product.id = product._id
                                    return product
                                })
                            return productsAdapter.setAll(initialState, loadedProducts)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Product', id })),
                                    { type: 'Product', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Product', id: 'LIST' }]
                        }
                    }),
                getProduct: builder.query(
                    {
                        query: ({ id }) => 
                        ({
                            url: `/products/${id}`,
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        providesTags: (result, err, args) => [{ type: 'Product', id: args.id }]
                    }),
                addProduct: builder.mutation(
                    {
                        query: (addedProduct) => 
                        ({
                            url: '/products',
                            method: 'POST',
                            body: { ...addedProduct }
                        }),
                        invalidatesTags: [{ type: 'Product', id: 'LIST' }]
                    }),
                updateCart: builder.mutation(
                    {
                        query: (updatedItems) => 
                        ({
                            url: '/products',
                            method: 'PATCH',
                            body: { ...updatedItems }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Product', id: args.id }]
                    }),
                deleteProduct: builder.mutation(
                    {
                        query: ({ id }) => 
                        ({
                            url: '/products',
                            method: 'DELETE',
                            body: { id }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Product', id: args.id }]
                    })
            })
    })

export const 
{
    useGetProductsQuery,
    useGetProductQuery,
    useAddProductMutation,
    useUpdateCartMutation,
    useDeleteProductMutation
} = productsApiSlice