
import { useMutation, useQuery } from '@apollo/client';
import {   GET_STEADFAST_CREDENTIALS_BY_EMAIL } from '../../Graphql/Query/userStoreQuery';
import { useContext, useState } from 'react';
import AuthContext from '../../Providers/AuthContext';
import { DELETE_STEADFAST_CREDENTIAL } from '../../Graphql/Mutation/userStoreMutation';

const ShowSteadfastDetails = () => {
    const { currentUser } = useContext(AuthContext);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    // Query to fetch credentials
    const { data, loading, refetch } = useQuery(GET_STEADFAST_CREDENTIALS_BY_EMAIL, {
        variables: { email: currentUser.email },
    });

    // Delete mutation
    const [deleteSteadfastCredential] = useMutation(DELETE_STEADFAST_CREDENTIAL, {
        onCompleted: () => {
            setIsDeleting(false);
            refetch(); // Refresh the list after deletion
        },
        onError: (error) => {
            console.error("Error deleting Steadfast credential:", error);
            setIsDeleting(false);
        }
    });

    // Handle delete button click
    const handleDelete = (id) => {
        setIsDeleting(true);
        setDeletedId(id);
        deleteSteadfastCredential({
            variables: { id }
        });
    };

    if (loading) return <p className='text-2xl text-blue-400 font-bold'>Loading Steadfast credentials...</p>;

    return (
        <div className="mb-8">
            <h1 className='text-red-500 mb-4'>Do not add more than one steadfast info</h1>
            
            {data.steadfastCredentialsByEmail.length === 0 ? (
                <p className="text-gray-600">No Steadfast credentials found.</p>
            ) : (
                <ul>
                    {data.steadfastCredentialsByEmail.map(cred => (
                        <li key={cred.id} className="border border-gray-400/20 rounded-lg space-y-3 p-5 my-5 relative">
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <div><strong>Base URL:</strong> {cred?.api_url}</div>
                                    <div><strong>Client ID:</strong> {cred?.api_key}</div>
                                    <div><strong>User:</strong> {cred?.secret_key}</div>
                                </div>
                                
                                <button
                                    onClick={() => handleDelete(cred.id)}
                                    disabled={isDeleting && deletedId === cred.id}
                                    className={`px-3 py-1 rounded text-white ${
                                        isDeleting && deletedId === cred.id 
                                            ? 'bg-gray-400' 
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                >
                                    {isDeleting && deletedId === cred.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShowSteadfastDetails;