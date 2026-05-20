export type ErrorType = {
  stack: {
    body: string;
  };
};

export type DetailedErrorType = {
  stack: {
    detail: string;
  };
};

export type APIErrorType = {
  stack: {
    detail: {
      msg: string;
    }[];
  };
};
