import React from "react";
import InboxIcon from "mdi-material-ui/Inbox";
import ReceiptIcon from "mdi-material-ui/Receipt";
import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import ContentViewExtraWideLayout from "/imports/client/ui/layouts/ContentViewExtraWideLayout";
import { Shop } from "/imports/collections/schemas";
import OrderCardSummary from "./components/OrderCardSummary";
import Orders from "./components/OrdersTable";
import DraftOrders from "./components/DraftOrdersTable";
import Order from "./containers/OrderContainer";
import OrderPrint from "./containers/OrderPrintContainer";
import NewOrder from "./components/NewOrder";
import "./helpers";

Shop.extend({
  orderStatusLabels: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

// Register order related routes
/*
 * Single order page route
 */
registerOperatorRoute({
  MainComponent: Order,
  path: "/orders/:_id"
});

/**
 * New order page route
 */
registerOperatorRoute({
  MainComponent: NewOrder,
  path: "/draft_orders/new/:draftOrderId"
})

/*
 * Single order print layout route
 */
registerOperatorRoute({
  MainComponent: OrderPrint,
  path: "/orders/print/:_id"
});

/*
 * Orders table route
 */
registerOperatorRoute({
  group: "navigation",
  priority: 10,
  LayoutComponent: ContentViewExtraWideLayout,
  MainComponent: Orders,
  path: "/orders",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <InboxIcon {...props} />,
  sidebarI18nLabel: "admin.dashboard.ordersLabel"
});

/**
 * Draft orders table route
 */
 registerOperatorRoute({
  group: "navigation",
  priority: 10,
  LayoutComponent: ContentViewExtraWideLayout,
  MainComponent: DraftOrders,
  path: "/draft_orders",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <ReceiptIcon {...props} />,
  sidebarI18nLabel: "admin.dashboard.draftordersLabel"
});

// Register order related blocks
/*
 * OrderCardSummary
 */
registerBlock({
  region: "OrderCardSummary",
  name: "OrderCardSummary",
  component: OrderCardSummary,
  priority: 10
});
