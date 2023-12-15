export type CustomType = Record<string | number, any>;

// POST /some/thing

export interface PostSomeThingBody {
  a?: {
    [index: string]: Record<string | number, any>,
  };
  b?: {
    [index: string]: string,
  };
  c?: {
    [index: string]: CustomType,
  };
}

export type PostSomeThingResponse = {};
