import gql from "graphql-tag";

export default gql`
query draftOrdersQuery($shopIds: [ID], $filters: OrderFilterInput, $first: ConnectionLimitInt, $offset: Int) {
  draftOrders(shopIds: $shopIds, filters: $filters, first: $first, offset: $offset) {
    nodes{
	    _id
      referenceId
      cartId
      cartToken
      createdAt
      orderId
      order{
        referenceId
      }
      account{
        name
        firstName
        lastName
        primaryEmailAddress
      }
      status
      shopId
    }
    totalCount
  }
}
`;