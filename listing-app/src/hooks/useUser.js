import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

export function useUser(user) {
    const { loading, error, data } = useQuery(gql`  query getZones {
      getUserById() {
        _id
        avatar
        callingCode
        createdAt
        description
        email
        followers
        following
        isActive
        likes
        name
        notificationToken
        phone
        showPhone
      }
    }`, {
      variables: {
        user: user,
      },
    })

    useEffect(() => {
        console.log(user)
    }, [data])
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong...</p>;
  
    return ({ data, error, loading })
}