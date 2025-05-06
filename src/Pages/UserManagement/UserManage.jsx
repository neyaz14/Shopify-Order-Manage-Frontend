
import { useState, useContext } from 'react';

// import axios from 'axios';
import ModalStoreData from './ModalStoreData';
import { useQuery } from '@apollo/client';
import {  GET_USER_BY_EMAIL, GET_USER_BY_EMAIL_FullInfo } from '../../Graphql/Query/userStoreQuery';
import AuthContext from '../../Providers/AuthContext';
import AllStore from './AllStore';
import AddPathaoFrom from './AddPathaoFrom';
import ShowPathaoDetails from './ShowPathaoDetails';
import AddSteadfastFrom from './AddSteadfastFrom';
import ShowSteadfastDetails from './ShowSteadfastDetails';

const UserManage = () => {

  const [showModal, setShowModal] = useState(false);
  const [showModalPathao, setShowModalPathao] = useState(false);
  const [showModalSteadfast, setShowModalSteadfast] = useState(false);

  const { currentUser } = useContext(AuthContext)
  const email = currentUser?.email;
  // console.log(email)

  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    skip: !email, // only run if email is available
  });

  
  if (loading) return <p className='text-9xl font-bold text-blue-500'>Loading...</p>;
  if (error) return <p className='text-4xl font-bold text-red-500'>Error: {error.message}</p>;
  if (!data?.userByEmail) return <p className='text-4xl font-bold text-red-500'>No user found with this email.</p>;
  // console.log(data)
  const loggedInUser = data.userByEmail;
  // const loggedInUser = data.userByEmailFull;





  return (
    <div className="p-6">

      <div className='border border-blue-50/10 w-[50%] mx-auto my-10 text-center py-5 px-5'>
        <h1 className="text-3xl opacity-70 font-bold mb-4">User Profile</h1>
        <p className="my-2 opacity-65"><strong>Name : </strong> {loggedInUser?.displayName}</p>
        <p className="my-2 opacity-65"><strong>Email : </strong> {loggedInUser?.email}</p>
        <p className="my-2 opacity-65"><strong>Store Info : </strong> {loggedInUser?.storeId?.storeName}</p>
        <p className="my-2 opacity-65"><strong>Pahtao Info : </strong> {loggedInUser?.SteadfastId?.api_url}</p>
        <p className="my-2 opacity-65"><strong>Steadfast Info : </strong> {loggedInUser?.pathaoId?.clientId}</p>
      </div>

      {/* TODO  Show store  */}
      {/* {
        loggedInUser?.s
      } */}
      <div className='border border-blue-50/10 w-[80%] my-10 mx-auto text-center py-5 px-5'>




        <div>
          <h1 className='text-3xl opacity-70 font-bold my-5 '>All Stores </h1>
          <button
            className="btn btn-info "
            onClick={() => setShowModal(true)}
          >
            Add Shopify Store
          </button>
          <div>
            <AllStore></AllStore>
          </div>
        </div>


      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Shopify Store</h3>
            <ModalStoreData setShowModal={setShowModal}></ModalStoreData>
            <div className="modal-action">

              <button
                type="button"
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <section className='border border-blue-50/10 w-[85%] mx-auto px-5 py-5 flex gap-3'>

        <section className='border border-blue-50/10 w-[50%]  px-5 py-5'>
          <div className='flex justify-between'>
            <h1 className='text-4xl font-bold'>Pathao Cradentials </h1>
            <button
              className="btn btn-info "
              onClick={() => setShowModalPathao(true)}
            >
              Add Pathao Cradentials
            </button>
          </div>

          <div>
            {showModalPathao && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Add Pathao Cradentials</h3>
                  <AddPathaoFrom setShowModalPathao={setShowModalPathao}></AddPathaoFrom>
                  <div className="modal-action">

                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowModalPathao(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div >
            <ShowPathaoDetails></ShowPathaoDetails>
          </div>
        </section>


{/* ----------- steadfast */}
        <section className='border border-blue-50/10 w-[50%]  px-5 py-5'>
          <div className='flex justify-between'>
            <h1 className='text-4xl font-bold'>Steadfast Cradentials </h1>
            <button
              className="btn btn-info "
              onClick={() => setShowModalSteadfast(true)}
            >
              Add Steadfast Cradentials
            </button>
          </div>

          <div>
            {showModalSteadfast && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Add Steadfast Cradentials</h3>
                  <AddSteadfastFrom setShowModalSteadfast={setShowModalSteadfast}></AddSteadfastFrom>
                  <div className="modal-action">

                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowModalSteadfast(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <ShowSteadfastDetails></ShowSteadfastDetails>
          </div>
        </section>

      </section>


    </div>
  );
};

export default UserManage;
