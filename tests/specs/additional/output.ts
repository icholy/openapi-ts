export type PostSomeThingPath = void;

export type PostSomeThingQuery = void;

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

export type PostSomeThingResponse = void;

export interface PostSomeThingRequest {
  body: PostSomeThingBody;
}

