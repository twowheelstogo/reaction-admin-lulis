import gql from "graphql-tag";
import { CartPayloadFragment, IncorrectPriceFailureDetailsFragment, MinOrderQuantityFailureDetailsFragment } from "../fragments/cartFragments";

export const createCartMutation = gql`
    mutation createCartMutation($input: CreateCartInput!) {
  createCart(input: $input) {
    cart {
     ...CartPayloadFragment
    }
    incorrectPriceFailures {
      ...IncorrectPriceFailureDetailsFragment
    }
    minOrderQuantityFailures {
      ...MinOrderQuantityFailureDetailsFragment
    }
    clientMutationId
    token
  }
}
  ${CartPayloadFragment}
  ${IncorrectPriceFailureDetailsFragment}
  ${MinOrderQuantityFailureDetailsFragment}
`;

export const addCartItemsMutation = gql`
    mutation addCartItemsMutation($input: AddCartItemsInput!) {
  addCartItems(input: $input) {
    cart {
      ...CartPayloadFragment
    }
    incorrectPriceFailures {
      ...IncorrectPriceFailureDetailsFragment
    }
    minOrderQuantityFailures {
      ...MinOrderQuantityFailureDetailsFragment
    }
    clientMutationId
  }
}
  ${CartPayloadFragment}
  ${IncorrectPriceFailureDetailsFragment}
  ${MinOrderQuantityFailureDetailsFragment}
`;

export const addDraftOrderCartItemsMutation = gql`
  mutation addDraftOrderCartItems($input: AddDraftOrderCartItemsInput!) {
    addDraftOrderCartItems(input: $input) {
      cart {
        ...CartPayloadFragment
      }
      clientMutationId
    }
  }
  ${CartPayloadFragment}
`;

export const reconcileCartsMutation = gql`
    mutation reconcileCartsMutation($input: ReconcileCartsInput!) {
  reconcileCarts(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;

export const removeCartItemsMutation = gql`
    mutation removeCartItemsMutationFromDraftOrder($input: RemoveCartItemsFromDraftOrderInput!) {
      removeCartItemsFromDraftOrder(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
${CartPayloadFragment}
`;

export const setEmailOnAnonymousCartMutation = gql`
    mutation setEmailOnAnonymousCartMutation($input: SetEmailOnAnonymousCartInput!) {
  setEmailOnAnonymousCart(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
${CartPayloadFragment}
`;

export const setFulfillmentOptionCartMutation = gql`
    mutation setFulfillmentOptionCartMutation($input: SelectFulfillmentOptionForGroupFromDraftOrderInput!) {
      selectFulfillmentOptionForGroupFromDraftOrder(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;

export const setShippingAddressCartMutation = gql`
    mutation setShippingAddressCartMutation($input: SetShippingAddressFromDraftOrderInput!) {
  setShippingAddressFromDraftOrder(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;

export const setPickupDetailsOnCartMutation = gql`
    mutation setPickupDetailsOnCartMutation($input: SetPickupDetailsOnCartInput!){
  setPickupDetailsOnCart(input: $input){
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;

export const updateCartItemsQuantityMutation = gql`
    mutation updateCartItemsQuantityMutation($input: UpdateCartItemsQuantityFromDraftOrdersInput!) {
  updateCartItemsQuantityFromDraftOrders(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
 ${CartPayloadFragment}
`;

export const updateFulfillmentOptionsForGroup = gql`
    mutation updateFulfillmentOptionsForGroupFromDraftOrder($input: UpdateFulfillmentOptionsForGroupFromDraftOrderInput!) {
      updateFulfillmentOptionsForGroupFromDraftOrder(input: $input) {
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;

export const updateFulfillmentTypeForGroup = gql`
    mutation updateFulfillmentTypeForGroup($input: UpdateFulfillmentTypeForGroupFromDraftOrderInput!){
  updateFulfillmentTypeForGroupFromDraftOrder(input: $input){
    cart {
      ...CartPayloadFragment
    }
  }
}
  ${CartPayloadFragment}
`;
