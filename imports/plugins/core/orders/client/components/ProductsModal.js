import React, { useEffect, useState } from "react";
import { Dialog, DialogContent as MuiDialogContent, DialogTitle as MuiDialogTitle, DialogActions } from "@material-ui/core";
import { Button, TextField } from "@reactioncommerce/catalyst";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import SelectableProducts from "./SelectableProducts";

const DialogContent = withStyles((theme) => ({
    root: {
    }
}))(MuiDialogContent);

const DialogTitle = withStyles((theme) => ({
    root: {
    }
}))(MuiDialogTitle);

const InputGrid = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    width: 100%;
`;

const InputCol = styled.div`
    display: flex;
    flex: 1 1 auto;
`;
/**
 * @name ProductsModal
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */

const itemMetaFields = (itemProps, cartItems) => {

    console.log(cartItems)

    const currentItem = (cartItems || []).find((item) => itemProps.productId == item.productConfiguration.productId);

    const currMetafields = currentItem && [...currentItem?.metafields] || [];

    currMetafields.push({
        key: currMetafields.length.toString(),
        value: JSON.stringify((itemProps.bundleItems || []).map((element, index) => ({
            quantity: element.quantity,
            _id: element._id,
            title: element.title,
            description: element.description,
            media: element.media,
            pageTitle: element.pageTitle,
            pricing: element.pricing,
            odooProduct: element.variants[0].odooProduct || null
        }))),
        valueType: "bundleItem"
    })

    return currMetafields;
}

function ProductsModal(props) {
    const [items, setItems] = useState([]);
    const { open, handleClose, value, products: productList, handleChange, handleAddItems, selectedProducts, cartItems: currentCartItems } = props;

    const onClose = () => {
        setItems([]);
        handleClose();
    }


    const cartItems = items.map((item) => {
        const variant = item.selectedVariantId ? item.variants
            .find((variant) => variant.variantId == item.selectedVariantId) : item.variants[0];

        const payload = {
            price: {
                amount: variant.pricing[0].price,
                currencyCode: "GTQ"
            },
            productConfiguration: {
                productId: item.productId,
                productVariantId: variant.variantId
            },
            quantity: 1
        };

        if (item.bundleItems) Object.assign(payload, { metafields: itemMetaFields(item, currentCartItems) });

        return payload;
    });

    const addSelectedItems = () => {
        onClose();
        console.log(cartItems);
        handleAddItems(cartItems);
    };

    const products = productList.map((product) => {
        const selected = selectedProducts.find((item) => item._id == product._id);

        return {
            ...product,
            added: Boolean(selected)
        }
    })

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={"paper"}
            maxWidth={"sm"}
            fullWidth={true}
        >
            <DialogTitle>
                <InputGrid>
                    <InputCol>
                        <TextField
                            defaultValue={value}
                            placeholder="Buscar..."
                            onChange={handleChange}
                            autoFocus
                        />
                    </InputCol>
                    <Button
                        color="primary"
                        variant="outlined"
                        isFullWidth
                    >{"Buscar"}</Button>
                </InputGrid>
            </DialogTitle>
            <DialogContent>
                <SelectableProducts
                    products={products}
                    checked={items}
                    setChecked={setItems}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={onClose}
                >
                    {"Cancelar"}
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={addSelectedItems}
                >
                    {"Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ProductsModal.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object),
    selectedProducts: PropTypes.arrayOf(PropTypes.object),
    isLoadingProducts: PropTypes.bool,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleAddItems: PropTypes.func,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    cartItems: PropTypes.array
};

ProductsModal.defaultProps = {
    value: "",
    products: [],
    selectedProducts: [],
    isLoadingProducts: false,
    open: false,
    handleClose() { },
    handleAddItems() { },
    handleChange() { },
    cartItems: []
};

export default ProductsModal;
