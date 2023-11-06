import { gql, useMutation } from '@apollo/client';
import { setCreatedAt } from '../store/reducers/User/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const register = () => {
    const user = useSelector(state => state.user)
    const { 
        name,
        description,
        phone,
        email,
        avatar,
        followers,
        following,
        notifications,
        active,
        favorites,
        isLoggedIn, 
        createdAt,
    } = user
    const dispatch = useDispatch()
    dispatch(setCreatedAt())

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
        mutation MyMutation(
            $name: String!,
            $phone: String!,
            $email: String!,
            $createdAt: String!,
            $description: String!,
            $avatar: String!,
            $followers: [String!]!,
            $following: [String!]!,
            $notifications: NotificationsInput,
            $active: Boolean!,
            $favorites: [String!]!,
            $isLoggedIn: Boolean!,
        ) {
            register(
                name: $name,
                phone: $phone,
                email: $email,
                createdAt: $createdAt,
                description: $description,
                avatar: $avatar,
                followers: $followers,
                following: $following,
                notifications: $notifications,
                active: $active,
                favorites: $favorites,
                isLoggedIn: $isLoggedIn
            )
        }
    `, {
        variables: {
            name,
            phone,
            email,
            createdAt,
            description,
            avatar,
            followers,
            following,
            notifications,
            active,
            favorites,
            isLoggedIn,
        }    
    })

    return { mutateFunction, data, loading, error }
}

export default register    