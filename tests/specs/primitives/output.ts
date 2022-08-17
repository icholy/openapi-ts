// GET /some/thing

export interface GetSomeThingHeaders {
  a?: string;
}

export interface GetSomeThingPath {
  // some path parameter
  b?: number;
}

export interface GetSomeThingQuery {
  //@deprecated
  c: string;
}

export interface GetSomeThingBody {
  d?: boolean;
}

export type GetSomeThingResponse = {};
