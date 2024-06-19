// GET /some/thing

export interface GetSomeThingBody {
  a?: string;
  b?: string[];
  c: boolean | null;
}

export type GetSomeThingResponse = {};
