// Utility functions for handling Shopify order data

/**
 * Parse a Shopify order into the format needed for the addOrder mutation
 * @param {Object} shopifyOrder - The order data from Shopify
 * @returns {Object} - Formatted order data for GraphQL mutation
 */
export const formatShopifyOrderForMutation = (shopifyOrder) => {
    // Extract the userId from local storage or other auth state
    const userId = localStorage.getItem('userId') || ''; 
    
    // Create a formatted order object that matches the GraphQL mutation structure
    return {
      id: shopifyOrder.id || '',
      name: shopifyOrder.name || '',
      note: shopifyOrder.note || null,
      tags: shopifyOrder.tags || [],
      processedAt: shopifyOrder.processedAt || new Date().toISOString(),
      shopDomain: shopifyOrder.shopDomain || '',
      totalPriceSet: {
        shopMoney: {
          amount: shopifyOrder.totalPriceSet?.shopMoney?.amount || '0.00',
          currencyCode: shopifyOrder.totalPriceSet?.shopMoney?.currencyCode || 'USD'
        }
      },
      customer: {
        firstName: shopifyOrder.customer?.firstName || '',
        lastName: shopifyOrder.customer?.lastName || '',
        email: shopifyOrder.customer?.email || '',
        phone: shopifyOrder.customer?.phone || '',
        displayFinancialStatus: shopifyOrder.customer?.displayFinancialStatus || null
      },
      shippingAddress: {
        address1: shopifyOrder.shippingAddress?.address1 || '',
        address2: shopifyOrder.shippingAddress?.address2 || '',
        city: shopifyOrder.shippingAddress?.city || '',
        province: shopifyOrder.shippingAddress?.province || null,
        country: shopifyOrder.shippingAddress?.country || '',
        zip: shopifyOrder.shippingAddress?.zip || '',
        phone: shopifyOrder.shippingAddress?.phone || ''
      },
      displayFulfillmentStatus: shopifyOrder.displayFulfillmentStatus || 'UNFULFILLED',
      displayFinancialStatus: shopifyOrder.displayFinancialStatus || 'PENDING',
      lineItems: shopifyOrder.lineItems || { edges: [] },
      fulfillmentOrders: shopifyOrder.fulfillmentOrders || { edges: [] },
      user: userId
    };
  };
  
  /**
   * Add IDs to line items if they don't have them
   * @param {Object} orderData - The order data with lineItems
   * @returns {Object} - Order data with IDs added to line items
   */
  export const ensureLineItemIds = (orderData) => {
    if (!orderData.lineItems?.edges) return orderData;
    
    const updatedLineItems = {
      edges: orderData.lineItems.edges.map(edge => {
        if (!edge.node.id) {
          // Generate a random ID if none exists
          const randomId = `gid://shopify/LineItem/${Date.now()}-${Math.random().toString(36).substring(7)}`;
          return {
            ...edge,
            node: {
              ...edge.node,
              id: randomId
            }
          };
        }
        return edge;
      })
    };
    
    return {
      ...orderData,
      lineItems: updatedLineItems
    };
  };
  
  /**
   * Create an order from a confirmed Shopify order
   * @param {Object} order - The order data from Shopify
   * @returns {Object} - Formatted order data
   */
  export const prepareConfirmedOrderForAdd = (order) => {
    const formattedOrder = formatShopifyOrderForMutation(order);
    return ensureLineItemIds(formattedOrder);
  };