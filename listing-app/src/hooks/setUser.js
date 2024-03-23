// Single component
import { gql, useMutation, useQuery } from '@apollo/client';
import { getItems } from '../apollo/server';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRegister } from '../store/reducers/User/userSlice';

const setUser = () => {
    const { name, phoneCode, description, phone, email, password, avatar, createdAt, active, followers, following, notifications, userId, register } = useSelector(state => state.user)
    const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation MyMutation(
        $name: String!,
        $phoneCode: String!,
        $description: String!,
        $phone: String!,
        $email: String!,
        $avatar: String!,
        $createdAt: String!,
        $active: Boolean!,
        $followers: [String]!,
        $following: [String]!,
        $favorites: [String]!,
        $notifications: NotificationsInput!,
        $userId: String!,
    ) {
        register(
          name: $name
          callingCode: $phoneCode
          description: $description
          phone: $phone
          email: $email
          avatar: $avatar
          createdAt: $createdAt
          active: $active
          followers: $followers
          following: $following
          favorites: $favorites
          notifications: $notifications
          _id: $userId
        )
    }
  `, {
    variables: {
        name,
        phoneCode,
        description,
        phone,
        email,
        avatar,
        createdAt,
        active,
        followers,
        following,
        favorites,
        notifications,
        userId
    }})
  
    return ({ userLoading: loading, error, data, mutateFunction })
}

export default setUser