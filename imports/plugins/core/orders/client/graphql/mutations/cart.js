import gql from "graphql-tag";
import { CartPayloadFragment, IncorrectPriceFailureDetailsFragment, MinOrderQuantityFailureDetailsFragment } from "../fragments/cartFragments";

export const createCartMutation = gql`
    mutation createCartMutation($input: CreateCartInput!) {
  createCart(input: $input) {
    cart {
     ...${CartPayloadFragment}
    }
    incorrectPriceFailures {
      ...${IncorrectPriceFailureDetailsFragment}
    }
    minOrderQuantityFailures {
      ...${MinOrderQuantityFailureDetailsFragment}
    }
    clientMutationId
    token
  }
}
`;

export const addCartItemsMutation = gql`
    mutation addCartItemsMutation($input: AddCartItemsInput!) {
  addCartItems(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
    incorrectPriceFailures {
      ...${IncorrectPriceFailureDetailsFragment}
    }
    minOrderQuantityFailures {
      ...${MinOrderQuantityFailureDetailsFragment}
    }
    clientMutationId
  }
}
`;

export const reconcileCartsMutation = gql`
    mutation reconcileCartsMutation($input: ReconcileCartsInput!) {
  reconcileCarts(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const removeCartItemsMutation = gql`
    mutation removeCartItemsMutation($input: RemoveCartItemsInput!) {
  removeCartItems(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const setEmailOnAnonymousCartMutation = gql`
    mutation setEmailOnAnonymousCartMutation($input: SetEmailOnAnonymousCartInput!) {
  setEmailOnAnonymousCart(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const setFulfillmentOptionCartMutation = gql`
    mutation setFulfillmentOptionCartMutation($input: SelectFulfillmentOptionForGroupInput!) {
  selectFulfillmentOptionForGroup(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const setShippingAddressCartMutation = gql`
    mutation setShippingAddressCartMutation($input: SetShippingAddressOnCartInput!) {
  setShippingAddressOnCart(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

const setPickupDetailsOnCartMutation = gql`
    mutation setPickupDetailsOnCartMutation($input: SetPickupDetailsOnCartInput!){
  setPickupDetailsOnCart(input: $input){
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const updateCartItemsQuantityMutation = gql`
    mutation updateCartItemsQuantityMutation($input: UpdateCartItemsQuantityInput!) {
  updateCartItemsQuantity(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const updateFulfillmentOptionsForGroup = gql`
    mutation updateFulfillmentOptionsForGroup($input: UpdateFulfillmentOptionsForGroupInput!) {
  updateFulfillmentOptionsForGroup(input: $input) {
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;

export const updateFulfillmentTypeForGroup = gql`
    mutation updateFulfillmentTypeForGroup($input:UpdateFulfillmentTypeForGroupInput!){
  updateFulfillmentTypeForGroup(input: $input){
    cart {
      ...${CartPayloadFragment}
    }
  }
}
`;
