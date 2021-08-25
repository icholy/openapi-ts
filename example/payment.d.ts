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

export type PostPaymentTransactionPath = void;

export type PostPaymentTransactionQuery = void;

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

export type PostPaymentTransactionRefundPath = void;

export type PostPaymentTransactionRefundQuery = void;

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

export type GetPaymentClienttokenPath = void;

export type GetPaymentClienttokenQuery = void;

export type GetPaymentClienttokenBody = void;

export type GetPaymentClienttokenResponse = ClientToken;

export type GetPaymentClienttokenRequest = void;

export type PostPaymentPaymenttokenPath = void;

export type PostPaymentPaymenttokenQuery = void;

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

export type PostPaymentConsumerPath = void;

export type PostPaymentConsumerQuery = void;

export interface PostPaymentConsumerBody {
  // The user id
  user_id: string;
}

export type PostPaymentConsumerResponse = ConsumerId;

export interface PostPaymentConsumerRequest {
  body: PostPaymentConsumerBody;
}

export type PostPaymentMethodPath = void;

export type PostPaymentMethodQuery = void;

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

export type GetPaymentMethodPath = void;

export interface GetPaymentMethodQuery {
  // The user id
  user_id: string;
}

export type GetPaymentMethodBody = void;

export interface GetPaymentMethodResponse {
  payment_methods?: PaymentMethod[];
}

export interface GetPaymentMethodRequest extends GetPaymentMethodQuery {}

export type DeletePaymentMethodPath = void;

export type DeletePaymentMethodQuery = void;

export interface DeletePaymentMethodBody {
  // The user from where the payment method will be deleted
  user: string;
}

export type DeletePaymentMethodResponse = Success;

export interface DeletePaymentMethodRequest {
  body: DeletePaymentMethodBody;
}

export type GetPaymentTokenPath = void;

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

export type GetPaymentTokenBody = void;

export type GetPaymentTokenResponse = TokenInformation;

export interface GetPaymentTokenRequest extends GetPaymentTokenQuery {}

export type PostPaymentTokenPath = void;

export type PostPaymentTokenQuery = void;

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

export type PutPaymentTokenPath = void;

export type PutPaymentTokenQuery = void;

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

export type DeletePaymentTokenPath = void;

export type DeletePaymentTokenQuery = void;

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

export type GetPaymentMethodsPath = void;

export interface GetPaymentMethodsQuery {
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export type GetPaymentMethodsBody = void;

export interface GetPaymentMethodsResponse {
  data?: PaymentCard[];
  recordsTotal?: number;
}

export interface GetPaymentMethodsRequest extends GetPaymentMethodsQuery {}

export type GetPaymentHpcPath = void;

export interface GetPaymentHpcQuery {
  // FP StoreId
  storeId: string;
  // FP TerminalId
  terminalId: string;
}

export type GetPaymentHpcBody = void;

export interface GetPaymentHpcResponse {
  iframe?: string;
  sessionKey?: string;
}

export interface GetPaymentHpcRequest extends GetPaymentHpcQuery {}

