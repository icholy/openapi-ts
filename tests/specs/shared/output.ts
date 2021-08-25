export interface GetSomeThingQuery {
  b?: number;
  a: string;
}

export type GetSomeThingResponse = void;

export interface GetSomeThingRequest extends GetSomeThingQuery {}

