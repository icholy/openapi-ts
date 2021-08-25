export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

// PUT some/path

export interface PutSomePathBody {
  a?: {
    reason?: string,
  } & ItemsWithIssue;
}

export type PutSomePathResponse = void;

export interface PutSomePathRequest {
  body: PutSomePathBody;
}

