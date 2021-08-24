export interface PostSomeThingPath {}

export interface PostSomeThingQuery {}

export interface PostSomeThingBody {
  a?: any;
  b?: any;
  c?: any;
}

export interface PostSomeThingResponse {}

export interface PostSomeThingRequest
  extends PostSomeThingQuery,
    PostSomeThingPath {
  body: PostSomeThingBody;
}

