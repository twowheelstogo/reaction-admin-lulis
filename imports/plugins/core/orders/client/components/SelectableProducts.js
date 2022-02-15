import React, { useState } from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PropTypes from "prop-types";
import RenderMedia from './RenderMedia';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import ExpandLess from 'mdi-material-ui/ChevronUp';
import ExpandMore from 'mdi-material-ui/ChevronDown';
import Collapse from "@material-ui/core/Collapse";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { applyTheme } from "@reactioncommerce/components/utils";

const ItemContentQuantityInput = styled.div`
  margin-top: ${applyTheme("CartItem.quantityInputSpacingAbove")};
  margin-bottom: ${applyTheme("CartItem.quantityInputSpacingBelow")};
  margin-left: 0;
  margin-right: 0;
  @media (min-width: 992px) {
    margin-top: ${(props) => (props.isMiniCart ? applyTheme("CartItem.quantityInputSpacingAbove")(props) : "0")};
    margin-bottom: ${(props) => (props.isMiniCart ? applyTheme("CartItem.quantityInputSpacingBelow")(props) : "0")};
  }
`;

const useStyles = makeStyles((theme) => ({
    media: {
        width: "40px"
    },
    text: {
        paddingLeft: theme.spacing(1)
    }
}));

const mergeGroupItems = (groups) => {
    let mergedList = [];

    for (var group of groups) {
        mergedList = [...mergedList, ...group.items];
    }

    return mergedList;
}

function SelectableProducts(props) {
    const classes = useStyles();
    const { products, checked, setChecked } = props;
    const [seeItems, setSeeItems] = useState(null);
    const [seeVariants, setSeeVariants] = useState(null);

    const handleToggle = (value) => {
        const currentIndex = checked.findIndex((item) => item._id == value._id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const renderBundleItems = (items, catalogItem) => {
        const {
            components: {
                QuantityInput
            }
        } = props;

        const handleChangeQuantity = (bundleItem, quantity) => {

            const currentIndex = checked.findIndex((item) => item._id == catalogItem._id);

            if (currentIndex == -1) {
                const items = [];
                items.push({ ...bundleItem, quantity: 1 });
                Object.assign(catalogItem, { bundleItems: items });
                handleToggle(catalogItem);
            } else {
                const current = checked[currentIndex];
                const items = current.bundleItems || [];
                const bundleIndex = items.findIndex((item) => item._id == bundleItem._id);

                if (bundleIndex == -1) {
                    items.push({
                        ...bundleItem,
                        quantity: quantity
                    });
                } else {
                    if (quantity == 0 || quantity == -1) {
                        items.splice(bundleIndex, 1);
                    } else {
                        items[bundleIndex] = {
                            ...items[bundleIndex],
                            quantity: quantity
                        };
                    }
                }
                current.bundleItems = items;
                const newItem = [...checked];
                if (items.length > 0) {
                    newItem[currentIndex] = current;
                } else {
                    newItem.splice(currentIndex, 1);
                }

                setChecked(newItem);
            }
        }

        return (
            <List dense>
                {items.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    const selectedCatalogItem = checked.find((item) => item._id == catalogItem._id);
                    const itemQuantity = selectedCatalogItem && (selectedCatalogItem.bundleItems || []).find((bundleItem) => bundleItem._id == value._id);

                    return (<ListItem key={`${value._id}`}>
                        <ListItemAvatar className={classes.media}>
                            <RenderMedia media={value.media} />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={value.title} className={classes.text} />
                        <ListItemSecondaryAction>
                            <ItemContentQuantityInput>
                                <QuantityInput value={itemQuantity?.quantity || 0} onChange={(qty) => handleChangeQuantity(value, qty)} />
                            </ItemContentQuantityInput>
                        </ListItemSecondaryAction>
                    </ListItem>);
                })}
            </List>
        );
    };

    const renderVariants = (items, currentItem) => {

        return (
            <List>
                {items.map((variant) => {
                    const labelId = `checkbox-list-secondary-label-${variant.variantId}`;
                    const value = {
                        ...currentItem,
                        selectedVariantId: variant.variantId
                    };

                    const chkd = checked.find((item) => item._id == variant._id);

                    const selected = chkd && chkd.selectedVariantId == variant.variantId;

                    console.log("selected", selected);
                    console.log(checked)

                    return (<ListItem key={`${variant._id}`}>
                        <ListItemAvatar className={classes.media}>
                            <RenderMedia media={variant.media} />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={variant.title} className={classes.text} />
                        <ListItemSecondaryAction>
                            <ItemContentQuantityInput>
                                <Checkbox
                                    edge="end"
                                    // disabled={variant.added || variant.productType == "bundle"}
                                    onChange={() => handleToggle(value)}
                                    checked={selected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ItemContentQuantityInput>
                        </ListItemSecondaryAction>
                    </ListItem>);
                })}
            </List>
        )
    };

    return (
        <List dense>
            {(products).map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                console.log(value._id == seeItems);

                return (
                    <div>
                        <ListItem key={`${value._id}`} button onClick={value.productType != "bundle" && value.variants.length == 1 ? () => handleToggle(value) : () => setSeeItems(!seeItems ? value._id : null)}>
                            <ListItemAvatar className={classes.media}>
                                {value.primaryImage
                                    ? <img
                                        src={value.primaryImage.URLs.small}
                                        alt={"productThumbnail"}
                                        width="100%"
                                    />
                                    : <img
                                        src={"/resources/placeholder.gif"}
                                        alt={"productThumbnail"}
                                        width="100%"
                                    />}
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={value.title} secondary={value.productType == "bundle" && "Bundle"} className={classes.text} />
                            <ListItemSecondaryAction>
                                {value.productType != "bundle" && value.variants.length == 1
                                    ? <Checkbox
                                        edge="end"
                                        disabled={value.added || value.productType == "bundle"}
                                        onChange={() => handleToggle(value)}
                                        checked={checked.findIndex((item) => item._id == value._id) !== -1 || value.added}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    /> : <ListItemIcon
                                        onClick={() => setSeeItems(!seeItems ? value._id : null)}>{value._id == seeItems ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>}
                            </ListItemSecondaryAction>
                        </ListItem>
                        {value.productType == "bundle" && (
                            <Collapse in={value._id == seeItems} timeout="auto" unmountOnExit>
                                {renderBundleItems(mergeGroupItems(value.productBundle?.groups) || [], value)}
                            </Collapse>
                        )}
                        {value.variants.length > 1 && (
                            <Collapse in={value._id == seeItems} timeout="auto" unmountOnExit>
                                {renderVariants(value.variants, value)}
                            </Collapse>
                        )}
                        <Divider />
                    </div>
                );
            })}
        </List>
    );
}

SelectableProducts.propTypes = {
    products: PropTypes.array,
    checked: PropTypes.array,
    setChecked: PropTypes.func,
    components: PropTypes.shape({
        QuantityInput: PropTypes.any
    })
};

SelectableProducts.defaultProps = {
    products: [],
    checked: [],
    setChecked() { }
};

export default withComponents(SelectableProducts);
