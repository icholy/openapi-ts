export interface Transaction {
  success?: boolean;
  [index: string]: any;
}

export interface Refund {
  success?: boolean;
  [index: string]: any;
}

export interface ClientToken {
  // Client token (BrainTree)
  clienttoken?: string;
  // Client token (FreedomPay)
  access_token?: string;
  // Bearer token (FreedomPay)
  token_type?: string;
  // Token expiry (FreedomPay)
  expires_in?: number;
}

export interface PaymentMethod {
  type?: string;
  card_type?: string;
  expiration?: {
    month?: number,
    year?: number,
    expired?: boolean,
  };
  last4?: string;
  // payment
  token?: string;
  date?: {
    created?: string,
    modified?: string,
    last_used?: number,
  };
  image?: string;
  cardholder_name?: string;
  postal_code?: string;
}

export interface ConsumerSessionToken {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface ConsumerId {
  consumerId?: string;
  [index: string]: any;
}

export interface TokenInformation {
  token?: string;
  accountNumberMasked?: string;
  cardExpirationMonth?: string;
  cardExpirationYear?: string;
  brand?: string;
  posCardType?: string;
  cardType?: string;
  tokenExpiration?: string;
  posData?: string;
  newToken?: string;
  [index: string]: any;
}

export interface UpdateTokenInformation {
  nickname?: string;
  isPreferred?: boolean;
  expiryYear?: string;
  expiryMonth?: string;
  nameOnCard?: string;
  token?: string;
  tokenExpirationDate?: string;
  billingAddress?: {
    street1?: string,
    street2?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string,
  };
}

export interface PaymentCard {
  maskedCardNumber?: string;
  cardType?: string;
  nickname?: string;
  isPreferred?: boolean;
  expiryYear?: number;
  expiryMonth?: number;
  nameOnCard?: string;
  token?: string;
  tokenExpirationDate?: string;
  billingAddress?: {
    postalCode?: string,
  };
}

export interface Options {
  submitForSettlement?: boolean;
  freedompay_store_id?: string;
  freedompay_terminal_id?: string;
  exact_gateway_id?: string;
  exact_gateway_password?: string;
  // brand
  brand?: string;
  // pickup_id
  pickup_id?: string;
  // user_id
  user_id?: string;
}

export interface Success {
  success?: boolean;
}

export interface Error {
  error?: string;
  code?: number;
}

// POST /payment/{id}/transaction

export interface PostPaymentTransactionBody {
  // The payment method token to use for the payment
  payment_method_token: string;
  // The amount to charge to the payment method
  amount: string;
  // The options for the transaction
  options?: Options;
  // The braintree merchant account id to use
  merchant_account_id?: string;
}

export type PostPaymentTransactionResponse = Transaction;

export interface PostPaymentTransactionRequest {
  body: PostPaymentTransactionBody;
}

// POST /payment/{id}/transaction/{transaction_id}/refund

export interface PostPaymentTransactionRefundBody {
  // The amount to refund for the transaction
  amount: string;
  // The payment method token to use for the payment (FreedomPay + Exact)
  payment_method_token?: string;
  // The transaction being refunded
  transaction?: Transaction;
  // The options for the transaction
  options?: Options;
}

export type PostPaymentTransactionRefundResponse = Refund;

export interface PostPaymentTransactionRefundRequest {
  body: PostPaymentTransactionRefundBody;
}

// GET /payment/{id}/clienttoken

export type GetPaymentClienttokenResponse = ClientToken;

export type GetPaymentClienttokenRequest = void;

// POST /payment/{id}/paymenttoken

export interface PostPaymentPaymenttokenBody {
  // The credit card number (Exact)
  cc_number: string;
  // The credit card expiry (Exact)
  cc_expiry: string;
  // The credit card CVV (Exact)
  cc_verification_str2: string;
  // The credit card holder's name (Exact)
  cardholder_name: string;
  // A reference identifier for the transaction
  reference_no?: string;
  // The options for the transaction
  options?: Options;
  // postal or zip code
  postal_code?: string;
}

export type PostPaymentPaymenttokenResponse = PaymentMethod;

export interface PostPaymentPaymenttokenRequest {
  body: PostPaymentPaymenttokenBody;
}

// POST /payment/consumer

export interface PostPaymentConsumerBody {
  // The user id
  user_id: string;
}

export type PostPaymentConsumerResponse = ConsumerId;

export interface PostPaymentConsumerRequest {
  body: PostPaymentConsumerBody;
}

// POST /payment/method

export interface PostPaymentMethodBody {
  // The user id
  user_id: string;
  // The payment nonce provided for the payment method
  payment_method_nonce: string;
}

export interface PostPaymentMethodResponse {
  payment_method?: PaymentMethod;
}

export interface PostPaymentMethodRequest {
  body: PostPaymentMethodBody;
}

// GET /payment/{id}/method

export interface GetPaymentMethodQuery {
  // The user id
  user_id: string;
}

export interface GetPaymentMethodResponse {
  payment_methods?: PaymentMethod[];
}

export interface GetPaymentMethodRequest extends GetPaymentMethodQuery {}

// DELETE /payment/{id}/method/{method_id}

export interface DeletePaymentMethodBody {
  // The user from where the payment method will be deleted
  user: string;
}

export type DeletePaymentMethodResponse = Success;

export interface DeletePaymentMethodRequest {
  body: DeletePaymentMethodBody;
}

// GET /payment/token

export interface GetPaymentTokenQuery {
  // Payment Key
  paymentKey: string;
  // Session key
  sessionKey: string;
  // FP StoreId
  storeId: string;
  // FP TerminalId
  terminalId: string;
  // name on card
  nameOnCard: string;
}

export type GetPaymentTokenResponse = TokenInformation;

export interface GetPaymentTokenRequest extends GetPaymentTokenQuery {}

// POST /payment/token

export interface PostPaymentTokenBody {
  // Token information to be saved
  tokenInfo: TokenInformation;
  // Name on credit card
  nameOnCard: string;
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export type PostPaymentTokenResponse = PaymentCard;

export interface PostPaymentTokenRequest {
  body: PostPaymentTokenBody;
}

// PUT /payment/token

export interface PutPaymentTokenBody {
  // Token information to be saved
  updatedTokenInfo: UpdateTokenInformation;
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export type PutPaymentTokenResponse = PaymentCard;

export interface PutPaymentTokenRequest {
  body: PutPaymentTokenBody;
}

// DELETE /payment/token

export interface DeletePaymentTokenBody {
  // Token string to be deleted
  token: string;
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export type DeletePaymentTokenResponse = Success;

export interface DeletePaymentTokenRequest {
  body: DeletePaymentTokenBody;
}

// GET /payment/methods

export interface GetPaymentMethodsQuery {
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export interface GetPaymentMethodsResponse {
  data?: PaymentCard[];
  recordsTotal?: number;
}

export interface GetPaymentMethodsRequest extends GetPaymentMethodsQuery {}

// GET /payment/hpc

export interface GetPaymentHpcQuery {
  // FP StoreId
  storeId: string;
  // FP TerminalId
  terminalId: string;
}

export interface GetPaymentHpcResponse {
  iframe?: string;
  sessionKey?: string;
}

export interface GetPaymentHpcRequest extends GetPaymentHpcQuery {}

