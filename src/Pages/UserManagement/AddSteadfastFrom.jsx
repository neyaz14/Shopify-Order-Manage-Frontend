import { useMutation, useQuery } from '@apollo/client';
import { useContext } from 'react';
import AuthContext from '../../Providers/AuthContext';
import { useForm } from 'react-hook-form';
import { ADD_STEADFAST_CREDENTIAL } from '../../Graphql/Mutation/userStoreMutation';
import { GET_STEADFAST_CREDENTIALS, GET_STEADFAST_CREDENTIALS_BY_EMAIL, GET_USER_BY_EMAIL } from '../../Graphql/Query/userStoreQuery';
import { toast, Toaster } from 'sonner';
import Swal from 'sweetalert2';

const AddSteadfastFrom = () => {



    const { register, handleSubmit } = useForm();
    const { currentUser } = useContext(AuthContext)
    const { data: Cuser, loading: loadingUser, error: errorUser } = useQuery(GET_USER_BY_EMAIL, {
        variables: { email: currentUser.email }
    })



    const [addSteadfastCredential, { loading }] = useMutation(ADD_STEADFAST_CREDENTIAL, {
        update(cache, { data: { addSteadfastCredential } }) {
            // Read existing credentials from cache using the correct query and variables
            const existingData = cache.readQuery({
                query: GET_STEADFAST_CREDENTIALS_BY_EMAIL,
                variables: { email: currentUser.email }
            });
            
            // If the query result exists in the cache
            if (existingData && existingData.steadfastCredentialsByEmail) {
                // Write updated credentials back to cache
                cache.writeQuery({
                    query: GET_STEADFAST_CREDENTIALS_BY_EMAIL,
                    variables: { email: currentUser.email },
                    data: { 
                        steadfastCredentialsByEmail: [...existingData.steadfastCredentialsByEmail, addSteadfastCredential] 
                    }
                });
            }
        },
        onCompleted: () => {
            // reset();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Steadfast credential added successfully!',
            });
        },
        onError: (error) => {
            console.error('Error adding store:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while adding the store!',
            });
        }
    });

    if (loadingUser) return <span className="text-9xl font-bold text-green-400">Loading to get user....</span>


    // console.log(logedInUser)

    if (loading) return <span className="text-9xl text-green-500 font-bold">Loading....</span>
    const onSubmit = async (data) => {
        // console.log(data)

        try {
            const res = await addSteadfastCredential({
                variables: {
                    api_url: data.base_url,
                    api_key: data.api_Key,
                    secret_key: data.secret_Key,
                    user: Cuser.userByEmail.id,
                }
            })
            // console.log(res)


            if (res.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Steadfast Cradentials Added Successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
                toast.success('successfull')
                setTimeout(() => {
                    // setShowModalPathao(false)
                }, 2500)

            }
        } catch (err) {
            console.log(err)
        }

    };












    return (
        <div>
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <input {...register('base_url')} placeholder="Base URL" className="input input-bordered w-full" />
                <input {...register('api_Key')} placeholder="Api-Key" className="input input-bordered w-full" />
                <input {...register('secret_Key')} placeholder="Secret-Key" className="input input-bordered w-full" />

                <button type="submit" className="btn w-full  bg-gray-950/10 hover:bg-black/50 text-slate-100 font-bold border-none">Save Steadfast Config</button>
            </form>
        </div>
    );
};

export default AddSteadfastFrom;