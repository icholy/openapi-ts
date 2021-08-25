// GET /some/thing

export interface GetSomeThingBody {
  a?: string;
  b?: any[];
  c: boolean;
}

export type GetSomeThingResponse = void;

export interface GetSomeThingRequest {
  body: GetSomeThingBody;
}

