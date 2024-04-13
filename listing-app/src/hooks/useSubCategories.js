// Single component
import { gql, useQuery } from '@apollo/client';
import { getCategories, getSubCategories } from '../apollo/server';
import { useEffect, useState } from 'react';

const useSubCategories = () => {
    const [ subCategories, setSubCategories ] = useState([])
    const { loading, error, data } = useQuery(getSubCategories, {
        variables: {},
    })

    useEffect(() => {
        if(!data) return 
        if(data.getSubCategories){
            // Create a map to store unique categories
            const uniqueCategories = new Map();

            // Iterate through the data and transform it
            data.getSubCategories.forEach(item => {
              const category = item.value.category;
              // Add the category to the uniqueCategories map if not present
              if (!uniqueCategories.has(category._id)) {
                uniqueCategories.set(category._id, {
                  ...category,
                  subCategories: [],
                });
              }
              // Add the subcategory to the corresponding category's subCategories array
              const uniqueCategory = uniqueCategories.get(category._id);
              uniqueCategory.subCategories.push(item);
            });
            
            // Convert the map of unique categories back to an array
            const uniqueCategoryArray = Array.from(uniqueCategories.values());
            setSubCategories(uniqueCategoryArray)
        }
    }, [data])

    useEffect(() => {
        console.log(error)
    }, [error, data])

  return ({ loading, error, subCategories })
}

export default useSubCategories