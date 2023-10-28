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
          isActive
          name
          notificationToken
          phone
          showPhone
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
        zone {
          _id
          description
          title
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
          isActive
          name
          notificationToken
          phone
          showPhone
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
