export interface GetSomeThingPath {}

export interface GetSomeThingQuery {
  b?: number;
  a: string;
}

export interface GetSomeThingBody {}

export interface GetSomeThingResponse {}

export interface GetSomeThingRequest extends GetSomeThingQuery, GetSomeThingPath {
  body: GetSomeThingBody;
}

