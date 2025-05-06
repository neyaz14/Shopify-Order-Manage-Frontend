import { useForm } from "react-hook-form";
import { ADD_PATHAO_CREDENTIAL } from "../../Graphql/Mutation/userStoreMutation";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import {  GET_PATHAO_CREDENTIALS_BY_EMAIL, GET_USER_BY_EMAIL } from "../../Graphql/Query/userStoreQuery";
import { useContext } from "react";
import AuthContext from "../../Providers/AuthContext";
import { toast, Toaster } from "sonner";


const AddPathaoFrom = ({ setShowModalPathao }) => {
    const { register, handleSubmit } = useForm();
    const { currentUser } = useContext(AuthContext)
    const { data: Cuser, loading: loadingUser, error: errorUser } = useQuery(GET_USER_BY_EMAIL, {
        variables: { email: currentUser.email }
    })
    // console.log(Cuser)



    const [addPathaoCredential, { loading }] = useMutation(ADD_PATHAO_CREDENTIAL, {
        update(cache, { data: { addPathaoCredential } }) {
            // Read existing credentials from cache using the correct query and variables
            const existingData = cache.readQuery({
                query: GET_PATHAO_CREDENTIALS_BY_EMAIL,
                variables: { email: currentUser?.email }
            });
            
            // If the query result exists in the cache
            if (existingData && existingData.pathaoCredentialsByEmail) {
                // Write updated credentials back to cache
                cache.writeQuery({
                    query: GET_PATHAO_CREDENTIALS_BY_EMAIL,
                    variables: { email: currentUser?.email },
                    data: { 
                        pathaoCredentialsByEmail: [...existingData.pathaoCredentialsByEmail, addPathaoCredential] 
                    }
                });
            }
        },
        onCompleted: () => {
            // reset();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Pathao credential added successfully!',
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
            const res = await addPathaoCredential({
                variables: {
                    base_url: data.base_url,
                    client_id: data.client_id,
                    client_secret: data.client_secret,
                    user: Cuser.userByEmail.id,
                }
            })
            // console.log(res)


            if (res.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pathao Cradentials Added Successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
                toast.success('successfull')
                setTimeout(() => {
                    setShowModalPathao(false)
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
                <input {...register('client_id')} placeholder="Client ID" className="input input-bordered w-full" />
                <input {...register('client_secret')} placeholder="Client Secret" className="input input-bordered w-full" />

                <button type="submit" className="btn btn-primary w-full">Save Pathao Config</button>
            </form>
        </div>
    );
};

export default AddPathaoFrom;