// Single component
import { gql, useMutation } from '@apollo/client';
import { addItem } from '../apollo/server';
import { useEffect, useState } from 'react';
import { setCreatedAt } from '../store/reducers/AddItem/addItemSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddItem = () => {
    const item = useSelector(state => state.addItem)
    const { title, description, price, condition, images, createdAt, subCategoryId, zoneId, address, userId } = item
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCreatedAt(new Date().toISOString()))

        console.log(item.address.coordinates)
    },[])

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
                status: "Pending"
                subCategoryId: $subCategoryId
                title: $title
                userId: $userId
                zoneId: $zoneId
                likesCount: 0
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
            zoneId,
            address: {
                address: address.address,
                coordinates: {
                    longitude: address.coordinates.longitude,
                    latitude: address.coordinates.latitude
                }
            }
        },
    })

    useEffect(() => {
        if(createdAt){
            mutateFunction()
        }
    }, [item])

    useEffect(() => {
        console.log(error)
    }, [error])
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong...</p>;
  }

export default AddItem    