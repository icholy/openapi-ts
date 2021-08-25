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

export type GetSomeThingResponse = void;

export interface GetSomeThingRequest extends GetSomeThingQuery, GetSomeThingPath {
  body: GetSomeThingBody;
}

