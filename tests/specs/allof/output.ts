export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

export type OrderedItem = Record<string | number, any>;

// PUT some/path

export interface PutSomePathBody extends ItemsWithIssue {
  reason?: string;
}

export type PutSomePathResponse = {};
