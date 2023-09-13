import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials, logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints(
    {
        endpoints: builder => (
            {
                customerLogin: builder.mutation(
                    {
                        query: (credentials) => 
                        ({
                            url: '/auth/customer',
                            method: 'POST',
                            body: { ...credentials }
                        })
                    }),
                adminLogin: builder.mutation(
                    {
                        query: (credentials) => 
                        ({
                            url: '/auth/admin',
                            method: 'POST',
                            body: { ...credentials }
                        })
                    }),
                deliveryLogin: builder.mutation(
                    {
                        query: (credentials) => 
                        ({
                            url: '/auth/delivery',
                            method: 'POST',
                            body: { ...credentials }
                        })
                    }),
                sendLogout: builder.mutation(
                    {
                        query: () => 
                        ({
                            url: '/auth/logout',
                            method: 'POST'
                        }),
                        async onQueryStarted(arg, { dispatch, queryFulfilled })
                        {
                            try
                            {
                                await queryFulfilled
                                dispatch(logout())
                                setTimeout(() => 
                                {
                                    dispatch(apiSlice.util.resetApiState())
                                }, 1000);
                            }
                            catch(e)
                            {
                                console.error(e)
                            }
                        }
                    }),
                refresh: builder.mutation(
                    {
                        query: () => 
                        ({
                            url: '/auth/refresh',
                            method: 'GET'
                        }),
                        async onQueryStarted(arg, { dispatch, queryFulfilled })
                        {
                            try
                            {
                                const { data } = await queryFulfilled
                                const { accessToken } = data
                                dispatch(setCredentials({ accessToken }))
                            }
                            catch(e)
                            {
                                console.error(e)
                            }
                        }
                    })
            })
    })

export const 
{
    useCustomerLoginMutation,
    useAdminLoginMutation,
    useDeliveryLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice