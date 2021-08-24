export interface GetSomeThingPath {
  b?: number;
}

export interface GetSomeThingQuery {
  a: string;
}

export interface GetSomeThingBody {
  c?: boolean;
}

export interface GetSomeThingResponse {}

export interface GetSomeThingRequest extends GetSomeThingQuery, GetSomeThingPath {
  body: GetSomeThingBody;
}

