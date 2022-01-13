import gql from "graphql-tag";

export default gql`
query catalogItemsQuery($shopId: ID!, $tagIds: [ID] $first: ConnectionLimitInt, $last:  ConnectionLimitInt, $before: ConnectionCursor, $after: ConnectionCursor, $sortBy: CatalogItemSortByField, $sortByPriceCurrencyCode: String, $sortOrder: SortOrder, $searchQuery: String) {
  catalogItems(shopIds: [$shopId], tagIds: $tagIds, first: $first, last: $last, before: $before, after: $after, sortBy: $sortBy, sortByPriceCurrencyCode: $sortByPriceCurrencyCode, sortOrder: $sortOrder, searchQuery: $searchQuery) {
    totalCount
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        _id
        ... on CatalogItemProduct {
          product {
            _id
            title
            productId
            slug
            description
            pageTitle
            vendor
            isLowQuantity
            isSoldOut
            isBackorder
            tagIds
            productType
            productBundle {
              groups {
                items {
                _id
                description
                slug
                title
                pageTitle
                media {
                  URLs {
                    thumbnail
                    small
                    large
                    medium
                  }
                }
                variants{
                  odooProduct
                }
                pricing{
                  displayPrice
                  price
                }
              }
              }
              items {
                _id
                description
                slug
                title
                pageTitle
                media {
                  URLs {
                    thumbnail
                    small
                    large
                    medium
                  }
                }
                variants{
                  odooProduct
                }
                pricing{
                  displayPrice
                  price
                }
              }
            }
            metafields {
              description
              key
              namespace
              scope
              value
              valueType
            }
            shop {
              currency {
                code
              }
            }
            pricing {
              compareAtPrice {
                displayAmount
              }
              currency {
                code
              }
              displayPrice
              minPrice
              maxPrice
            }
            primaryImage {
              URLs {
                thumbnail
                small
                medium
                large
              }
            }
            variants{
              _id
          odooProduct
          categoryVariant
          variantId
          title
          optionTitle
          index
          pricing {
            compareAtPrice {
              displayAmount
            }
            price
            currency {
              code
            }
            displayPrice
          }
          canBackorder
          inventoryAvailableToSell
          isBackorder
          isSoldOut
          isLowQuantity
          options {
            _id
            variantId
            title
            index
            pricing {
              compareAtPrice {
                displayAmount
              }
              price
              currency {
                code
              }
              displayPrice
            }
            optionTitle
            canBackorder
            inventoryAvailableToSell
            isBackorder
            isSoldOut
            isLowQuantity
            media {
              priority
              productId
              variantId
              URLs {
                thumbnail
                small
                medium
                large
                original
              }
            }
            metafields {
              description
              key
              namespace
              scope
              value
              valueType
            }
            primaryImage {
              URLs {
                large
                medium
                original
                small
                thumbnail
              }
              priority
              productId
              variantId
            }
          }
          media {
            priority
            productId
            variantId
            URLs {
              thumbnail
              small
              medium
              large
              original
            }
          }
          metafields {
            description
            key
            namespace
            scope
            value
            valueType
          }
          primaryImage {
            URLs {
              large
              medium
              original
              small
              thumbnail
            }
            priority
            productId
            variantId
          }
            }
          }
        }
      }
    }
  }
}

`;