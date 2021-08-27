// GET /some/thing

export interface GetSomeThingPath {
  b?: number;
}

export interface GetSomeThingQuery {
  a: string;
}

export interface GetSomeThingBody {
  c?: boolean;
}

export type GetSomeThingResponse = {};
