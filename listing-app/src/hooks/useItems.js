// Single component
import { gql, useQuery } from '@apollo/client';
import { getItems } from '../apollo/server';
import { useEffect, useState } from 'react';
import { fetchBlockedUsers } from '../firebase';
import { useSelector } from 'react-redux';

const useItems = (searchSubCategory, searchCategory, searchInput) => {
  const [ items, setItems ] = useState([])
  const { uid, blockedUsers } = useSelector(state => state.user)
  const { loading, error, data } = useQuery(getItems, {
    variables: {},
  })

  const setIsBlocked = async (userId) => {
    const userBlockedUsers = await fetchBlockedUsers(userId)
    return(userBlockedUsers?.includes(uid) || blockedUsers?.includes(userId))
  }

  useEffect(() => {
    if(!data) return
    const processItems = async () => {
      if (!data || !data.getItems.length) return;
  
      // Transform items
      let transformedItems = data.getItems.map(({ name, value }) => ({
        id: name,
        title: value.title,
        price: value.price,
        location: value.address.address,
        image: value.images[0],
        categoryTitle: value.subCategory.category.title,
        ...value,
      }))
      .filter(item => {
        // Filter based on search input and category
        if (searchInput) return item.title.toLowerCase().includes(searchInput.toLowerCase());
        else if (searchSubCategory === "View All") return item.categoryTitle.toLowerCase().includes(searchCategory.toLowerCase());
        else return item.subCategory.title.toLowerCase().includes(searchSubCategory.toLowerCase());
      })
      .filter(item => item.status === 'active' && item.user?._id !== uid && Boolean(item.user));
  
      // Check block status asynchronously
      const itemsWithBlockStatus = await Promise.all(transformedItems.map(async item => {
        const blocked = await setIsBlocked(item.user._id);
        return { ...item, blocked };
      }));
  
      // Filter out blocked items
      const finalItems = itemsWithBlockStatus.filter(item => !item.blocked);
  
      setItems(finalItems);
    };
  
    processItems();
  }, [data])

  return ({ loading, error, items })
}

export default useItems