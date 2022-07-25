export type AuthMutationArgs = {
  user: {
    username: string;
    password: string;
  };
};

export type UserMutationArgs = {
  user: {
    phoneNumber: string;
    email: string;
  };
};

export type ResolverContext = { id: string; message: string };
