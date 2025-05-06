import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import SocialLogin from './SocialLogin';
import AuthContext from '../Providers/AuthContext';
import { useNavigate } from 'react-router';
import { toast, Toaster } from 'sonner';
// import Swal from 'sweetalert2';
import { ADD_USER } from '../Graphql/Mutation/userStoreMutation';
import { useMutation } from '@apollo/client';

const Register = () => {
  const [addUser, { data, loading, error }] = useMutation(ADD_USER);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser } = useContext(AuthContext);

  // const location = useLocation();
  const navigate = useNavigate();
  if (loading) return <span className='loading loading-ring loading-xl'></span>

  const onSubmit = async (data) => {
    // console.log(data);
    const displayName = data.displayName
    const email = data.email
    const password = data.password
    // console.log(email, password);
// TODO When data is registering from the db , from the firebase the user displayName is not setting , we have to manyally set that by using the update userInfo using firebase 
    createUser(email, password)
      .then(async result => {
        // console.log('sign in', result)
        toast.loading('Data is sending to DB ')
        const res = await addUser({
          variables: {
            displayName: displayName,
            email: email
          }
        })
        if (res.data.addUser) {
          // console.log(res.data.addUser)
          toast.success('Registered successful.New User Data saved to DB.')
          // toast('Raw toast test')
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
        // // TODO this else block does not work 
        // else {
        //   toast.error('Data did not saved at DB, maybe same email is used for multiple users', { duration:2000 })
        //   // toast('Raw toast test')
        //   setTimeout(() => {
        //     navigate('/');
        //   }, 2350);
        // }

       
      })
      .catch(error => {
        console.log(error);
        toast.error(error)
      })
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 p-4">
      <Toaster position='top-right' expand={true} richColors></Toaster>
      <div className="card w-full max-w-md bg-base-300 shadow-xl ">
        <div className="card-body">
          <h2 className="card-title text-5xl font-bold text-center  my-5">Create Account</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text ">Coustomer Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your displayName"
                className={`input input-bordered w-full      ${errors.displayName ? 'input-error border-red-400' : ''}`}
                {...register("displayName", { required: "Username is required" })}
              />
              {errors.displayName && <span className="text-red-400 text-sm mt-1">{errors.username.message}</span>}
            </div>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full       ${errors.email ? 'input-error border-red-400' : ''}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <span className="text-red-400 text-sm mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text text-gray-100">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`input input-bordered w-full   ${errors.password ? 'input-error border-red-400' : ''}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
              />
              {errors.password && <span className="text-red-400 text-sm mt-1">{errors.password.message}</span>}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-black/50 text-slate-100 w-full font-bold border-none"
              >
                Register
              </button>
            </div>
          </form>

          <SocialLogin></SocialLogin>
          <div className="divider my-6 text-gray-400">OR</div>



          <div className="text-center text-gray-400">
            Already have an account?
            <a href="/login" className="text-blue-400 hover:text-blue-500 ml-1">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Register;