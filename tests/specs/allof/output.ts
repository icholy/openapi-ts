export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

export type OrderedItem = any;

// PUT some/path

export interface PutSomePathBody extends ItemsWithIssue {
  reason?: string;
}

export type PutSomePathResponse = {};
