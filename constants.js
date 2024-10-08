const ROLES = {
  AGENT: "Agent",
  CUSTOMER: "Customer",
};

const ORDER_STATUS = {
  ACTIVE: "Active",
  IN_ACTIVE: "In Active",
};

const AGENT_STATUS = {
  ORDERED: "Ordered",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
};

const CUSTOMER_STATUS = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
};

const IN_PROGRESS_STATUS = {
  ORDER_PLACED: "Order Placed",
  COST_ESTIMATE: "Cost Estimate",
  ITEMS_GATHERING: "Items Gathering",
  SHIPPING_ESTIMATE: "Shipping Estimate",
  SHIPPED: "Shipped",
};

module.exports = {
  ROLES,
  AGENT_STATUS,
  CUSTOMER_STATUS,
  IN_PROGRESS_STATUS,
  ORDER_STATUS,
};
