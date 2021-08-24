export interface GetSomeThingPath {}

export interface GetSomeThingQuery {}

export interface GetSomeThingBody {
  a?: string;
  b?: any[];
  c: boolean;
}

export interface GetSomeThingResponse {}

export interface GetSomeThingRequest
  extends GetSomeThingQuery,
    GetSomeThingPath {
  body: GetSomeThingBody;
}

