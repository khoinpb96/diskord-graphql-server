export type RegisterMutationArgs = {
  user: {
    email: string;
    password: string;
  };
};

export type UserQueryArgs = {
  userId: string;
  token: string;
};

export type ResolverContext = string | { id: string };
