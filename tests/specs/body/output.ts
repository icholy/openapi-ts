// GET /some/thing

export interface GetSomeThingBody {
  a?: string;
  b?: Record<string | number, any>[];
  c: boolean;
}

export type GetSomeThingResponse = {};
