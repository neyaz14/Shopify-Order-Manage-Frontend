import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../Providers/AuthContext';


const axiosInstance = axios.create(
    {
        baseURL: import.meta.env.VITE_Render_Server_BaseURL,

        withCredentials: true,
    }
)
let interceptorAttached = false;

const useAxiosSecure = () => {
    const { signOutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!interceptorAttached) {
            interceptorAttached = true;

            axiosInstance.interceptors.response.use(
                response => response,
                error => {
                    const status = error.response?.status;

                    if (status === 401 || status === 403) {
                        signOutUser()
                            .then(() => navigate('/signIn'))
                            .catch(err => console.error(err));
                    }

                    return Promise.reject(error);
                }
            );
        }
    }, [signOutUser, navigate]);

    return axiosInstance;
};

export default useAxiosSecure;
