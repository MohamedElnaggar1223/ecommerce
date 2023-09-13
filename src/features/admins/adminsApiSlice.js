import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

export const adminsAdapter = createEntityAdapter()

const initialState = adminsAdapter.getInitialState()

export const adminsApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                getAdmins: builder.query(
                    {
                        query: () => 
                        ({
                            url: '/admins',
                            validateStatus: (response, result) => 
                            {
                                return response.status === 200 && !result.isError
                            }
                        }),
                        transformResponse: response => 
                        {
                            //@ts-ignore
                            const loadedAdmins = response.map(admin => 
                                {
                                    admin.id = admin._id
                                    return admin
                                })
                            return adminsAdapter.setAll(initialState, loadedAdmins)
                        },
                        //@ts-ignore
                        providesTags: (result, err, args) => 
                        {
                            if(result?.ids)
                            {
                                return [
                                    ...result.ids.map(id => ({ type: 'Admin', id })),
                                    { type: 'Admin', id: 'LIST' }
                                ]
                            }
                            else return [{ type: 'Admin', id: 'LIST' }]
                        }
                    }),
                addAdmin: builder.mutation(
                    {
                        query: (addedAdmin) => 
                        ({
                            url: '/admins',
                            method: 'POST',
                            body: { ...addedAdmin }
                        }),
                        invalidatesTags: [{ type: 'Admin', id: 'LIST' }]
                    }),
                updateAdmin: builder.mutation(
                    {
                        query: (addedAdmin) => 
                        ({
                            url: '/admins',
                            method: 'PATCH',
                            body: { ...addedAdmin }
                        }),
                        invalidatesTags: (result, err, args) => [{ type: 'Admin', id: args.id }]
                    }),
            })
    })

export const
{
    useGetAdminsQuery,
    useAddAdminMutation,
    useUpdateAdminMutation
} = adminsApiSlice