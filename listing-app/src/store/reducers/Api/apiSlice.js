import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => '/products',
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
        }),
        createOrder: builder.mutation({
            query: (body) => ({
                url: '/orders',
                method: 'POST',
                body,
            }),
        }),
        getOrder: builder.query({
            query: (id) => `/orders/${id}`,
        }),
        createPayment: builder.mutation({
            query: (body) => ({
                url: '/payments',
                method: 'POST',
                body,
            }),
        }),
        // Payments
        createPaymentIntent: builder.mutation({
            query: (body) => ({
                url: '/intents',
                method: 'POST',
                body,
            }),
        }),
    }),
})

export const { useGetProductsQuery, useGetProductQuery, useCreateOrderMutation, useGetOrderQuery, useCreatePaymentMutation, useCreatePaymentIntentMutation } = apiSlice;
export default apiSlice.reducer;