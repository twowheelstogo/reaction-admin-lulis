import { useState, useMemo, useEffect, useCallback } from "react";
import catalogItemsQuery from "../graphql/queries/catalogItems";
import cartByAccountIdQuery from "../graphql/queries/cartByAccountId";
import anonymousCartByCartIdQuery from "../graphql/queries/anonymousCartByCartId";
import draftOrderQuery from "../graphql/queries/draftOrder";
import { useQuery, useMutation, useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useIsMount } from "../helpers";
import {
    removeCartItemsMutation,
    setShippingAddressCartMutation,
    updateCartItemsQuantityMutation,
    setFulfillmentOptionCartMutation,
    updateFulfillmentOptionsForGroup as updateFulfillmentOptionsForGroupMutation,
    updateFulfillmentTypeForGroup as updateFulfillmentTypeForGroupMutation,
    addDraftOrderCartItemsMutation
} from "../graphql/mutations/cart";
import {
    createDraftOrderCartMutation,
    addDraftOrderAccountMutation,
    updateDraftOrderMutation,
    deleteDraftOrderMutation
} from "../graphql/mutations/draftOrder";
import {
    placeOrderMutation
} from "../graphql/mutations/order";
import { addAccountAddressBookEntryMutation } from "../graphql/mutations/account";
import { useHistory } from "react-router-dom";

/**
 * @method useDraftOrder
 * @summary useDraftOrder hook
 * @param {Object} args input arguments
 * @param {String} args.shopId  Shop Id to load draft order data for
 * @returns {Object} Result containing the draft order and other helpers for managing that draft order
 */
function useDraftOrder(args = {}) {
    const { enqueueSnackbar } = useSnackbar();
    const isMounted = useIsMount();
    const apolloClient = useApolloClient();
    const {
        shopId: shopIdProp,
        draftOrderId: draftOrderIdProp
    } = args;

    const routeParams = useParams();
    const history = useHistory();
    const shopId = routeParams.shopId || shopIdProp;
    const draftOrderId = routeParams.draftOrderId || draftOrderIdProp;
    const [query, setQuery] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedFulfillmentMethod, setSelectedFulfillmentMethod] = useState(null);
    const [selectedFulfillmentType, setSelectedFulfillmentType] = useState("shipping");
    const [anonymousCartId, setAnonymousCartId] = useState(null);
    const [anonymousCartToken, setAnonymousCartToken] = useState(null);
    const [billingDetails, setBillingDetails] = useState({
        nit: "CF",
        name: "",
        isCf: true,
        address: "ciudad",
        country: "GUATEMALA",
        depto: "GUATEMALA",
        city: "GUATEMALA",
        partnerId: -1
    });
    const [giftDetails, setGiftDetails] = useState({});
    const [note, setNote] = useState(null);
    const [withoutBilling, setWithoutBilling] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [instantDelivery, setInstantDelivery] = useState(true);

    const [addDraftOrderAccount] = useMutation(addDraftOrderAccountMutation);
    const [updateFulfillmentOptionsForGroup] = useMutation(updateFulfillmentOptionsForGroupMutation);
    const [updateFulfillmentTypeForGroup] = useMutation(updateFulfillmentTypeForGroupMutation);

    /**Query to get products */
    // const { data: productsQueryResult, isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery(productsQuery, {
    //     variables: {
    //         shopIds: [shopId],
    //         query
    //     },
    //     skip: !shopId
    // });
    /**Query to get catalogItems */
    const { data: productsQueryResult, isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery(catalogItemsQuery, {
        variables: {
            searchQuery: query,
            shopId
        },
        skip: !shopId
    });

    /**Query to get draft order */
    const { data: draftOrderQueryResult, loading: isLoadingDraftOrder, refetch: refetchDraftOrder } = useQuery(draftOrderQuery, {
        variables: {
            draftOrderId
        }
    });

    const { draftOrder } = draftOrderQueryResult || {};

    const { account: accountData } = draftOrder || {};

    const selectedAccount = useMemo(() => {
        if (accountData) {
            return accountData;
        }

        return null;
    }, [accountData]);

    useEffect(() => {

        if (draftOrder) {
            if (draftOrder.notes) {
                setNote(draftOrder.notes[0].content)
            }
            if (draftOrder.billing) {
                setBillingDetails(draftOrder.billing);
            }
            if (draftOrder.giftNote) {
                setGiftDetails(draftOrder.giftNote);
            }
            if (draftOrder.deliveryDate) {
                const date = new Date(draftOrder.deliveryDate);
                setDeliveryDate(date);
                setInstantDelivery(false);
            }
        }
    }, [draftOrder])

    const shouldSkipAccountCartByAccountIdQuery = Boolean(!selectedAccount || anonymousCartToken || anonymousCartId || isLoadingDraftOrder || !shopId);
    const shouldSkipAnonymousCartByCartIdQuery = Boolean(selectedAccount || isLoadingDraftOrder || !anonymousCartId || !anonymousCartToken);

    /**Query to get account cart */
    const [
        fetchAccountCart,
        { loading: isLoadingAccountCart, called: accountCartQueryCalled, data: cartData, fetchMore, refetch: refetchAccountCart }
    ] = useLazyQuery(cartByAccountIdQuery, {
        variables: {
            shopId,
            accountId: selectedAccount?._id || null
        },
        poliInterval: shouldSkipAccountCartByAccountIdQuery ? 0 : 10000
    });

    /**Query to get anonymous cart */
    const [
        fetchAnonymousCart,
        { data: cartDataAnonymous, called: anonymousCartQueryCalled, refetch: refetchAnonymousCart, loading: isLoadingAnonymousCart }
    ] = useLazyQuery(anonymousCartByCartIdQuery, {
        variables: {
            cartId: anonymousCartId,
            cartToken: anonymousCartToken
        },
        poliInterval: shouldSkipAnonymousCartByCartIdQuery ? 0 : 10000
    });

    if (!accountCartQueryCalled && !shouldSkipAccountCartByAccountIdQuery) {
        fetchAccountCart();
    } else if (!anonymousCartQueryCalled && !shouldSkipAnonymousCartByCartIdQuery) {
        fetchAnonymousCart();
    }

    const { catalogItems } = productsQueryResult || {};
    const { edges } = catalogItems || {};
    const products = (edges || []).map((item) => item.node.product);

    const addDraftOrderItems = (items) => {

        const itemsWithQuantity = items.map((curr) => ({ ...curr, quantity: 1 }));
        setSelectedProducts((current) => [...current, ...itemsWithQuantity]);
    };

    const cart = useMemo(() => {
        if (!shouldSkipAccountCartByAccountIdQuery && cartData) {
            return cartData.cart;
        }
        if (!shouldSkipAnonymousCartByCartIdQuery && cartDataAnonymous) {
            return cartDataAnonymous.cart;
        }

        return {};
    }, [cartData, cartDataAnonymous, shouldSkipAccountCartByAccountIdQuery, shouldSkipAnonymousCartByCartIdQuery]);

    /**Mutation to add or create cart */
    const [
        addOrCreateCartMutation, {
            loading: addOrCreateCartLoading
        }] = useMutation(cart && cart._id ? addDraftOrderCartItemsMutation : createDraftOrderCartMutation);


    const cartIdAndCartToken = () => {
        // const { accountCartId, anonymousCartId, anonymousCartToken } = cartStore;
        let cartToken = {};
        if (!selectedAccount) {
            cartToken = { cartToken: anonymousCartToken };
        }

        return {
            cartId: cart._id || anonymousCartId,
            ...cartToken
        };
    };

    const handleAddItemsToCart = async (items) => {
        const input = {};

        if (Object.keys(cart || {}).length == 0 || !cart) {
            input.draftOrderId = draftOrderId;
            input.shopId = shopId;

            if (selectedAccount) {
                input.accountId = selectedAccount._id;
            }

            input.createCartInput = {
                shopId,
                items
            };

        } else {
            input.items = items;

            if (cart._id) {
                input.cartId = cart._id;
            }

            if (anonymousCartId) {
                input.cartId = anonymousCartId;
            }

            if (anonymousCartToken) {
                input.cartToken = anonymousCartToken;
            }

            if (selectedAccount) {
                input.accountId = selectedAccount._id;
            }
        }

        try {
            await addOrCreateCartMutation({
                variables: {
                    input
                }
            });
            refetchCart();
            enqueueSnackbar("Productos agregados al carrito correctamente", { variant: "success" });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };

    const handleUpdateCartItemQuantity = async (cartItems) => {

        try {
            await apolloClient.mutate({
                mutation: updateCartItemsQuantityMutation,
                variables: {
                    input: {
                        cartId: cart._id || anonymousCartId,
                        items: (Array.isArray(cartItems) && cartItems) || [cartItems],
                        cartToken: anonymousCartToken || null,
                        accountId: selectedAccount && selectedAccount._id || undefined
                    }
                },
                update: (cache, { data: mutationData }) => {
                    if (mutationData && mutationData.updateCartItemsQuantityFromDraftOrders) {
                        const { cart: cartPayload } = mutationData.updateCartItemsQuantityFromDraftOrders;

                        if (cartPayload) {
                            // Update Apollo cache
                            cache.writeQuery({
                                query: cartPayload.account ? cartByAccountIdQuery : anonymousCartByCartIdQuery,
                                variables: cartPayload.account ? {
                                    accountId: cartPayload.account && cartPayload.account._id,
                                    shopId
                                } : {
                                    cartId: anonymousCartId,
                                    cartToken: anonymousCartToken
                                },
                                data: { cart: cartPayload }
                            });
                        }
                    }
                }
            });

            enqueueSnackbar("Producto actualizado", { variant: "success" });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    }

    const handleRemoveCartItems = async (itemIds) => {
        try {
            await apolloClient.mutate({
                mutation: removeCartItemsMutation,
                variables: {
                    input: {
                        cartId: cart._id || anonymousCartId,
                        cartItemIds: (Array.isArray(itemIds) && itemIds) || [itemIds],
                        cartToken: anonymousCartToken || null,
                        accountId: selectedAccount?._id || null
                    }
                },
                update: (cache, { data: mutationData }) => {
                    if (mutationData && mutationData.removeCartItemsFromDraftOrder) {
                        const { cart: cartPayload } = mutationData.removeCartItemsFromDraftOrder;

                        if (cartPayload) {
                            // Update Apollo cache
                            cache.writeQuery({
                                query: cartPayload.account ? cartByAccountIdQuery : anonymousCartByCartIdQuery,
                                variables: cartPayload.account ? {
                                    accountId: cartPayload.account && cartPayload.account._id,
                                    shopId
                                } : {
                                    cartId: anonymousCartId,
                                    cartToken: anonymousCartToken
                                },
                                data: { cart: cartPayload }
                            });
                        }
                    }
                }
            });

            enqueueSnackbar("Producto removido", { variant: "success" });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    }
    useEffect(() => {

        if (!isMounted) {
            if (draftOrder?.cartToken) {
                setAnonymousCartId(draftOrder.cartId);
                setAnonymousCartToken(draftOrder.cartToken);
                // fetchAnonymousCart();
            }
            else if (draftOrder?.accountId) {
                setAnonymousCartId(null);
                setAnonymousCartToken(null);
                // fetchAccountCart();
            }
        }
    }, [draftOrder]);

    const changeItemQuantity = (id, quantity) => {
        const currSelectedProducts = [...selectedProducts];
        const productItems = [];
        currSelectedProducts.forEach((item) => {
            const currQuantity = item.quantity + quantity;

            if (item._id == id && currQuantity > 0) {
                productItems.push({
                    ...item,
                    quantity: currQuantity
                });
            } else {
                productItems.push(item);
            }
        });

        setSelectedProducts(productItems);
    };

    const refetchCart = () => {
        refetchDraftOrder();
        if (!shouldSkipAccountCartByAccountIdQuery && accountCartQueryCalled) {
            refetchAccountCart();
        } else if (!shouldSkipAnonymousCartByCartIdQuery && anonymousCartQueryCalled) {
            refetchAnonymousCart();
        }
    }

    const removeItem = (id) => {
        const currSelectedProducts = [...selectedProducts];

        const productsWithoutItem = currSelectedProducts.filter((item) => item._id !== id);

        setSelectedProducts(productsWithoutItem);
    };

    /**Re-fetch products every time the query has changed*/
    useEffect(() => {

        if (!isMounted) {
            refetchProducts();
        }
    }, [query]);

    const handleSelectAddress = (item) => {

        setSelectedAddress(item);
    };

    // useEffect(() => refetchCart, [selectedAccount, anonymousCartId, anonymousCartToken])

    const handleSelectAccount = async (item) => {

        try {
            await addDraftOrderAccount({
                variables: {
                    input: {
                        accountId: item._id,
                        cartId: anonymousCartId || cart?._id,
                        shopId,
                        draftOrderId
                    }
                }
            });
            setAnonymousCartId(null);
            setAnonymousCartToken(null);
            refetchCart();
            enqueueSnackbar("Cliente seleccionado", { variant: "success" });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };
    const [setFulfillmentOptionCart] = useMutation(setFulfillmentOptionCartMutation);

    const handleSelectFulfillmentMethod = async ({ fulfillmentGroupId, fulfillmentMethodId }) => {
        const input = {
            cartId: cart._id,
            fulfillmentGroupId,
            fulfillmentMethodId,
            accountId: selectedAccount._id
        };
        if (anonymousCartId) Object.assign(input, { cartToken: anonymousCartToken });

        try {
            await setFulfillmentOptionCart({
                variables: {
                    input
                }
            });

            refetchCart();
            enqueueSnackbar("Tarifa actualizada", { variant: "success" });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };

    const handleSelectFulfillmentType = async ({ fulfillmentGroupId, fulfillmentType }) => {
        if (!selectedAccount) throw new Error("Debes seleccionar un cliente primero");

        try {
            await updateFulfillmentTypeForGroup({
                variables: {
                    input: {
                        ...cartIdAndCartToken(),
                        fulfillmentGroupId,
                        fulfillmentType,
                        accountId: selectedAccount && selectedAccount._id
                    }
                }
            });

            handleUpdateFulfillmentOptionsForGroup(fulfillmentGroupId);
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };

    const [setShippingAddressOnCart] = useMutation(setShippingAddressCartMutation, {
        onCompleted({ setShippingAddressFromDraftOrder }) {
            handleUpdateFulfillmentOptionsForGroup(setShippingAddressFromDraftOrder.cart.checkout?.fulfillmentGroups[0]._id);
        }
    });

    const cleanTypenames = (object) => {
        const omitTypename = (key, value) => (key === "__typename" ? undefined : value);

        return JSON.parse(JSON.stringify(object), omitTypename);
    }

    const handleSelectShippingAddress = async (address) => {
        const addressId = address._id;
        delete address._id;

        const input = {
            ...cartIdAndCartToken(),
            address: cleanTypenames(address),
            addressId
        };

        if (selectedAccount) Object.assign(input, { accountId: selectedAccount._id });

        try {
            await setShippingAddressOnCart({
                variables: {
                    input
                }
            });
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };

    const [
        addAccountAddressBookEntry,
        { loading: addingAddressbook }
    ] = useMutation(addAccountAddressBookEntryMutation, {
        onCompleted({ addAccountAddressBookEntry: payload }) {
            const { address } = payload;

            handleSelectShippingAddress(address);
            refetchCart();
        }
    });

    const validateAddressSchema = (input) => {

        if (!input.description) throw new Error(`El campo "Descripción es requerido`);
        if (!input.address) throw new Error(`El campo "Dirección completa" es requerido`);
        if (!input.geolocation && !input.metaddress) throw new Error(`Es necesario que indiques una posición de entrega`);
        if (!input.receiver) throw new Error(`Es necesario que indiques a quién se le entrega la orden`);
        if (!input.phone) throw new Error(`Un número de teléfono es requerido`);
    }

    const handleAddAccountAddressBook = async (address) => {

        try {
            if (!selectedAccount) throw new Error("Debes seleccionar una cuenta primero");

            validateAddressSchema(address);

            await addAccountAddressBookEntry({
                variables: {
                    input: {
                        address,
                        accountId: selectedAccount._id
                    }
                }
            });
            enqueueSnackbar("Dirección creada correctamente", { variant: "success" });
        } catch (error) {
            console.error(error.message.replace("GraphQL error: ", ""));
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    }

    const handleUpdateFulfillmentOptionsForGroup = async (fulfillmentGroupId) => {
        const input = {
            ...cartIdAndCartToken(),
            fulfillmentGroupId
        };
        if (selectedAccount) {
            Object.assign(input, { accountId: selectedAccount._id });
        }

        await updateFulfillmentOptionsForGroup({
            variables: {
                input
            }
        });
        refetchCart();
    };

    const [
        placeOrder,
        { loading: placingOrder }
    ] = useMutation(placeOrderMutation, {
        onCompleted({ placeOrderFromDraftOrder }) {
            apolloClient.cache.writeQuery({
                query: cartByAccountIdQuery,
                data: { cart: null },
                variables: {
                    accountId: selectedAccount && selectedAccount._id,
                    shopId
                }
            })
            history.push(`/${shopId}/orders`);
        }
    });

    const date = new Date();

    const buildNote = [{
        content: (withoutBilling && note && note.concat(" - ", "NO ENVIAR FACTURA")) || withoutBilling && "NO ENVIAR FACTURA" || note,
        createdAt: date,
        updatedAt: date
    }];

    const buildOrder = async () => {
        const { checkout } = cart;
        if (!selectedAccount) throw new Error("Debes seleccionar un cliente");

        const fulfillmentGroups = (checkout.fulfillmentGroups || []).map((group) => {
            const { data } = group;
            let { selectedFulfillmentOption } = group;

            const items = cart.items.edges.map(({ node: item }) => ({
                addedAt: item.addedAt,
                price: item.price.amount,
                productConfiguration: item.productConfiguration,
                quantity: item.quantity,
                metafields: item.metafields || []
            }));
            if (!selectedFulfillmentOption || selectedFulfillmentOption == null) {
                throw new Error("No has seleccionado una dirección de envío");
            }
            return {
                data,
                items,
                selectedFulfillmentMethodId: selectedFulfillmentOption.fulfillmentMethod._id,
                shopId: group.shop._id,
                totalPrice: checkout.summary.total.amount,
                type: group.type
            };
        });

        console.log(buildNote);

        return {
            cartId: cart._id,
            currencyCode: checkout.summary.total.currency.code,
            email: selectedAccount.primaryEmailAddress,
            fulfillmentGroups,
            shopId,
            deliveryDate: (!instantDelivery && deliveryDate) || null,
            notes: buildNote[0].content && buildNote
        };
    };

    const buildPayment = [{
        amount: cart && cart.checkout && cart.checkout.summary.total.amount,
        method: "none"
    }];

    const buildBilling = {
        customerName: "CF",
        nit: "CF",
        address: "ciudad",
        country: "GUATEMALA",
        depto: "GUATEMALA",
        city: "GUATEMALA"
    };

    const handlePlaceOrder = async () => {

        try {
            const order = cleanTypenames(await buildOrder());
            console.log(order);
            Object.assign(order, { billing: buildBilling });
            const input = {
                order
            };
            Object.assign(input, { draftOrderId });
            if (selectedAccount) Object.assign(input, { accountId: selectedAccount._id });
            Object.assign(input, { payments: buildPayment });
            Object.assign(input, { billing: billingDetails });
            if (giftDetails) Object.assign(input, { giftNote: giftDetails });

            await placeOrder({
                variables: {
                    input
                }
            });
            enqueueSnackbar("Orden creada correctamente!", { variant: "success" });
        } catch (error) {
            console.error(error.message.replace("GraphQL error: ", ""));
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    };

    const [updateDraftOrder] = useMutation(updateDraftOrderMutation);

    const saveChangesAsPending = useCallback(async () => {

        try {
            const input = {
                billing: billingDetails,
                giftNote: giftDetails,
                shopId,
                draftOrderId,
                notes: buildNote[0].content && buildNote
            };

            if (!instantDelivery) Object.assign(input, { deliveryDate });

            console.log(input);

            await updateDraftOrder({
                variables: {
                    input
                }
            });
            history.push(`/${shopId}/draft_orders`);
            enqueueSnackbar("Borrador guardado!", { variant: "success" });
        } catch (error) {
            console.error(error.message.replace("GraphQL error: ", ""));
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    });

    const [deleteDraftOrder] = useMutation(deleteDraftOrderMutation);

    const handleDeleteOrder = useCallback(async () => {
        console.log(draftOrder, draftOrderId);
        try {
            await deleteDraftOrder({
                variables: {
                    input: {
                        draftOrderId
                    }
                }
            });
            history.push(`/${shopId}/draft_orders`);
            enqueueSnackbar("Orden eliminada!", { variant: "success" });
        } catch (error) {
            console.error(error.message.replace("GraphQL error: ", ""));
            enqueueSnackbar(error.message.replace("GraphQL error: ", ""), { variant: "error" });
        }
    });

    const handleSelectDeliveryDate = (event) => {
        event.persist();
        setInstantDelivery(false);

        if (event.target.value.length == 0) return setInstantDelivery(true);
        const date = new Date(event.target.value);

        setDeliveryDate(date);
    };

    return {
        isLoadingProducts,
        products,
        selectedProducts,
        selectedAccount,
        selectedAddress,
        selectedFulfillmentMethod,
        selectedFulfillmentType,
        addDraftOrderItems,
        changeItemQuantity,
        addAccountAddressBookEntry: handleAddAccountAddressBook,
        setSelectedAccount: handleSelectAccount,
        setSelectedAddress: handleSelectShippingAddress,
        setSelectedFulfillmentMethod: handleSelectFulfillmentMethod,
        setSelectedFulfillmentType: handleSelectFulfillmentType,
        removeItem,
        setQuery,
        shopId,
        query,
        draftOrder,
        addingAddressbook,
        cart,
        addItemsToCart: handleAddItemsToCart,
        handleUpdateCartItemQuantity,
        handleRemoveCartItems,
        handlePlaceOrder,
        placingOrder,
        handleChangeBillingDetails: setBillingDetails,
        handleChangeGiftDetails: setGiftDetails,
        billingDetails,
        giftDetails,
        setNote,
        markAsWithoutBilling: setWithoutBilling,
        saveChangesAsPending,
        note,
        handleDeleteOrder,
        handleSelectDeliveryDate,
        handleSelectInstantDelivery: setInstantDelivery,
        deliveryDate,
        instantDelivery
    }
}

export default useDraftOrder;