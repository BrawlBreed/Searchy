// Single component
import { gql, useQuery } from '@apollo/client';
import { nearByItems } from '../apollo/server';
import { useEffect, useState } from 'react';

const useMainHome = (zoneId) => {
  const [ items, setItems ] = useState([])
  const { loading, error, data } = useQuery(nearByItems, {
    variables: { zone: zoneId },
  })

  useEffect(() => {
    if(!data) return 
    if(data.nearByItems.length){
      const items = data.nearByItems.map(({ name, value }) => ({
        id: name,
        title: value.title,
        price: value.price, 
        location: value.address.address,
        image: value.images[0],
        ...value
      }))

      setItems(items)
    }
  }, [data])

  return ({ loading, error, items })
}

export default useMainHome