export type GetSomeThingPath = void;

export type GetSomeThingQuery = void;

export interface GetSomeThingBody {
  a?: string;
  b?: any[];
  c: boolean;
}

export type GetSomeThingResponse = void;

export interface GetSomeThingRequest extends GetSomeThingQuery, GetSomeThingPath {
  body: GetSomeThingBody;
}

