import { useApolloClient, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { GET_ShopDomain_BY_USER_EMAIL, GET_Order_Currier_ByShopDomain } from "../../Graphql/Query/userStoreQuery";
import AuthContext from "../../Providers/AuthContext";

const SavedOrder = () => {
    const client = useApolloClient();
    const { currentUser } = useContext(AuthContext);

    const [orders, setOrders] = useState([]);
    const [shopDomains, setShopDomains] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // First query: get shop domains for current user
    const { loading: loadingDomains, data: domainData } = useQuery(GET_ShopDomain_BY_USER_EMAIL, {
        variables: { email: currentUser?.email },
        skip: !currentUser?.email, // avoid query until email is available
    });

    // Extract and save domains when domainData is available
    useEffect(() => {
        if (domainData?.shopDomainByUserEmail) {
            const domains = domainData.shopDomainByUserEmail
                .map((store) => {
                    try {
                        const url = new URL(store.storeUrl);
                        return url.hostname.split(".")[0]; // extract shopDomain
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);

            setShopDomains(domains);
        }
    }, [domainData]);

    // Fetch orders after domains are ready
    useEffect(() => {
        if (shopDomains.length === 0) return;

        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const allOrders = [];

                for (const domain of shopDomains) {
                    const { data } = await client.query({
                        query: GET_Order_Currier_ByShopDomain,
                        variables: { shopDomain: domain },
                        fetchPolicy: "no-cache",
                    });

                    if (data?.orderByShopDomain?.length > 0) {
                        allOrders.push(...data.orderByShopDomain);
                    }
                }

                setOrders(allOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [shopDomains, client]);

    return (
        <div className="overflow-x-auto p-4">
            {loadingDomains || loadingOrders ? (
                <div className="text-center text-lg font-semibold text-blue-500">Loading Orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center text-gray-500">No orders found</div>
            ) : (
                <table className="table w-full border">
                    <thead>
                        <tr className="bg-base-200 text-sm text-base-content">
                            <th>Customer</th>
                            <th>Shipping Address</th>
                            <th>Order Info</th>
                            <th>Courier Info</th>
                            <th>Status & Total</th>
                            <th>Line Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order?.id} className="hover">
                                <td className="whitespace-pre-line">
                                    {order?.customer?.firstName} {order?.customer?.lastName}{"\n"}
                                    {order?.customer?.email}{"\n"}
                                    {order?.customer?.phone}
                                </td>
                                <td className="whitespace-pre-line">
                                    {order?.shippingAddress?.address1} {order?.shippingAddress?.address2}{"\n"}
                                    {order?.shippingAddress?.city}, {order?.shippingAddress?.zip}{"\n"}
                                    {order?.shippingAddress?.province}, {order?.shippingAddress?.country}{"\n"}
                                    📞 {order?.shippingAddress?.phone}
                                </td>
                                <td className="whitespace-pre-line">
                                    🆔 {order?.id}{"\n"}
                                    📦 {order?.name}{"\n"}
                                    🏪 {order?.shopDomain}
                                </td>
                                <td className="whitespace-pre-line">
                                    🚚 {order?.courier?.tracking_code || "N/A"}{"\n"}
                                    🆔 {order?.courier?.consignment_id || "N/A"}{"\n"}
                                    🧾 {order?.courier?.invoice || "N/A"}
                                </td>
                                <td className="whitespace-pre-line">
                                    💳 {order?.displayFinancialStatus}{"\n"}
                                    📦 {order?.displayFulfillmentStatus}{"\n"}
                                    💰 {order?.totalPriceSet?.shopMoney?.amount}{" "}
                                    {order?.totalPriceSet?.shopMoney?.currencyCode}
                                </td>
                                <td className="whitespace-pre-line">
                                    {order?.lineItems?.edges?.map((item, index) => (
                                        <div key={index}>
                                            🛒 {item?.node?.title} ({item?.node?.sku})
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SavedOrder;
