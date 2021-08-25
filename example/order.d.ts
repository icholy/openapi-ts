export interface CreateOrder {
  // brand
  location_brand?: string;
  // location
  location?: string;
  // shoppingcart
  shoppingcart?: string;
  payment?: {
    token?: string,
    credit_card?: CreditCard,
  };
  mealplan?: MealPlan;
  // user
  customer?: string;
  is?: {
    accepted?: boolean,
    in_progress?: boolean,
    ready?: boolean,
  };
  meta?: {
    // which ui the order was placed on
    source?: string,
  };
  pickup?: string;
  pickup_name?: string;
  requested_date?: string;
  details?: {
    name?: string,
    contact_number?: string,
    order_type?: string,
    duration?: string,
    destination?: string,
    // Pickup or delivery instructions
    instructions?: string,
  };
}

export interface Error {
  error?: string;
  code?: number;
}

export interface Issue {
  // issue
  id?: string;
  type?: string;
  item?: {
    [index: string]: any,
  };
  // Array of Items with issues
  items?: ItemsWithIssue[];
  // Reason for dispute
  reason?: string;
  meta?: {
    [index: string]: any,
  };
}

export interface Order {
  // order
  id?: string;
  // brand
  location_brand?: string;
  // location
  location?: string;
  // shoppingcart
  shoppingcart?: string;
  payment?: {
    // payment
    token?: string,
    credit_card?: CreditCard,
    digital_wallet_pay?: string,
  };
  mealplan?: {
    // mealplan
    id?: string,
    // tender
    tender?: string,
    name?: string,
  };
  meal_swipes?: {
    // mealplan
    id?: string,
    // tender
    tender?: string,
    tender_name?: string,
    swipes?: number,
    total?: number,
  };
  meal_exchange?: MealPlan;
  // user
  customer?: string;
  is?: {
    accepted?: boolean,
    in_progress?: boolean,
    ready?: boolean,
    out_for_delivery?: boolean,
    delivered?: boolean,
  };
  date?: {
    created?: string,
    modified?: string,
    should_start?: string,
    completion_warning?: string,
    ready?: string,
    started?: string,
  };
  pickup?: string;
  pickup_name?: string;
  pickup_id?: string;
  requested_date?: string;
  details?: {
    name?: string,
    display_id?: string,
    contact_number?: string,
    order_type?: string,
    duration?: string,
    destination?: string,
    // Pickup or delivery instructions
    instructions?: string,
  };
  meta?: {
    // Check-in UUID for frictionless orders
    checkin_uuid?: string,
    refunds?: RefundTransaction[],
    // which ui the order was placed on
    source?: string,
    [index: string]: any,
  };
  issue?: Issue;
  // Delivery user
  runner?: string;
  [index: string]: any;
}

export interface Refund {
  refunds?: RefundItem[];
  reason?: string;
}

export interface RefundTransaction {
  // shoppingcart
  original_shoppingcart?: string;
  refund_date?: string;
  [index: string]: any;
}

export interface RefundItem {
  // Item ID
  id?: string;
  // unique index within cart
  _index?: string;
  // Quantity of the item
  quantity?: number;
  price?: {
    // Price of the item
    amount?: number,
  };
  // Reason for refund
  reason?: string;
  [index: string]: any;
}

export interface CreditCard {
  // The credit card type (Amex, Visa, Mastercard, etc...)
  card_type?: string;
  // The last 4 digits of the card number
  last4?: string;
}

export interface MealPlan {
  // mealplan
  id?: string;
  // tender
  tender?: string;
  name?: string;
}

export interface OrderIssue {
  // Type of issue
  type?: string;
  item?: {
    [index: string]: any,
  };
  // Array of Items with issues
  items?: ItemsWithIssue[];
  // Reason for dispute
  reason?: string;
}

export interface OrderedItem {
  // item
  id: string;
  // index
  _index: string;
  quantity?: number;
  unit?: number;
  price?: {
    amount?: number,
  };
  // Subtotal of the item including all options
  _subtotal?: {
    amount?: number,
  };
  // Promo applied to this item
  _promo?: {
    amount?: number,
  };
  // loyalty coupon applied to this item
  _loyalty?: {
    amount?: number,
  };
  meta?: any;
  options?: {
    label?: {
      en?: string,
    },
    items?: {
      // option
      id?: string,
      // index
      _index?: string,
      meta?: any,
    }[],
  }[];
  [index: string]: any;
}

export interface Orders {
  orders?: Order[];
}

export interface ItemsWithIssue extends OrderedItem {
  reason?: string;
}

export type PostOrderPath = void;

export interface PostOrderQuery {
  // The language of the user ex en, fr
  lang?: string;
}

export type PostOrderBody = CreateOrder;

export type PostOrderResponse = Order;

export interface PostOrderRequest extends PostOrderQuery, PostOrderPath {
  body: PostOrderBody;
}

export interface GetOrderPath {
  // The order ID
  id: string;
}

export type GetOrderQuery = void;

export type GetOrderBody = void;

export type GetOrderResponse = Order;

export interface GetOrderRequest extends GetOrderQuery, GetOrderPath {
  body: GetOrderBody;
}

export interface PutOrderPath {
  // The order ID
  id: string;
}

export type PutOrderQuery = void;

export type PutOrderBody = void;

export type PutOrderResponse = Order;

export interface PutOrderRequest extends PutOrderQuery, PutOrderPath {
  body: PutOrderBody;
}

export interface PatchOrderPath {
  // The order ID
  id: string;
}

export type PatchOrderQuery = void;

export type PatchOrderBody = Order;

export type PatchOrderResponse = Order;

export interface PatchOrderRequest extends PatchOrderQuery, PatchOrderPath {
  body: PatchOrderBody;
}

export interface PostOrderIssuePath {
  // The order ID
  id: string;
}

export type PostOrderIssueQuery = void;

export type PostOrderIssueBody = OrderIssue;

export type PostOrderIssueResponse = Issue;

export interface PostOrderIssueRequest extends PostOrderIssueQuery, PostOrderIssuePath {
  body: PostOrderIssueBody;
}

export interface PatchOrderRefundPath {
  // The order ID
  id: string;
}

export type PatchOrderRefundQuery = void;

export type PatchOrderRefundBody = Refund;

export type PatchOrderRefundResponse = Order;

export interface PatchOrderRefundRequest extends PatchOrderRefundQuery, PatchOrderRefundPath {
  body: PatchOrderRefundBody;
}

export interface GetOrderCustomerPath {
  // The user ID
  id: string;
}

export interface GetOrderCustomerQuery {
  // Sort the customers order by order created date, pickup date or requested date. Possible values: created, pickup. Default is created.
  sort?: string;
  // Filter orders by their pickup date. Only return orders that have a date greater than or equal to the date. Default is the current time in milliseconds.
  pickup_start?: number;
  // Filter orders by their pickup date. Only return orders that have a date less than or equal to the date. Default is 24 hours from the current time in milliseconds.
  pickup_end?: number;
  // Filter orders by their requested date. Only return orders that have a date less than or equal to the date. Default is 24 hours from the current time in milliseconds.
  end?: number;
  // Filter orders by their requested date. Only return orders that have a date greater than or equal to the date. Default is the current time in milliseconds.
  start?: number;
  // This is the key for which the query will be made. E.g if order_type equals 'delivery', the response will include the results based on delivery
  order_type?: string;
}

export type GetOrderCustomerBody = void;

export interface GetOrderCustomerResponse {
  orders?: Order[];
}

export interface GetOrderCustomerRequest extends GetOrderCustomerQuery, GetOrderCustomerPath {
  body: GetOrderCustomerBody;
}

export interface GetOrderCustomerLocationBrandPath {
  // The user ID
  id: string;
  // Brand id
  location_brand: string;
}

export type GetOrderCustomerLocationBrandQuery = void;

export type GetOrderCustomerLocationBrandBody = void;

export type GetOrderCustomerLocationBrandResponse = Orders;

export interface GetOrderCustomerLocationBrandRequest
  extends GetOrderCustomerLocationBrandQuery,
    GetOrderCustomerLocationBrandPath {
  body: GetOrderCustomerLocationBrandBody;
}

export interface GetOrderLocationBrandPath {
  // The location brand ID
  id: string;
}

export interface GetOrderLocationBrandQuery {
  // Filter orders by their pickup date. Only return orders that have a date greater than or equal to the date in milliseconds.
  pickup_start?: number;
  // Filter orders by their pickup date. Only return orders that have a date less than or equal to the date in milliseconds.
  pickup_end?: number;
  // Filter orders to just those with this ready state
  ready?: boolean;
  // Filter orders by their requested date. Only return orders that have a date less than or equal to the date. Default is 24 hours from the current time in milliseconds.
  end?: number;
  // Filter orders by their requested date. Only return orders that have a date greater than or equal to the date. Default is the current time in milliseconds.
  start?: number;
  // This is the key for which the query will be made. E.g if order_type equals 'delivery', the response will include the results based on delivery
  order_type?: string;
}

export type GetOrderLocationBrandBody = void;

export type GetOrderLocationBrandResponse = Orders;

export interface GetOrderLocationBrandRequest
  extends GetOrderLocationBrandQuery,
    GetOrderLocationBrandPath {
  body: GetOrderLocationBrandBody;
}

export interface GetOrderLocationPath {
  // The location ID
  id: string;
}

export interface GetOrderLocationQuery {
  // Filter orders by their pickup date. Only return orders that have a date greater than or equal to the date in milliseconds.
  pickup_start?: number;
  // Filter orders by their pickup date. Only return orders that have a date less than or equal to the date in milliseconds.
  pickup_end?: number;
  // Filter orders to just those with this ready state
  ready?: boolean;
  // Filter orders by their requested date. Only return orders that have a date less than or equal to the date. Default is 24 hours from the current time in milliseconds.
  end?: number;
  // Filter orders by their requested date. Only return orders that have a date greater than or equal to the date. Default is the current time in milliseconds.
  start?: number;
  // This is the key for which the query will be made. E.g if order_type equals 'delivery', the response will include the results based on delivery
  order_type?: string;
  // List of brands you want orders for inside this location. Example: 616kLp3ADNUE2RO8qqzdto8avzyRrOhXRDW5,or2ayBJePqUP4ORXeeGgTw96vKle47IgemPk
  brands?: string;
}

export type GetOrderLocationBody = void;

export type GetOrderLocationResponse = Orders;

export interface GetOrderLocationRequest extends GetOrderLocationQuery, GetOrderLocationPath {
  body: GetOrderLocationBody;
}

export interface GetOrderLocationGroupPath {
  // Get orders by their associated group
  id: string;
}

export interface GetOrderLocationGroupQuery {
  // Filter orders by their status.
  status?: string;
  // Filter orders by their requested date. Only return orders that have a date greater than or equal to the date. Default is all orders
  start?: number;
  // Filter orders by their requested date. Only return orders that have a date less than or equal to the date. Default is the current time in milliseconds.
  end?: number;
  // Filter orders by their order type
  order_type?: string;
}

export type GetOrderLocationGroupBody = void;

export interface GetOrderLocationGroupResponse {
  orders?: Order[];
}

export interface GetOrderLocationGroupRequest
  extends GetOrderLocationGroupQuery,
    GetOrderLocationGroupPath {
  body: GetOrderLocationGroupBody;
}

export interface GetOrderUserPath {
  // Get orders by their associated group
  id: string;
}

export interface GetOrderUserQuery {
  // Filter orders by their status.
  status?: string;
  // Filter orders by their requested date. Only return orders that have a date greater than or equal to the date. Default is all orders
  start?: number;
  // Filter orders by their requested date. Only return orders that have a date less than or equal to the date. Default is the current time in milliseconds.
  end?: number;
}

export type GetOrderUserBody = void;

export interface GetOrderUserResponse {
  orders?: Order[];
}

export interface GetOrderUserRequest extends GetOrderUserQuery, GetOrderUserPath {
  body: GetOrderUserBody;
}

