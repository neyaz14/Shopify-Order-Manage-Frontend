import { useContext, useState } from "react";
import useStoreOrders from "../../hooks/useAllOders";
import AuthContext from "../../Providers/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { COURIER_INFO_BATCH_QUERY, COURIER_INFO_QUERY, GET_USER_BY_EMAIL } from "../../Graphql/Query/userStoreQuery";
// import axios from "axios";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { cityId } from "../../assets/PathaoCity"


import Swal from "sweetalert2";
import { ADD_COURIER, ADD_ORDER } from "../../Graphql/Mutation/userStoreMutation";
import OrderRow from "./OrderRow";




const OrderManage = () => {
    const [cursor, setCursor] = useState(null);
    const [waitingForPathaoRes, setWaitingForPathaoRes] = useState(false);
    const [addOrder, { loading, error }] = useMutation(ADD_ORDER);
    const [addCourier, { loading: addingCourierLoading }] = useMutation(ADD_COURIER);



    const axiosPublic = useAxiosPublic()
    // const [orders, setOrders] = useState([]);
    // const [loadingOrders, setLoadingOrders] = useState(false);// For pagination

    const { currentUser } = useContext(AuthContext);








    // TODO : fix the pagination 
    const handleNextPage = () => {
        // if (orders && orders.pageInfo.hasNextPage) {
        //     const nextCursor = orders.edges[orders.edges.length - 1]?.cursor;
        //     setCursor(nextCursor);
        // }
    };
    // const handlePrevPage = () => {
    //     // Optional: Handle previous page if your API supports backward pagination
    //     // setCursor(previousCursor);
    // };




    const email = currentUser?.email;




    const {
        data: userData,
        loading: userLoading,
        error: userError,
    } = useQuery(GET_USER_BY_EMAIL, {
        variables: { email },
        skip: !email,
    });

    const storeIds = userData?.userByEmail?.storeIDs.map((s) => s.id) || [];

    const { orders, isLoading, isError, refetch } = useStoreOrders(storeIds, cursor);



    // Extract all Shopify GIDs (ids)
    const shopifyIds = orders?.map((order) => order.id) || [];
    // console.log(shopifyIds)

    const { data, loading: courierLoading, error: courierError } = useQuery(
        COURIER_INFO_BATCH_QUERY,
        {
          variables: { shopifyIds },
          skip: shopifyIds.length === 0, // prevent empty queries
        }
      );
    
      // Create a map: { [shopifyId]: courierInfo }
      const courierMap = {};
      data?.courierInfosByShopifyIds?.forEach((info) => {
        courierMap[info.shopifyId] = info;
      });
    





    if (userLoading || isLoading) return <p className="text-4xl text-green-400 font-bold m-5">Fetching Data, Please wait</p>;
    if (userError || isError) return <p className="text-4xl text-red-400 font-bold m-5">Error loading data</p>;
    if (loading || addingCourierLoading) return <p className="text-4xl text-red-400 font-bold m-5">Wait.....</p>;




    // ! ---------- send to pathao 

    const handleSendPathao = async (order) => {
        setWaitingForPathaoRes(true)




        const customer = order.customer;
        const shippingAddress = order.shippingAddress;

        // console.log(order, customer, shippingAddress)

        // ? find the city id 
        const [CityID] = cityId.data.filter(city => shippingAddress.city.toLowerCase() === city.city_name.toLowerCase())
        // console.log(CityID.city_id)

        // ? call zone id
        const zoneList = await axiosPublic.get(`/cities/${CityID.city_id}/zones`)
        // console.log(zoneList.data)

        const matchedZone = zoneList.data.filter(zone => zone.zone_name === shippingAddress.province)

        // console.log(matchedZone)
        if (!matchedZone) {
            console.error('Zone not found');
            return;
        }

        // Calculate total quantity from line items
        const totalQuantity = order.lineItems.edges.reduce((total, edge) => {
            return total + edge.node.quantity;
        }, 0);
        // console.log(totalQuantity)

        // Create item description from line items
        const itemDescription = order.lineItems.edges
            .map(edge => {
                const item = edge.node;
                return `${item.title} ${item.variantTitle ? `(${item.variantTitle})` : ''} x ${item.quantity}`;
            })
            .join(", ");
        // console.log(itemDescription)

        // Get total price as COD amount
        const codAmount = Math.round(parseFloat(order.totalPriceSet.shopMoney.amount));

        // console.log(codAmount)

        try {
            const response = await axiosPublic.post('/pathao-order', {
                // These values should match the Pathao API requirements
                // ! TODO -------- has to be intiger and a stoer id
                store_id: 148411, // Required - from your environment variables
                merchant_order_id: order.name.replace('#', ''), // Optional but recommended for tracking
                recipient_name: `${customer.firstName} ${customer.lastName}`,
                // ? -------- has to be bangladeshi phone number
                recipient_phone: '01838304047',


                recipient_address: `${shippingAddress.address1} ${shippingAddress.address2 || ''}`.trim(),


                //   Pathao-এর city ID map
                recipient_city: CityID.city_id, // Required - Note: You need to map this to a cityId

                // ! TODO -------- Pathao-এর zone ID map করে পাঠাও
                // recipient_zone: shippingAddress.province || '', 
                recipient_zone: 1161,
                // // Required - Note: You need to map this to a zoneId

                recipient_area: shippingAddress?.zip || '', // ? Optional - Note: You need to map this to an areaId


                delivery_type: 48, // 48 for Normal Delivery, 12 for On-Demand
                item_type: 2, // 2 for Parcel (most e-commerce items)

                item_quantity: totalQuantity, // Required

                item_weight: 1, // * Required, between 0.5-10kg (default to 1kg)
                item_description: itemDescription.substring(0, 250), // Optional, limited to reasonable length

                amount_to_collect: codAmount // Required, 0 for non-COD
            });

            // console.log('Pathao order created:', response);
            if (response.data.status === 200) {
                setWaitingForPathaoRes(false)
                Swal.fire({
                    icon: 'success',
                    text: 'Successfully Send the data to the Stedfast ',
                    timer: 2500,
                    width: '300px'
                });
            } else {
                setWaitingForPathaoRes(false)
                Swal.fire({
                    icon: 'error',
                    text: `${response.data.message}`,
                    timer: 2500,
                    width: '300px'
                });
            }
            return response.data;

        } catch (error) {
            console.error('Error creating Pathao order:', error.response?.data || error.message);
            // throw error;
        }
    }


    // ! send order to steadfast 
    const SendSteadfastOrder = async (order) => {
        // setWaitingForPathaoRes(true)
        const shopDomain = order?.shopDomain;
        const userInfo = userData?.userByEmail?.id;


        const customer = order?.customer;
        const shippingAddress = order?.shippingAddress;

        // Calculate total quantity from line items
        const totalQuantity = order?.lineItems?.edges?.reduce((total, edge) => {
            return total + (edge?.node?.quantity || 0);
        }, 0);

        // Create item description from line items
        const itemDescription = order?.lineItems?.edges
            ?.map(edge => {
                const item = edge?.node;
                return `${item?.title || ''} ${item?.variantTitle ? `(${item?.variantTitle})` : ''} x ${item?.quantity || 0}`;
            })
            ?.join(", ");

        const codAmount = Math.round(parseFloat(order?.totalPriceSet?.shopMoney?.amount));
        const invoice = order?.name?.replace("#", "");
        const payload = {
            userId: userData.userByEmail.id,
            shopDomain: shopDomain,


            invoice: `${shopDomain}-${order?.name?.replace("#", "")}`,
            recipient_name: `${customer?.firstName || ''} ${customer?.lastName || ''}`,
            recipient_phone: shippingAddress?.phone?.replace(/\D/g, '')?.slice(-11) || '',
            recipient_address: `${shippingAddress?.address1 || ''}, ${shippingAddress?.city || ''}, ${shippingAddress?.province || ''}, ${shippingAddress?.zip || ''}`,
            cod_amount: codAmount,
            note: `${itemDescription || ''} | Quantity: ${totalQuantity || 0}`

        };
        // console.log(payload)
        // ? ----------- steadfast e data 

        try {

            const res = await axiosPublic.post('/steadfastOrder', payload);
            // console.log('Order placed:', res.data);
            if (res.data.status === 200) {
                setWaitingForPathaoRes(false)
                Swal.fire({
                    icon: 'success',
                    text: 'Successfully Send the data to the Stedfast ',
                    timer: 2500,
                    width: '300px'
                });

                // console.log(res.data.consignment.tracking_code)

                // Prepare courier data from the response
                const courierData = {
                    consignment_id: res.data.consignment.consignment_id,
                    invoice: res.data.consignment.invoice,
                    tracking_code: res.data.consignment.tracking_code,
                    recipient_name: res.data.consignment.recipient_name,
                    recipient_phone: res.data.consignment.recipient_phone,
                    recipient_address: res.data.consignment.recipient_address,
                    cod_amount: res.data.consignment.cod_amount,
                    status: res.data.consignment.status,
                    note: res.data.consignment.note,
                    shopifyId: order.id || null, // Assuming order object contains Shopify ID
                    orderId: order._id || null // MongoDB ID if available, null if not
                };

                // Call the Apollo mutation
    // ? -----------db te currier data 
                try {
                    const { data } = await addCourier({
                        variables: courierData
                    });

                    // console.log('Courier added to database:', data.addCourier);

                    // Optional - show success notification for database save
                    Swal.fire({
                        icon: 'success',
                        text: 'Currier information saved successfully in db',
                        timer: 2500,
                        width: '300px'
                    });

                } catch (mutationError) {
                    console.error('Error saving courier data:', mutationError);
                    Swal.fire({
                        icon: 'error',
                        text: 'Error saving delivery information to database',
                        timer: 2500,
                        width: '300px'
                    });
                }





                // ? --------------- add currier info -------------




                // ! -------------------   update fylfillments  mutation 

                const trackingInfo = {
                    number: res?.data?.consignment?.tracking_code,
                    company: "Steadfast",
                    url: `https://steadfast.com.bd/t/${res?.data?.consignment?.tracking_code}`,
                };

                const fulfillmentOrders = order.fulfillmentOrders?.edges || [];

                if (fulfillmentOrders.length === 0) {
                    console.error("No fulfillment orders found.");
                    return;
                }

                try {
                    for (const edge of fulfillmentOrders) {
                        const fulfillmentOrderId = edge.node.id;

                        // Map line items with id and quantity
                        const fulfillmentOrderLineItems = edge.node.lineItems.edges.map(item => ({
                            id: item.node.id,
                            quantity: item.node.lineItem.quantity,
                        }));

                        const response = await axiosPublic.post("/fulfill-order", {
                            shopDomain,
                            userInfo,
                            fulfillmentOrderId,
                            trackingInfo,
                            lineItems: fulfillmentOrderLineItems, // ✅ Send to backend
                        });

                        // console.log("Fulfilled:", fulfillmentOrderId, response.data);
                    }

                    Swal.fire({
                        icon: "success",
                        title: "All items fulfilled!",
                        timer: 2000,
                        width: "350px",
                    });

                } catch (error) {
                    console.error("Error fulfilling orders:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error?.response?.data?.error || "Failed to fulfill all orders",
                        timer: 3000,
                    });
                }









            } else {
                setWaitingForPathaoRes(false)
                Swal.fire({
                    icon: 'error',
                    text: `${res.data.message}`,
                    timer: 2500,
                    width: '300px'
                });
            }

        } catch (error) {
            console.log(error)
        }

    };



    // ! ------------------------ confirm  --------------------- 
    const hnadleConfirmed = async (order) => {
        const orderId = order?.id;
        const shopDomain = order?.shopDomain;
        const userInfo = userData?.userByEmail?.id;


        // console.log(order)
        try {
            const response = await axiosPublic.post("/api/shopify/add-tag", { orderId, shopDomain, userInfo });
            // console.log("Tag added successfully:", response.data);
            if (response.data.node.tags.includes("Confirmed")) {
                Swal.fire({
                    icon: 'success',
                    text: `Successfully confirmed`,
                    timer: 2500,
                    width: '350px'
                });









                // ! ----------------------- save to db 

                try {
                    // Transform line items to match the expected GraphQL input structure
                    const lineItems = order.lineItems.edges.map(edge => ({
                        node: {
                            title: edge.node.title,
                            quantity: edge.node.quantity,
                            sku: edge.node.sku || null,
                            variantTitle: edge.node.variantTitle || null,
                            originalUnitPriceSet: {
                                shopMoney: {
                                    amount: edge.node.originalUnitPriceSet?.shopMoney?.amount || "0",
                                    currencyCode: edge.node.originalUnitPriceSet?.shopMoney?.currencyCode || "BDT"
                                }
                            }
                        }
                    }));

                    // Set courierId properly - either a valid ID or null/undefined
                    const courierId = null; // Replace with your actual variable
                    const ownerId = userData?.userByEmail?.id;
                    // console.log(ownerId)
                    // Execute the GraphQL mutation
                    const result = await addOrder({
                        variables: {
                            name: order.name,
                            note: order.note || null,
                            processedAt: order.processedAt,
                            courierId: courierId, // Fixed: Pass a valid ID or null
                            shopDomain: order.shopDomain,
                            displayFinancialStatus: order.displayFinancialStatus,
                            displayFulfillmentStatus: order.displayFulfillmentStatus,
                            shopifyId: order.id, // This will be stored as shopifyId in MongoDB
                            customer: {
                                email: order.customer.email,
                                firstName: order.customer.firstName,
                                lastName: order.customer.lastName,
                                phone: order.customer.phone || null
                            },
                            shippingAddress: {
                                address1: order.shippingAddress.address1,
                                address2: order.shippingAddress.address2 || null,
                                city: order.shippingAddress.city,
                                province: order.shippingAddress.province || null,
                                country: order.shippingAddress.country,
                                zip: order.shippingAddress.zip,
                                phone: order.shippingAddress.phone || null
                            },
                            tags: order.tags || [],
                            ownerId: ownerId,
                            totalPriceSet: {
                                shopMoney: {
                                    amount: order.totalPriceSet.shopMoney.amount,
                                    currencyCode: order.totalPriceSet.shopMoney.currencyCode
                                }
                            },
                            lineItems: lineItems
                        }
                    });

                    // console.log(result.data)
                    if (result.data.addOrder.id) {
                        Swal.fire({
                            icon: 'success',
                            text: `Successfully added in the db`,
                            timer: 2500,
                            width: '350px'
                        });
                    }

                    return result.data.addOrder;
                } catch (err) {
                    console.error('Error saving order to database:', err);
                    Swal.fire({
                        icon: 'error',
                        text: `Something wrong to save the order in the db: ${err.message}`,
                        timer: 2500,
                        width: '450px'
                    });
                    throw err;
                }











            }
        } catch (error) {
            console.error("Failed to add tag:", error);
            Swal.fire({
                icon: 'error',
                text: `Failed to add tag ${error.message}`,
                timer: 2500,
                width: '300px'
            });
        }
    }


    // console.log(orders)
    // refetch();
    const handleRefetch = () => {
        refetch()
    }
    return (
        <div>
            <div className="p-4 bg-base-300 rounded-lg">
                <div>
                    <button
                        onClick={handleRefetch}
                        className="btn btn-sm btn-primary my-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Refreshing..." : "🔄 Refresh Orders"}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra table-xs w-full">
                        <thead>
                            <tr className="bg-base-200">
                                <th className="text-sm text-center">Shop Name</th>
                                <th className="text-sm text-center">Order ID</th>
                                <th className="text-sm text-center">Status</th>
                                <th className="text-sm text-center">Customer</th>
                                <th className="text-sm text-center">Address</th>
                                <th className="text-sm text-center">Order Value</th>
                                <th className="text-sm text-center">Success Rate</th>
                                <th className="text-sm text-center">Confirmation</th>
                                <th className="text-sm text-center">Send To Courier</th>
                                <th className="text-sm text-center">Download</th>
                            </tr>
                        </thead>
                        <tbody className="table-xs">
                            {orders?.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    hnadleConfirmed={hnadleConfirmed}
                                    handleSendPathao={handleSendPathao}
                                    SendSteadfastOrder={SendSteadfastOrder}
                                    courierInfo={courierMap[order.id]}
                                    courierLoading={courierLoading} // send matched courier info

                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        className="btn btn-sm"
                        disabled={true}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        className="btn btn-sm btn-primary"
                        disabled={!orders?.pageInfo?.hasNextPage}
                    >
                        Next
                    </button>
                </div>

                <div>
                    {waitingForPathaoRes && (
                        <>
                            <dialog className="modal modal-open">
                                <div className="modal-box flex  justify-center items-center gap-4">
                                    <span className="loading loading-spinner loading-xl text-6xl"></span>
                                    <p className="text-center font-semibold">Sending order to Pathao...</p>
                                </div>
                            </dialog>
                            <div className="modal-backdrop bg-black/15 opacity-50 fixed inset-0 z-40"></div>
                        </>
                    )}
                </div>

            </div>

        </div>
    );
};

export default OrderManage;

