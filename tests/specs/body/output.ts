// GET /some/thing

export interface GetSomeThingBody {
  a?: string;
  b?: Record<string, any>[];
  c: boolean;
}

export type GetSomeThingResponse = {};
