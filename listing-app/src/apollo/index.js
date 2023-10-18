import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://bugiri.stepzen.net/api/firebase-demo/__graphql',
    headers: {'Authorization':'apikey bugiri::stepzen.io+1000::dd58f3eb18edf9bf657bb607eb932c58d35867f134548245793d810c09367f64'},
    cache: new InMemoryCache(),
  });
  
