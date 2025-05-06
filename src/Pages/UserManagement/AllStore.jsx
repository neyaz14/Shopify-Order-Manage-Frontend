import  { useContext } from 'react';
import AuthContext from '../../Providers/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_STORE_BY_USER_EMAIL } from '../../Graphql/Query/userStoreQuery';

const AllStore = () => {
    const { currentUser } = useContext(AuthContext)
    const { loading, error, data } = useQuery(GET_STORE_BY_USER_EMAIL, {
        variables: { email: currentUser?.email }
    });

    if (loading) return <p className='text-9xl font-bold text-red-500'>Loading...</p>;
    if (error) return <p className='text-9xl font-bold text-red-500'>Error: {error.message}</p>;



    return (
        <div>
            <table className="min-w-full table table-zebra table-auto border border-gray-300 rounded-md overflow-hidden mt-4">
                <thead className="">
                    <tr>
                        <th className="px-4 py-2 text-center border">Store Name</th>
                        <th className="px-4 py-2 text-center border">Store URL</th>
                        <th className="px-4 py-2 text-center border">API Version</th>
                        <th className="px-4 py-2 text-center border">User Name</th>
                        <th className="px-4 py-2 text-center border">User Email</th>
                    </tr>
                </thead>
                <tbody>
                    {data.storeByUserEmail.map((store) => (
                        <tr key={store.id} className="text-center">
                            <td className="px-4 py-2 text-center border">{store.storeName}</td>
                            <td className="px-4 py-2 text-center border">{store.storeUrl}</td>
                            <td className="px-4 py-2 text-center border">{store.apiVersion}</td>
                            <td className="px-4 py-2 text-center border">{store.user.displayName}</td>
                            <td className="px-4 py-2 text-center border">{store.user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default AllStore;