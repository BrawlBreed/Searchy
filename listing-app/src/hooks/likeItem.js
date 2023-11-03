import { gql, useMutation } from '@apollo/client';
import { setCreatedAt } from '../store/reducers/Item/addItemSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const likeItem = ({ name, likesCount }) => {    
    const dispatch = useDispatch()
    dispatch(setCreatedAt(new Date().toISOString()))

    const [mutateFunction, { data, loading, error }] = useMutation(gql`
        mutation MyMutation(
            $likesCount: Int!,
            $name: String!,
        ) {
            likeItem(likesCount: $likesCount, name: $name)
        }
    `, {
        variables: {
           name: name,
           likesCount: likesCount
        },
    })

    return { mutateFunction, data, loading, error }
}

export default likeItem    