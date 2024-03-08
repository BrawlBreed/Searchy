import { useMutation, gql } from '@apollo/client';

export const useChangeEmailMutation = () => {
  const [mutateFunction, { data, loading, error }] = useMutation(gql`
    mutation MyMutation($uid: String!, $email: String!) {
      changeEmail(uid: $uid, email: $email)
    }
  `);

  // This function will be called from your component with the necessary variables
  const emailMutation = async (uid, email) => {
    return await mutateFunction({
      variables: {
        uid,
        email,
      },
    });
  };

  return { emailMutation, data, loading, error };
};
