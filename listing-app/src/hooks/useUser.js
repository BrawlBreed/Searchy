import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/reducers/User/userSlice";

function useUser(userId) {
  const dispatch = useDispatch();
    const { loading, error, data } = useQuery(
      gql`
        query getZones($userId: ID!) {
          getUserById(user: $userId) {
            _id
            avatar
            callingCode
            createdAt
            description
            email
            followers
            following
            active
            likes
            name
            notifications{
              recommendations
              specialOffers
            }
            phone
          }
        }
      `,
      { variables: { userId } 
    });

    useEffect(() => {
      if (data?.getUserById){
        dispatch(setCurrentUser(data?.getUserById));
      }
    }, [data])
      
    return ({ data, error, loading });
  }
  
  export default useUser;