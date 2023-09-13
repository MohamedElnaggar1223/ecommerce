import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const categoriesAdapter = createEntityAdapter()

const initialState = categoriesAdapter.getInitialState()

export const categoriesApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getCategories: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/category',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedCategories = response.map(category => 
                                {
                                    category.id = category._id
                                    return category
                                })
                            return categoriesAdapter.setAll(initialState, loadedCategories)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Category', id })),
                                    { type: 'Category', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Category', id: 'LIST' }]
                        }
                    }),
                addCategory: builder.mutation(
                    {
                        query: (addedCategory) => 
                        ({
                            url: '/category',
                            method: 'POST',
                            body: { ...addedCategory }
                        }),
                        invalidatesTags: [{ type: 'Category', id: 'LIST' }]
                    })
            })
    })

export const
{
    useGetCategoriesQuery,
    useAddCategoryMutation
} = categoriesApiSlice