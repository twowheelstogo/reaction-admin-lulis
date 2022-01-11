import React from "react";
import PropTypes from "prop-types";
import { i18next } from "/client/api";
import Chip from "@reactioncommerce/catalyst/Chip";
import { Box } from "@material-ui/core";

/**
 * @name OrderIdCell
 * @param {Object} row A react-table row object
 * @param {Object} history Router history API
 * @return {React.Component} A date component
 */
function OrderBranchCell({ cell, row }) {
  const getBranchName = () => {
    try {
      const { original } = row;
      const { fulfillmentGroups } = original;
      const [fulfillmentGroup] = fulfillmentGroups;
      const { type: shippingType } = fulfillmentGroup;
      const { data: dataOrder } = fulfillmentGroup;
      if (shippingType === "pickup") {
        const { pickupDetails } = dataOrder;
        return pickupDetails.branch;
      } else {
        const { shippingAddress } = dataOrder;
        return shippingAddress.metaddress.distance.branch;
      }
    } catch (err) {
      return "sin sucursal";
    }
  };
  return (
    <Box style={{ whiteSpace: "nowrap" }}>
      <Box component="span" paddingRight={2}>
        {getBranchName()}
      </Box>
    </Box>
  );
}

OrderBranchCell.propTypes = {
  cell: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

export default OrderBranchCell;
