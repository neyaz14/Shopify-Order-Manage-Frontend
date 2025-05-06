import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './Router/AppRoutes.jsx'
import AuthProvider from './Providers/AuthProviders.jsx'
import { ApolloProvider } from '@apollo/client'

import client from '../apoloClient.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'




const Qclient = new QueryClient()
createRoot(document.getElementById('root')).render(

    <ApolloProvider client={client}>
        <QueryClientProvider client={Qclient}>
            <StrictMode>
                <AuthProvider>
                    <AppRoutes>
                    <Toaster />
                    </AppRoutes>
                </AuthProvider>
            </StrictMode>
        </QueryClientProvider>
    </ApolloProvider>
    ,
)
