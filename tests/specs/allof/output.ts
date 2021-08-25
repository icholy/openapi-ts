export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

export type PutSomePathPath = void;

export type PutSomePathQuery = void;

export interface PutSomePathBody {
  a?: {
    reason?: string,
  } & ItemsWithIssue;
}

export type PutSomePathResponse = void;

export interface PutSomePathRequest extends PutSomePathQuery, PutSomePathPath {
  body: PutSomePathBody;
}

