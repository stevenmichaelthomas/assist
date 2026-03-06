const API_VERSION = "2024-10";

async function shopifyGraphQL(
  shop: string,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
) {
  const res = await fetch(
    `https://${shop}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

export async function getRecentOrders(
  shop: string,
  accessToken: string,
  count = 25
) {
  const query = `{
    orders(first: ${count}, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          customer { firstName lastName email }
          lineItems(first: 10) {
            edges {
              node { title quantity sku
                originalUnitPriceSet { shopMoney { amount } }
              }
            }
          }
        }
      }
    }
  }`;
  const data = await shopifyGraphQL(shop, accessToken, query);
  return data.orders.edges.map((e: { node: unknown }) => e.node);
}

export async function getCustomers(
  shop: string,
  accessToken: string,
  count = 50
) {
  const query = `{
    customers(first: ${count}, sortKey: TOTAL_SPENT, reverse: true) {
      edges {
        node {
          id
          firstName
          lastName
          email
          ordersCount
          totalSpentV2 { amount currencyCode }
          lastOrder { createdAt name }
        }
      }
    }
  }`;
  const data = await shopifyGraphQL(shop, accessToken, query);
  return data.customers.edges.map((e: { node: unknown }) => e.node);
}

export async function getOrdersByMonth(
  shop: string,
  accessToken: string,
  months = 12
) {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const query = `{
    orders(first: 250, query: "created_at:>=${since.toISOString().split("T")[0]}", sortKey: CREATED_AT) {
      edges {
        node {
          createdAt
          totalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 10) {
            edges {
              node { title quantity sku
                originalUnitPriceSet { shopMoney { amount } }
              }
            }
          }
        }
      }
    }
  }`;
  const data = await shopifyGraphQL(shop, accessToken, query);
  return data.orders.edges.map((e: { node: unknown }) => e.node);
}

export async function createDraftOrder(
  shop: string,
  accessToken: string,
  input: {
    lineItems: Array<{ variantId: string; quantity: number }>;
    customerId?: string;
    note?: string;
    shippingLine?: { title: string; price: string };
  }
) {
  const mutation = `mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        totalPriceSet { shopMoney { amount currencyCode } }
        invoiceUrl
      }
      userErrors { field message }
    }
  }`;
  const data = await shopifyGraphQL(shop, accessToken, mutation, { input });
  if (data.draftOrderCreate.userErrors.length > 0) {
    throw new Error(JSON.stringify(data.draftOrderCreate.userErrors));
  }
  return data.draftOrderCreate.draftOrder;
}
