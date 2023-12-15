export interface Item {
  // item
  id?: string;
}

// PUT /shoppingcart/{id}

export interface PutShoppingcartPath {
  // Shopping cart ID
  id: string;
}

export type PutShoppingcartBody = Item;

export type PutShoppingcartResponse = Record<string, any>;
