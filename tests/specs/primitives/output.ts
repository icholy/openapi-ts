// GET /some/thing

export interface GetSomeThingHeaders {
  a?: string;
}

export interface GetSomeThingPath {
  b?: number;
}

export interface GetSomeThingQuery {
  c: string;
}

export interface GetSomeThingBody {
  d?: boolean;
}

export type GetSomeThingResponse = {};
