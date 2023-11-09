import { gql } from "@apollo/client"

export const nearByItems = gql` query MyQuery($zone: String!) {
    nearByItems(zone: $zone) {
      value {
        _id
        condition
        createdAt
        description
        itemId
        likesCount
        price
        status
        title
        images
        zoneId
        zone {
          zone
          coordinates {
            longitude 
            latitude
          }
        }
        subCategory {
          _id
          parentCategoryId
          title
          category {
            _id
            image
            title
          }
        }
        address {
          address
            coordinates{
              latitude
              longitude
            }
        }
        user {
          _id
          avatar
          description
          callingCode
          createdAt
          email
          active
          name 
          notifications{
            recommendations
            specialOffers
          }
          phone
          likes
          followers
          following
        }
      }
      name
    }
  }`

  export const getCategories = gql`  query MyQuery {
    getCategories {
      name
      value {
        _id
        image
        title
      }
    }
  }`

  export const getSubCategories = gql `query getZones {
    getSubCategories {
      name
      value {
        _id
        title
        category {
          _id
          image
          title
        }
      }
    }
  }`

  export const getItems = gql`  query getZones {
    getItems {
      value {
        _id
        condition
        createdAt
        description
        itemId
        likesCount
        price
        status
        title
        images
        zoneId
        zone {
          zone
          coordinates {
            longitude 
            latitude
          }
        }
        subCategory {
          _id
          parentCategoryId
          title
          category {
            _id
            image
            title
          }
        }
        address {
          address
            coordinates{
              latitude
              longitude
            }
        }
        user {
          _id
          avatar
          description
          callingCode
          createdAt
          email
          active
          name
          notifications{
            recommendations
            specialOffers
          }
          phone
          likes
          followers
          following
        }
      }
      name
    }
  }`

  export const getZones = gql`query getZones {
    getZones {
      name
      value {
        zone
        coordinates {
          latitude
          longitude
        }
      }
    }
  }`

export const GET_ZONES_QUERY = gql`
  query getZones($userId: ID!) {
    getUserById(user: $userId) {
      _id
      avatar
      callingCode
      createdAt
      description
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
`;
export const DELETE_ITEM = gql`
mutation MyMutation($id: String!) {
    deleteItem(id: $id)
}
`;
