export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

export interface PutSomePathPath {}

export interface PutSomePathQuery {}

export interface PutSomePathBody {}

export interface PutSomePathResponse {}

export interface PutSomePathRequest extends PutSomePathQuery, PutSomePathPath {
  body: PutSomePathBody;
}

