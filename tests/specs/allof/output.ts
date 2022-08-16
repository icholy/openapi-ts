export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

// PUT some/path

export interface PutSomePathBody extends ItemsWithIssue {
  reason?: string;
}

export type PutSomePathResponse = {};
