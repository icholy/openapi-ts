export interface PostSomeThingPath {}

export interface PostSomeThingQuery {}

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

export interface PostSomeThingResponse {}

export interface PostSomeThingRequest
  extends PostSomeThingQuery,
    PostSomeThingPath {
  body: PostSomeThingBody;
}

