import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: `${import.meta.env.VITE_Render_Server_BaseURL}/graphql/userStore`
        // uri: 'http://localhost:5000/graphql/userStore'
    }),
    cache: new InMemoryCache()
})

export default client
