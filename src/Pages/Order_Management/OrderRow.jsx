/* eslint-disable react/prop-types */
import { useInView } from 'react-intersection-observer';
import { FaBarcode, FaCheck, FaFileInvoice,  FaShippingFast } from "react-icons/fa";
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../Invoice/InvoicePDF';
import { useQuery } from '@apollo/client';
import { COURIER_INFO_QUERY } from '../../Graphql/Query/userStoreQuery';
import { Link } from 'react-router';

const OrderRow = ({ order, hnadleConfirmed ,courierInfo,courierLoading,handleSendPathao,SendSteadfastOrder}) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // console.log(order?.id);

    const customer = order?.customer || {};
    const isPaid = order?.displayFinancialStatus?.toLowerCase() === "paid";
    const isFulfilled = order?.displayFulfillmentStatus?.toLowerCase() === "fulfilled";


    

    if (!inView) {
        return (
            <tr ref={ref}>
                <td colSpan={10}>
                    <div className="flex justify-center items-center p-4 opacity-60">
                        <span className="loading loading-spinner loading-sm"></span> Loading row...
                    </div>
                </td>
            </tr>
        );
    }

   
    // console.log(courierData);
    // const courierInfo = courierData?.courierInfoByShopifyId;

    const handleDownloadInvoice = async (order) => {
        const transformOrderToInvoiceData = (order) => {
            const customer = order?.customer || {};
            const address = order?.shippingAddress || {};
            const lineItems = order?.lineItems?.edges?.map(edge => edge?.node) || [];

            return {
                invoiceNumber: `INV-${order?.shopDomain}-${order?.name?.replace("#", "")}`,
                orderID: `${order?.shopDomain}-${order?.name?.replace("#", "")}`,
                date: new Date(order?.createdAt || Date.now()).toLocaleDateString(),

                customer: {
                    name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
                    email: customer?.email || '',
                    address: `${address?.address1 || ''}, ${address?.address2 || ''}, ${address?.city || ''}, ${address?.province || ''}, ${address?.country || ''}, ${address?.zip || ''}`,
                    phone: address?.phone || customer?.phone || '',
                },

                company: {
                    name: 'Sace Lady',
                    address: 'Mirpur DOHS, Dhaka, BD',
                    phone: '019 0755 5507',
                    email: 'support@sacelady.com.bd',
                    taxId: '001223986-0401',
                },

                items: lineItems.map(item => ({
                    name: item?.title || '',
                    options: item?.variantTitle || '',
                    quantity: item?.quantity || 0,
                    price: Math.round(parseFloat(order?.totalPriceSet?.shopMoney?.amount)) || 0,
                    total: Math.round(parseFloat(order?.totalPriceSet?.shopMoney?.amount)) * (item?.quantity || 0),
                })),

                summary: {
                    quantity: lineItems.reduce((sum, item) => sum + (item?.quantity || 0), 0),
                    subtotal: Math.round(parseFloat(order?.subtotalPriceSet?.shopMoney?.amount)) || 0,
                    shippingFee: Math.round(parseFloat(order?.totalShippingPriceSet?.shopMoney?.amount)) || 0,
                    totalAmount: Math.round(parseFloat(order?.totalPriceSet?.shopMoney?.amount)) || 0,
                },

                payment: {
                    method: order?.paymentGatewayNames?.[0] || 'N/A',
                    status: order?.displayFinancialStatus || 'Unknown',
                },
            };
        };

        const invoiceData = transformOrderToInvoiceData(order);

        const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${order?.name || order?.id?.substring(0, 4)}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const renderCourierSection = () => {
        if (isFulfilled) {
            if (courierLoading) {
                return (
                    <div className="flex justify-center items-center">
                        <span className="loading loading-spinner loading-sm"></span>
                    </div>
                );
            } else if (courierInfo) {
                return (
                    <div className="flex flex-col gap-2 text-[14px] text-left">
                        <div className="">
                            <span>Consignment ID: {courierInfo?.consignment_id || 'N/A'}</span>
                        </div>
                        <div className="">
                           
                            <Link 
                            target='_blank'
                            to={`https://steadfast.com.bd/t/${courierInfo?.tracking_code}`}>Tracking Link :   {courierInfo?.tracking_code}</Link>
                        </div>
                      
                        <div className="">Status : {courierInfo?.status || 'Unknown'}</div>
                        <div className="text-gray-400  ">Invoice: {courierInfo?.invoice || 'No invoice'}</div>
                    </div>
                );
            } else {
                return <div className="text-xs text-gray-500">No courier info available</div>;
            }
        } else {
            if (order?.tags?.includes("Confirmed")) {
                return (
                    <div className="flex flex-col gap-2">
                        <button className="btn btn-xs btn-info btn-disabled py-4" onClick={() => handleSendPathao(order)}>
                            Pathao
                        </button>
                        <button className="btn btn-xs btn-primary py-4" onClick={() => SendSteadfastOrder(order)}>
                            Steadfast
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="flex flex-col gap-2">
                        <button className="btn btn-xs btn-info btn-disabled py-4">
                            Pathao
                        </button>
                        <button className="btn btn-xs btn-primary py-4 btn-disabled">
                            Steadfast
                        </button>
                    </div>
                );
            }
        }
    };

    return (
        <tr ref={ref} className="hover:bg-base-200">
            <td className="font-semibold bg-blue-100/5 text-center text-[13px]">{order?.shopDomain}</td>
            <td className="text-center">#{order?.name || order?.id?.substring(0, 4)}</td>
            <td className="text-center">
                <div className="flex flex-col gap-2">
                    {isFulfilled && <span className="badge badge-success badge-sm w-full opacity-85 py-3">FULFILLED</span>}
                    {!isPaid && <span className="badge badge-warning badge-sm w-full opacity-85 py-3">PENDING</span>}
                    {isPaid && <span className="badge badge-success badge-sm w-full opacity-85 py-3">PAID</span>}
                    {!isFulfilled && order?.displayFulfillmentStatus === "in_progress" && (
                        <span className="badge badge-warning badge-sm w-full opacity-85 py-3">IN_PROGRESS</span>
                    )}
                    {!isFulfilled && order?.displayFulfillmentStatus?.toLowerCase() === "unfulfilled" && (
                        <span className="badge badge-warning badge-sm w-full opacity-85 py-3">UNFULFILLED</span>
                    )}
                </div>
            </td>
            <td className="text-center">
                <div className="font-medium">{`${customer?.firstName || ""} ${customer?.lastName || ""}`}</div>
                <div className="text-sm opacity-70">{customer?.email}</div>
                <div className="text-xs opacity-70">Phone: {customer?.phone}</div>
            </td>
            <td className="text-center">
                <div className="text-sm">
                    {order?.shippingAddress?.address1}
                    {order?.shippingAddress?.address2 && `, ${order?.shippingAddress?.address2}`}
                </div>
                <div className="text-xs opacity-70">
                    {order?.shippingAddress?.city},
                    {order?.shippingAddress?.province && ` ${order?.shippingAddress?.province}`}
                </div>
                <div className="text-xs opacity-70">
                    {order?.shippingAddress?.country} - {order?.shippingAddress?.zip}
                </div>
                <div className="text-xs opacity-70">
                    {order?.shippingAddress?.phone || customer?.phone}
                </div>
            </td>
            <td className="font-medium">
                {Math.round(parseFloat(order?.totalPriceSet?.shopMoney?.amount)) || "0.00"}
                {order?.totalPriceSet?.shopMoney?.currencyCode || "BDT"}
            </td>
            <td className="text-center">
                <div className="badge badge-success">100 %</div>
            </td>
            <td className="text-center">
                {order?.tags?.includes("Confirmed") ? (
                    <button className="p-3 badge badge-success gap-1">
                        <FaCheck size={12} /> Confirmed
                    </button>
                ) : (
                    <button onClick={() => hnadleConfirmed(order)} className="btn btn-xs btn-primary">
                        Confirm
                    </button>
                )}
            </td>
            <td className="text-center">
                {renderCourierSection()}
            </td>
            <td className="text-center">
                {order?.displayFulfillmentStatus === "FULFILLED" ? (
                    <div className="flex flex-col gap-2">
                        <button
                            className="btn btn-xs btn-outline gap-1"
                            onClick={() => handleDownloadInvoice(order)}
                        >
                            <FaFileInvoice /> Invoice
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            className="btn btn-xs btn-outline gap-1 btn-disabled"
                        >
                            <FaFileInvoice /> Invoice
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default OrderRow;
