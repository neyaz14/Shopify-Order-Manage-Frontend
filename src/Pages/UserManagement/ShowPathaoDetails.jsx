import { useQuery, useMutation } from '@apollo/client';
import {  GET_PATHAO_CREDENTIALS_BY_EMAIL } from '../../Graphql/Query/userStoreQuery';
import AuthContext from '../../Providers/AuthContext';
import { useContext } from 'react';
// import { DELETE_PATHAO_CREDENTIAL } from '../../Graphql/Mutation/userStoreMutation';


const ShowPathaoDetails = () => {

    const { currentUser } = useContext(AuthContext)
    const { loading, error, data } = useQuery(GET_PATHAO_CREDENTIALS_BY_EMAIL, {
        variables: { email: currentUser?.email },
      });
   

    //   const [deleteCredential] = useMutation(DELETE_PATHAO_CREDENTIAL, {
    //     refetchQueries: [{ query: GET_PATHAO_CREDENTIALS }]
    //   });

    if (loading) return <p className='text-6xl text-blue-400 font-bold'>Loading...</p>;
    // console.log(data)

    return (
        <div>
            {/* <h1 className='text-4xl'>Pathao Cradentials </h1> */}
            <ul>
                {data.pathaoCredentialsByEmail.map(cred => (
                    <li key={cred.id} className="border border-gray-400/20 space-y-3 p-5 my-5">
                        {/* <h1></h1> */}
                        <div><strong>Base URL:</strong> {cred.base_url}</div>
                        <div><strong>Client id:</strong> {cred.client_id}</div>
                        <div><strong>User:</strong> {cred.user.displayName}</div>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowPathaoDetails;

// export default ShowPathaoDetails;