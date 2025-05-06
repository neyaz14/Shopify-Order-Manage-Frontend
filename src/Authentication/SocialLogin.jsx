import { useContext } from 'react';
import AuthContext from '../Providers/AuthContext';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../Graphql/Mutation/userStoreMutation';

import { Toaster, toast } from 'sonner';


const SocialLogin = () => {
    const { singInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const [addUser, { data, loading, error }] = useMutation(ADD_USER);
    if (loading) return <span className='loading loading-ring loading-xl text-9xl'></span>

    const handleGoogleSignIn = async () => {
        toast.loading('Logging in....')
        singInWithGoogle()
            .then(async result => {
            
                if (result.user.email) {
                    const res = await addUser({
                        variables: {
                            displayName: result.user.displayName,
                            email: result.user.email
                        }
                    });
                    

                    if (res.data.addUser) {
                        // console.log(res.data.addUser)
                        toast.success('Login successful.New User Data saved to DB.', {duration:2000})
                        // toast('Raw toast test')
                        setTimeout(() => {
                            navigate('/');
                          }, 2000);
                    }
                    // TODO this else block does not work 
                    else{
                        toast.success('Login successful.', {duration:1500})
                        // toast('Raw toast test')
                        setTimeout(() => {
                            navigate('/');
                          }, 2350);
                    }
                }
            })
            .catch(error => {
                console.error(error.message)
                toast.error('Login failed: ' + error.message)
                setTimeout(() => {
                    navigate('/');
                  }, 1500);
            })
    }


    return (
        <div className='mt-4 mb-8 px-3 w-full'>
            <Toaster position="top-right" richColors expand={true} />
            <div className="divider">OR</div>
            <button onClick={handleGoogleSignIn} className='btn w-full  bg-gray-950/10 hover:bg-black/50 text-slate-100 font-bold border-none'>Google</button>
        </div>
    );
};

export default SocialLogin;
