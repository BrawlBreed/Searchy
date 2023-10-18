// Single component
import { gql, useQuery } from '@apollo/client';
import { getItems } from '../apollo/server';
import { useEffect, useState } from 'react';

const useItems = (searchSubCategory, searchCategory, searchInput) => {
  const [ items, setItems ] = useState([])
  const { loading, error, data } = useQuery(getItems, {
    variables: {},
  })

  useEffect(() => {
    if(!data) return
    if(data.getItems.length){
      console.log(data.getItems)
      const items = data.getItems.map(({ name, value }) => ({
        id: name,
        title: value.title,
        price: value.price, 
        location: value.address.address,
        image: value.images[0],
        categoryTitle: value.subCategory.category.title,
        ...value
      }))
      .filter(item => {
        if(searchInput) return item.title.toLowerCase().includes(searchInput.toLowerCase())
        else if(searchSubCategory === "View All") return item.categoryTitle.toLowerCase().includes(searchCategory.toLowerCase())
        else return item.subCategory.title.toLowerCase().includes(searchSubCategory.toLowerCase())
      })

      setItems(items)
    }
  }, [data])

  return ({ loading, error, items })
}

export default useItems