import gql from "graphql-tag";

export default gql`
  query ordersQuery($shopIds: [ID], $filters: OrderFilterInput, $first: ConnectionLimitInt, $offset: Int) {
    orders(shopIds: $shopIds, filters: $filters, first: $first, offset: $offset) {
      nodes {
        _id
        referenceId
        orderId
        createdAt
        email
        account {
          firstName
          lastName
          name
        }
        payments {
          status
        }
        fulfillmentGroups {
          type
          data {
            ... on ShippingOrderFulfillmentGroupData {
              shippingAddress {
                _id
                description
                address
                reference
                metaddress {
                  distance {
                    branch
                    branchId
                  }
                }
              }
            }
            ... on PickupOrderFulfillmentGroupData {
              pickupDetails {
                datetime
                branch
                branchId
              }
            }
          }
          status
        }
        summary {
          total {
            displayAmount
          }
        }
        email
        status
      }
      totalCount
    }
  }
`;
