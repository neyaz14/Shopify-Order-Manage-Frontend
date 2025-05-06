import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import AuthContext from "../Providers/AuthContext";

const useStoreOrders = (storeIds = [], cursor = null) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const {currentUser}= useContext(AuthContext)

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-store-orders", storeIds, cursor, currentUser?.email], 
    queryFn: async () => {
      if (!storeIds.length) return [];

      const allOrders = [];

      for (const storeId of storeIds) {
        try {
          const res = await axiosSecure.get(`/storeOrders/${storeId}`,{
            params: { 
              cursor,
              email: currentUser.email // Send user email for server-side validation
            },
          } );
          // console.log(res.data.orders) 
          const rawDomain = res?.data?.orders?.shop?.myshopifyDomain;
          const shopDomain = rawDomain?.split('.')[0];
          const edges = res?.data?.orders?.orders?.edges || [];

          const ordersForStore = edges.map((edge) => ({
            ...edge.node,
            shopDomain,
          }));


          allOrders.push(...ordersForStore);

        } catch (err) {
          console.error(`Error fetching orders for store ${storeId}:`, err);
        }
      }
      // console.log(allOrders)
      return allOrders;
    },
    enabled: storeIds.length > 0,
  });
  return { orders, refetch, isLoading, isError, error };
};

export default useStoreOrders;
