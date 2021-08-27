// POST /some/thing

export interface PostSomeThingBody {
  a?: {
    [index: string]: any,
  };
  b?: {
    [index: string]: string,
  };
  c?: {
    [index: string]: CustomType,
  };
}

export type PostSomeThingResponse = {};
