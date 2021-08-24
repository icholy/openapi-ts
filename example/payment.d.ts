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

export interface PostPaymentTransactionPath {}

export interface PostPaymentTransactionQuery {}

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

export interface PostPaymentTransactionResponse extends Transaction {}

export interface PostPaymentTransactionRequest
  extends PostPaymentTransactionQuery,
    PostPaymentTransactionPath {
  body: PostPaymentTransactionBody;
}

export interface PostPaymentTransactionRefundPath {}

export interface PostPaymentTransactionRefundQuery {}

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

export interface PostPaymentTransactionRefundResponse extends Refund {}

export interface PostPaymentTransactionRefundRequest
  extends PostPaymentTransactionRefundQuery,
    PostPaymentTransactionRefundPath {
  body: PostPaymentTransactionRefundBody;
}

export interface GetPaymentClienttokenPath {}

export interface GetPaymentClienttokenQuery {}

export interface GetPaymentClienttokenBody {}

export interface GetPaymentClienttokenResponse extends ClientToken {}

export interface GetPaymentClienttokenRequest
  extends GetPaymentClienttokenQuery,
    GetPaymentClienttokenPath {
  body: GetPaymentClienttokenBody;
}

export interface PostPaymentPaymenttokenPath {}

export interface PostPaymentPaymenttokenQuery {}

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

export interface PostPaymentPaymenttokenResponse extends PaymentMethod {}

export interface PostPaymentPaymenttokenRequest
  extends PostPaymentPaymenttokenQuery,
    PostPaymentPaymenttokenPath {
  body: PostPaymentPaymenttokenBody;
}

export interface PostPaymentConsumerPath {}

export interface PostPaymentConsumerQuery {}

export interface PostPaymentConsumerBody {
  // The user id
  user_id: string;
}

export interface PostPaymentConsumerResponse extends ConsumerId {}

export interface PostPaymentConsumerRequest
  extends PostPaymentConsumerQuery,
    PostPaymentConsumerPath {
  body: PostPaymentConsumerBody;
}

export interface PostPaymentMethodPath {}

export interface PostPaymentMethodQuery {}

export interface PostPaymentMethodBody {
  // The user id
  user_id: string;
  // The payment nonce provided for the payment method
  payment_method_nonce: string;
}

export interface PostPaymentMethodResponse {
  payment_method?: PaymentMethod;
}

export interface PostPaymentMethodRequest extends PostPaymentMethodQuery, PostPaymentMethodPath {
  body: PostPaymentMethodBody;
}

export interface GetPaymentMethodPath {}

export interface GetPaymentMethodQuery {
  // The user id
  user_id: string;
}

export interface GetPaymentMethodBody {}

export interface GetPaymentMethodResponse {
  payment_methods?: PaymentMethod[];
}

export interface GetPaymentMethodRequest extends GetPaymentMethodQuery, GetPaymentMethodPath {
  body: GetPaymentMethodBody;
}

export interface DeletePaymentMethodPath {}

export interface DeletePaymentMethodQuery {}

export interface DeletePaymentMethodBody {
  // The user from where the payment method will be deleted
  user: string;
}

export interface DeletePaymentMethodResponse extends Success {}

export interface DeletePaymentMethodRequest
  extends DeletePaymentMethodQuery,
    DeletePaymentMethodPath {
  body: DeletePaymentMethodBody;
}

export interface GetPaymentTokenPath {}

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

export interface GetPaymentTokenBody {}

export interface GetPaymentTokenResponse extends TokenInformation {}

export interface GetPaymentTokenRequest extends GetPaymentTokenQuery, GetPaymentTokenPath {
  body: GetPaymentTokenBody;
}

export interface PostPaymentTokenPath {}

export interface PostPaymentTokenQuery {}

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

export interface PostPaymentTokenResponse extends PaymentCard {}

export interface PostPaymentTokenRequest extends PostPaymentTokenQuery, PostPaymentTokenPath {
  body: PostPaymentTokenBody;
}

export interface PutPaymentTokenPath {}

export interface PutPaymentTokenQuery {}

export interface PutPaymentTokenBody {
  // Token information to be saved
  updatedTokenInfo: UpdateTokenInformation;
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export interface PutPaymentTokenResponse extends PaymentCard {}

export interface PutPaymentTokenRequest extends PutPaymentTokenQuery, PutPaymentTokenPath {
  body: PutPaymentTokenBody;
}

export interface DeletePaymentTokenPath {}

export interface DeletePaymentTokenQuery {}

export interface DeletePaymentTokenBody {
  // Token string to be deleted
  token: string;
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export interface DeletePaymentTokenResponse extends Success {}

export interface DeletePaymentTokenRequest extends DeletePaymentTokenQuery, DeletePaymentTokenPath {
  body: DeletePaymentTokenBody;
}

export interface GetPaymentMethodsPath {}

export interface GetPaymentMethodsQuery {
  // FP StoreId
  storeId: any[];
  // FP TerminalId
  terminalId: string;
}

export interface GetPaymentMethodsBody {}

export interface GetPaymentMethodsResponse {
  data?: PaymentCard[];
  recordsTotal?: number;
}

export interface GetPaymentMethodsRequest extends GetPaymentMethodsQuery, GetPaymentMethodsPath {
  body: GetPaymentMethodsBody;
}

export interface GetPaymentHpcPath {}

export interface GetPaymentHpcQuery {
  // FP StoreId
  storeId: string;
  // FP TerminalId
  terminalId: string;
}

export interface GetPaymentHpcBody {}

export interface GetPaymentHpcResponse {
  iframe?: string;
  sessionKey?: string;
}

export interface GetPaymentHpcRequest extends GetPaymentHpcQuery, GetPaymentHpcPath {
  body: GetPaymentHpcBody;
}

