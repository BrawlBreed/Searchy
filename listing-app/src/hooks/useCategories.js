// Single component
import { gql, useQuery } from '@apollo/client';
import { getCategories } from '../apollo/server';
import { useEffect, useState } from 'react';

const useCategories = () => {
    const [ categories, setCategories ] = useState([])
    const { loading, error, data } = useQuery(getCategories, {
        variables: {},
    })

    useEffect(() => {
        if(!data) return 
        if(data.getCategories){
        const categories = data.getCategories.map(({ name, value }) => ({
            id: name,
            title: value.title,
            image: value.image
        }))

        setCategories(categories)
        }
    }, [data])

  return ({ loading, error, categories })
}

export default useCategories