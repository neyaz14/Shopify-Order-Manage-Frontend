import { useMutation, useQuery } from '@apollo/client';

import { useForm } from 'react-hook-form';
import { ADD_STORE } from '../../Graphql/Mutation/userStoreMutation';
import { GET_STORE_BY_USER_EMAIL, GET_USER_BY_EMAIL } from '../../Graphql/Query/userStoreQuery';
import { useContext } from 'react';
import AuthContext from '../../Providers/AuthContext';
import Swal from 'sweetalert2';
// import { fetchShopifyOrders } from '../../hooks/alllOrders';
// import axios from 'axios';
// TODo_DONE : fixed the alert but removed the update cache 
const ModalStoreData = ({ setShowModal }) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { currentUser } = useContext(AuthContext)
  const { data: Cuser, loading: loadingUser, error: errorUser } = useQuery(GET_USER_BY_EMAIL, {
    variables:{email: currentUser.email}
  })


  const [addStore, { loading, error }] = useMutation(ADD_STORE, {
    update(cache, { data: { addStore } }) {
      // Read existing stores from cache for the current user
      const existingData = cache.readQuery({
        query: GET_STORE_BY_USER_EMAIL,
        variables: { email: currentUser?.email }
      });
  
      // If the query result exists in the cache
      if (existingData && existingData.storesByUserEmail) {
        // Write updated stores back to cache
        cache.writeQuery({
          query: GET_STORE_BY_USER_EMAIL,
          variables: { email: currentUser?.email },
          data: {
            storesByUserEmail: [...existingData.storesByUserEmail, addStore]
          }
        });
      }
    },
    onCompleted: (data) => {
      // console.log(data)
      reset();
      setShowModal(false);
  
      if (data?.addStore?.id) {
        Swal.fire({
          icon: 'success',
          title: 'Store Added Successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      }
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

  if (loading) return <span className='text-9xl p-8 text-blue-400 loading-infinity loading-xl'>Submitting store data...</span>;
  if (loadingUser) return <span className='text-9xl p-8 text-blue-400 loading-infinity loading-xl'>Submitting store data...</span>;

  // ! -----------------

  // console.log(allUsers.users)
  // const [logedInUser] = allUsers.users.filter(u => u.email === user.email)
  // console.log(logedInUser.id)

  const onSubmit = async (data) => {
    try {
      const response = await addStore({
        variables: {
          storeName: data.storeName,
          storeUrl: data.storeUrl,
          accessToken: data.accessToken,
          apiVersion: data.apiVersion,

          user: Cuser.userByEmail.id
        }
      });

      // console.log(response);
      setShowModal(false);
      reset();

      // Check if data is returned
      if (response?.data?.addStore?._id) {
        Swal.fire({
          icon: 'success',
          title: 'Store Added Successfully!',
          showConfirmButton: false,
          timer: 1500
        });

      }
    } catch (err) {
      console.error('Error adding store:', err);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'inside error block ',
      });
    }
  };
  // const allORders = fetchShopifyOrders();
  // console.log(allORders)

  // ! -------------------------------




  // ! -------------------------------------



  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Store name */}
        <div>
          <label className="label">
            <span className="label-text text-base-content">Shopify Name</span>
          </label>
          <input
            type="text"
            placeholder="yourstore name"
            {...register("storeName", { required: "Store name is required" })}
            className="input input-bordered w-full"
          />
          {errors.storeName && (
            <p className="text-error text-sm">{errors.storeName.message}</p>
          )}
        </div>

        {/* Store URL */}
        <div>
          <label className="label">
            <span className="label-text text-base-content">Shopify Store URL</span>
          </label>
          <input
            type="text"
            placeholder="https://yourstore.myshopify.com"
            {...register("storeUrl", { required: "Store URL is required" })}
            className="input input-bordered w-full"
          />
          {errors.storeUrl && (
            <p className="text-error text-sm">{errors.storeUrl.message}</p>
          )}
        </div>



        {/* Admin API Access Token */}
        <div>
          <label className="label">
            <span className="label-text text-base-content">Admin API Access Token</span>
          </label>
          <input
            type="password"
            placeholder="shpat_***"
            {...register("accessToken", { required: "Access token is required" })}
            className="input input-bordered w-full"
          />
          {errors.accessToken && (
            <p className="text-error text-sm">{errors.accessToken.message}</p>
          )}
        </div>

        {/* API Version */}
        <div>
          <label className="label">
            <span className="label-text text-base-content">API Version (optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 2024-01"
            {...register("apiVersion")}
            className="input input-bordered w-full"
          />
        </div>



        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button type="submit" className="btn btn-primary w-full">
            Submit Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalStoreData;