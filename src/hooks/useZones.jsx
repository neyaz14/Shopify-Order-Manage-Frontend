import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from './useAxiosPublic'; // তুমি যদি axiosPublic wrapper বানিয়ে থাকো

const useZones = (cityID) => {
    const axiosPublic = useAxiosPublic();

    const { data: zones = [], refetch, isLoading } = useQuery({
        queryKey: ['zones', cityID], // আলাদা city id অনুযায়ী আলাদা cache
        enabled: !!cityID, // cityID না থাকলে call হবে না
        queryFn: async () => {
            const res = await axiosPublic.get(`/cities/${cityID}/zones`);
            // console.log(res)
            return res.data?.data?.data || []; // nested structure handle
        }
    });

    return [zones, refetch, isLoading];
};

export default useZones;
