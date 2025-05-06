import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query getUsers{
        users{
            id
            displayName
            email
            storeIDs {
                        id
                    }
            }   
    }
`











export const GET_STORES_FULL_DATA = gql`
    query getStoresFullData{
                stores{
                    storeName
                    storeUrl
                    accessToken
                    apiVersion
                    user {
                            id
                            email
                            displayName
                        } 
                    }
    }
`
// ! ------------------------ single data api call 

// Get single user by ID
export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      displayName
      email
      storeIDs {
        id
      }
    }
  }
`;


export const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      displayName
      email
      storeIDs {
        id
      }
    }
  }
`;


// Get single user by email
export const GET_USER_BY_EMAIL_FullInfo = gql`
  query getUserByEmailFull($email: String!) {
    userByEmailFull(email: $email) {
      id
      displayName
      email
      storeIDs {
        id
      }
      SteadfastId {
        id
      }
      pathaoId {
        id
      }
    }
  }
`;

// Get single store by ID
export const GET_STORE_BY_ID = gql`
  query getStoreById($id: ID!) {
    store(id: $id) {
      id
      storeName
      storeUrl
      accessToken
      apiVersion
      
      user {
        id
        displayName
        email
      }
    }
  }
`;



export const GET_STORE_BY_USER_EMAIL = gql`
  query getStoreByUserEmail($email: String!) {
    storeByUserEmail(email: $email) {
      id
      storeName
      storeUrl
      accessToken
      apiVersion
      user {
        id
        displayName
        email
      }
    }
  }
`;




// ! -------------  Pathao 


export const GET_PATHAO_CREDENTIALS = gql`
  query GetPathaoCredentials {
    pathaoCredentials {
      id
      base_url
      client_id
      client_secret
      user {
        id
        displayName
        email
      }
      
    }
  }
`;



export const GET_PATHAO_CREDENTIALS_BY_EMAIL = gql`
  query GetPathaoCredentialsByEmail($email: String!) {
    pathaoCredentialsByEmail(email: $email) {
      id
      base_url
      client_id
      client_secret
      user {
        id
        displayName
        email
      }
    }
  }
`;


// ! steadfast code 

export const GET_STEADFAST_CREDENTIALS = gql`
  query GetSteadfastCredentials {
    steadfastCredentials {
      id
      api_url
      api_key
      secret_key
      user {
        id
        displayName
        email
      }
    }
  }
`;

export const GET_STEADFAST_CREDENTIAL = gql`
  query GetSteadfastCredential($id: ID!) {
    steadfastCredential(id: $id) {
      id
      api_url
      api_key
      secret_key
      user {
        id
        displayName
        email
      }
    }
  }
`;

export const GET_STEADFAST_CREDENTIALS_BY_EMAIL = gql`
  query GetSteadfastCredentialsByEmail($email: String!) {
    steadfastCredentialsByEmail(email: $email) {
      id
      api_url
      api_key
      secret_key
      user {
        id
        displayName
        email
      }
    }
  }
`;







export const GET_COURIERS = gql`
  query {
    couriers {
      id
      tracking_code
      status
      shopifyId
      invoice
      cod_amount
      recipient_name
      recipient_phone
      recipient_address
      note
      orderId
    }
  }
`;

export const GET_COURIER_BY_ID = gql`
  query GetCourier($id: String!) {
    courier(id: $id) {
      id
      tracking_code
      status
      shopifyId
      invoice
      cod_amount
      recipient_name
      recipient_phone
      recipient_address
      note
      orderId
    }
  }
`;


export const GET_COURIER_BY_SHOPIFY_ID = gql`
  query GetCourierByShopifyId($shopifyId: String!) {
    courierByShopifyId(shopifyId: $shopifyId) {
      id
      tracking_code
      status
      shopifyId
      invoice
      cod_amount
      recipient_name
      recipient_phone
      recipient_address
      note
      orderId {
        id
        shopifyOrderNumber
        customerName
      }
    }
  }
`;

export const GET_COURIER_BY_ORDER_ID = gql`
  query GetCourierByOrderId($orderId: String!) {
    courierByOrderId(orderId: $orderId) {
      id
      tracking_code
      status
      shopifyId
      invoice
      cod_amount
      recipient_name
      recipient_phone
      recipient_address
      note
      orderId {
        id
        shopifyOrderNumber
        customerName
      }
    }
  }
`;












// ? ------- query to get saved order 




export const GET_ShopDomain_BY_USER_EMAIL = gql`
  query getShopDomainByUserEmail($email: String!) {
    shopDomainByUserEmail(email: $email) {
      storeUrl
    }
  }
`;

export const GET_Order_Currier_ByShopDomain = gql`
  query GetOrdersDetailsByShopDomain($shopDomain: String!) {
    orderByShopDomain(shopDomain: $shopDomain) {
      id
      name
      note
      processedAt
      customer {
        firstName
        lastName
        email
        phone
      }
      shopDomain
      displayFinancialStatus
      displayFulfillmentStatus
      shopifyId
      lineItems {
        edges {
          node {
            title
            quantity
            sku
            variantTitle
            originalUnitPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
      shippingAddress {
        address1
        address2
        city
        country
        province
        zip
        phone
      }
      tags
      totalPriceSet {
        shopMoney {
          amount
          currencyCode
        }
      }
      courierId
      courier {
        id
        createdAt
        updatedAt
        tracking_code
        status
        shopifyId
        invoice
        cod_amount
        recipient_name
        recipient_phone
        recipient_address
        note
        consignment_id
        _v
      }
    }
  }
`



export const COURIER_INFO_QUERY = `
  query CourierInfo($shopifyId: String!) {
    courierInfoByShopifyId(shopifyId: $shopifyId) {
      id
      consignment_id
      invoice
      tracking_code
      recipient_name
      recipient_phone
      recipient_address
      cod_amount
      status
      note 
      created_at
      updated_at
      shopifyId
    }
  }
`;
export const COURIER_INFO_BATCH_QUERY = gql`
  query CourierInfosByShopifyIds($shopifyIds: [String!]!) {
    courierInfosByShopifyIds(shopifyIds: $shopifyIds) {
      id
      consignment_id
      invoice
      tracking_code
      recipient_name
      recipient_phone
      recipient_address
      cod_amount
      status
      note
      created_at
      updated_at
      shopifyId
    }
  }
`;
