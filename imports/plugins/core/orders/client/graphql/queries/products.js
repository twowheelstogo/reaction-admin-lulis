import gql from "graphql-tag";

export default gql`
  query products($shopIds: [ID]!, $productIds: [ID], $query: String, $first: ConnectionLimitInt, $offset: Int) {
    products(shopIds: $shopIds, productIds: $productIds, query: $query, first: $first, offset: $offset) {
      nodes {
        _id
        title
        currentProductHash
        isVisible
        media {
          URLs {
            thumbnail
          }
        }
        price {
          range
          
        }
        pricing {
          compareAtPrice {
            displayAmount
          }
          displayPrice
          price
        }
        publishedProductHash
        variants {
          _id
          pricing {
            price
          }
        }
        shop {
          _id
        }
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
}
`;
