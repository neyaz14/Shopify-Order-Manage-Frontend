// import Lottie from 'lottie-react';
import  { useContext } from 'react';
// import loginLottieJSON from '../../assets/lottie/login.json'
import AuthContext from '../Providers/AuthContext';
import SocialLogin from './SocialLogin';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

const SignIn = () => {
    const { singInUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    // console.log('in signIn page', location)
    const from = location.state || '/';

    const handleSignIn = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        // console.log(email, password);

        singInUser(email, password)
            .then(async result => {
                // console.log('sign in', result.user)
                navigate(from);
                await toast.success('Successfully Logged in')
            })
            .catch(error => {
                console.log(error);
            })

    }

    return (
        <div className="hero bg-base-100 h-screen">
            <Toaster position='top-right'/>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left ">

                </div>
                <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
                    <h1 className="ml-8 mt-8 text-5xl font-bold text-center">Login now</h1>
                    <form onSubmit={handleSignIn} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name='email' placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input input-bordered" required />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-black/50 text-slate-100 w-full font-bold border-none">Login</button>
                        </div>
                    </form>
                    <SocialLogin></SocialLogin>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
