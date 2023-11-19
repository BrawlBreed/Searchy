import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { setCreatedAt } from '../store/reducers/Item/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';

const addItem = () => {
    const item = useSelector(state => state.addItem)
    const { title, description, price, condition, images, createdAt, subCategoryId, zone, address, userId } = item
    const dispatch = useDispatch()
    dispatch(setCreatedAt(new Date().toISOString()))

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
        mutation MyMutation(
            $condition: String!,
            $createdAt: String!,
            $description: String!,
            $images: [String!]!,
            $price: Float!,
            $subCategoryId: String!,
            $title: String!,
            $userId: String!,
            $zoneId: String!,
            $address: AddressInput!
        ) {
            addItem(
                condition: $condition
                createdAt: $createdAt
                description: $description
                images: $images
                price: $price
                status: "active"
                subCategoryId: $subCategoryId
                title: $title
                userId: $userId
                zoneId: $zoneId
                likes: ['']
                views: 0
                address: $address
            )
        }
    `, {
        variables: {
            condition,
            createdAt,
            description,
            images,
            price,
            subCategoryId,
            title,
            userId,
            zoneId: zone.zone,
            address: {
                address: address.address,
                coordinates: {
                    longitude: address.coordinates.longitude,
                    latitude: address.coordinates.latitude
                }
            }
        },
    })

    return { mutateFunction, data, loading, error }
}

export default addItem    