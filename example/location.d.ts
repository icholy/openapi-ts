export interface POS {
  // pos
  id?: string;
  type?: string;
  meta?: any;
}

export interface MenuHours {
  // menu
  id?: string;
  label?: {
    en?: string,
  };
  hours?: Hours[];
  is_pickup?: boolean;
  is_delivery?: boolean;
  is_frictionless?: boolean;
}

export interface Hours {
  // hours
  id?: string;
  date?: {
    start?: string,
    end?: string,
  };
  day?: {
    start?: number,
    end?: number,
  };
  hours?: string;
}

export interface DeliveryHours {
  // hours
  id?: string;
  day?: {
    start?: number,
    end?: number,
  };
  hours?: string;
}

export interface Timeslot {
  // timeslot id (optional)
  id?: number;
  // brand
  brand_id?: string;
  start_time?: string;
  duration?: string;
  is_available?: boolean;
  number_orders?: number;
}

export interface Address {
  // Suite number of the address, if applicable
  suite?: string;
  // First line of the address, should include street number
  address?: string;
  // City of the address
  city?: string;
  // State of the address, also province in Canada
  state?: string;
  // Country of the address
  country?: string;
  // Zip code or postal code of the address
  zip?: string;
  coordinates?: {
    // latitude of the the address
    latitude?: number,
    // longitude of the the address
    longitude?: number,
  };
}

export interface Brand {
  // brand
  id?: string;
  // sector
  sector?: string;
  name?: string;
  label?: {
    en?: string,
    fr?: string,
  };
  timezone?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: Address;
  menus?: MenuHours[];
  date?: {
    created?: string,
  };
  hours?: Hours[];
  deliveryHours?: DeliveryHours[];
  style?: any;
  // pos
  pos?: string;
  terminals?: any[];
  timeslots?: {
    time?: string,
    averagePrepTime?: string,
    duration_minutes?: number,
    customers_per_slot?: number,
    menu_items_per_slot?: number,
    delivery_time?: string,
    delivery_customers_per_slot?: number,
    delivery_menu_items_per_slot?: number,
    delivery_prep_time?: string,
    delivery_is_user_defined?: boolean,
    delivery_user_defined?: {
      start_time: string,
      end_time: string,
      delivery_destinations?: string[],
    }[],
  };
  is?: {
    pickup_supported?: boolean,
    delivery_supported?: boolean,
    plu_enabled?: boolean,
    promo_exemptions_enabled?: boolean,
    local_images_enabled?: boolean,
    hidden?: boolean,
    item_desc_edit_enabled?: boolean,
    scan_and_go_supported?: boolean,
    calories_edit_enabled?: boolean,
    [index: string]: any,
  };
  // brand
  brand?: string;
  // location
  location?: string;
  // payment
  payment_provider?: string;
  location_description?: string;
  // company
  company?: string;
  config?: {
    private?: any,
    public?: any,
  };
  tax_rate?: number;
  meta?: {
    scout?: {
      user_id?: string,
      name?: {
        first?: string,
        last?: string,
      },
    },
    partner?: {
      user_id?: string,
      name?: {
        first?: string,
        last?: string,
      },
    },
    contact?: {
      name?: string,
      role?: string,
      email?: string,
      phone?: string,
    },
    market_id?: string,
    partner_type?: string,
    business_number?: number,
    website?: string,
    cuisine_types?: string[],
    status?: PartnerStatus,
    active?: boolean,
    max_showcase_items?: number,
  };
  descriptions?: {
    location?: {
      en?: string,
      fr?: string,
    },
  };
  [index: string]: any;
}

export interface BrandDocument {
  // CDL id
  id?: string;
  type?: string;
  url?: string;
  is_archived?: boolean;
  // UTC timestamp
  upload_date?: number;
  name?: string;
}

export type BrandDocuments = BrandDocument[];

export interface BrandDocumentsResponse {
  documents?: BrandDocuments;
}

export type Brands = Brand[];

export interface Location {
  // location
  id?: string;
  operation_id?: number;
  name?: string;
  label?: {
    en?: string,
    fr?: string,
  };
  search?: string[];
  app?: string;
  address?: Address;
  latitude?: number;
  longitude?: number;
  brands?: Brand[];
  meta?: any;
  phone?: string;
  // group
  location_group?: string;
  // multigroup
  location_multigroup?: string;
  // sector
  sector?: string;
  date?: {
    created?: string,
    modified?: string,
  };
  market_place?: {
    label?: {
      en?: string,
      fr?: string,
    },
    location_description?: {
      en?: string,
      fr?: string,
    },
    logo?: string,
    is?: {
      pickup_supported?: boolean,
    },
    pickup_instruction?: {
      en?: string,
      fr?: string,
    },
    hours?: any,
    deliveryHours?: any,
    service_fee?: {
      type?: string,
      value?: number,
    },
    [index: string]: any,
  };
  [index: string]: any;
}

export interface Group {
  // group
  id?: string;
  name?: string;
  label?: {
    en?: string,
    fr?: string,
  };
  // Distance in meters from the group
  distance?: number;
  locations?: Location[];
  address?: Address;
  meta?: any;
  style?: any;
  [index: string]: any;
}

export interface MultiGroup {
  // multigroup
  id?: string;
  name?: string;
  groups?: Group[];
  [index: string]: any;
}

export interface Error {
  error?: string;
  code?: number;
}

export interface Sector {
  // sector
  id?: string;
  name?: string;
  label?: {
    en?: string,
    fr?: string,
  };
  companies?: Company[];
}

export interface Company {
  // company
  id?: string;
  name?: string;
  label?: {
    en?: string,
    fr?: string,
  };
  // sector
  sector?: string;
  locations?: Location[];
  is?: {
    global_images_enabled?: boolean,
  };
}

export interface Locations {
  locations?: Location[];
}

export interface Multigroups {
  groups?: MultiGroup[];
  multigroups?: MultiGroup[];
}

export interface Groups {
  groups?: Group[];
}

export interface PostOrPatchDeliveryDestination {
  // Name of the delivery destination
  name: string;
  // Boolean to indicate whether the delivery destination is a foodlocker or not
  foodlocker: boolean;
  address: Address;
  // Additional information of the delivery destination
  information?: string;
}

export interface DeliveryDestination {
  // ID of the delivery destination
  id?: string;
  // Name of the delivery destination
  name: string;
  // Boolean to indicate whether the delivery destination is a foodlocker or not
  foodlocker: boolean;
  address: Address;
  // Additional information of the delivery destination
  information?: string;
}

export type DeliveryDestinations = DeliveryDestination[];

export interface DeliveryDestinationIDs {
  delivery_destinations?: string[];
}

export interface TimeSlots {
  timeslots?: Timeslot[];
}

export interface Sectors {
  sectors?: Sector[];
}

export interface CompanyUpdateBody {
  // Company name
  name?: string;
  is?: {
    // Allow Global Menu Images Toggle
    global_images_enabled?: boolean,
  };
}

export interface MarketPlace {
  stations?: Station[];
  [index: string]: any;
}

export interface Station {
  // CDL id
  brand?: string;
  // CDL id
  menu?: string;
  [index: string]: any;
}

export interface CreateSector {
  // Sector name
  name?: string;
}

export interface BadRequest {
  error?: string;
}

export type PartnerStatus = string;

export type PostLocationPath = void;

export type PostLocationQuery = void;

export type PostLocationBody = Location;

export type PostLocationResponse = Location;

export interface PostLocationRequest extends PostLocationQuery, PostLocationPath {
  body: PostLocationBody;
}

export type GetLocationPath = void;

export type GetLocationQuery = void;

export type GetLocationBody = void;

export type GetLocationResponse = Locations;

export interface GetLocationRequest extends GetLocationQuery, GetLocationPath {
  body: GetLocationBody;
}

export type GetLocationSearchPath = void;

export interface GetLocationSearchQuery {
  // The latitude to be used
  lat?: number;
  // The longitude to be used
  long?: number;
  // Operation id to be used
  operation_id?: number;
}

export type GetLocationSearchBody = void;

export type GetLocationSearchResponse = Locations;

export interface GetLocationSearchRequest extends GetLocationSearchQuery, GetLocationSearchPath {
  body: GetLocationSearchBody;
}

export interface GetLocationPath {
  // location id
  id: string;
}

export interface GetLocationQuery {
  // When fetching location, brands will come with private and public configs
  include_brands_config?: boolean;
  // active cafes
  active_cafes?: any[];
  // show additional hidden properties/entities
  extended?: boolean;
}

export type GetLocationBody = void;

export type GetLocationResponse = Location;

export interface GetLocationRequest extends GetLocationQuery, GetLocationPath {
  body: GetLocationBody;
}

export interface PutLocationPath {
  // location id
  id: string;
}

export type PutLocationQuery = void;

export type PutLocationBody = Location;

export type PutLocationResponse = Location;

export interface PutLocationRequest extends PutLocationQuery, PutLocationPath {
  body: PutLocationBody;
}

export interface DeleteLocationPath {
  // location id
  id: string;
}

export type DeleteLocationQuery = void;

export interface DeleteLocationBody {
  // List of brands to remove
  brands?: Brand[];
}

export type DeleteLocationResponse = Location;

export interface DeleteLocationRequest extends DeleteLocationQuery, DeleteLocationPath {
  body: DeleteLocationBody;
}

export interface PatchLocationPath {
  // location id
  id: string;
}

export type PatchLocationQuery = void;

export type PatchLocationBody = Location;

export type PatchLocationResponse = Location;

export interface PatchLocationRequest extends PatchLocationQuery, PatchLocationPath {
  body: PatchLocationBody;
}

export interface GetLocationPosPath {
  // POS ID
  id: string;
}

export type GetLocationPosQuery = void;

export type GetLocationPosBody = void;

export type GetLocationPosResponse = POS;

export interface GetLocationPosRequest extends GetLocationPosQuery, GetLocationPosPath {
  body: GetLocationPosBody;
}

export interface PutLocationPosPath {
  // POS ID
  id: string;
}

export type PutLocationPosQuery = void;

export type PutLocationPosBody = POS;

export type PutLocationPosResponse = POS;

export interface PutLocationPosRequest extends PutLocationPosQuery, PutLocationPosPath {
  body: PutLocationPosBody;
}

export type GetLocationMultigroupPath = void;

export type GetLocationMultigroupQuery = void;

export type GetLocationMultigroupBody = void;

export type GetLocationMultigroupResponse = Multigroups;

export interface GetLocationMultigroupRequest
  extends GetLocationMultigroupQuery,
    GetLocationMultigroupPath {
  body: GetLocationMultigroupBody;
}

export type PostLocationMultigroupPath = void;

export type PostLocationMultigroupQuery = void;

export type PostLocationMultigroupBody = MultiGroup;

export type PostLocationMultigroupResponse = MultiGroup;

export interface PostLocationMultigroupRequest
  extends PostLocationMultigroupQuery,
    PostLocationMultigroupPath {
  body: PostLocationMultigroupBody;
}

export interface GetLocationMultigroupPath {
  // multigroup id
  id: string;
}

export interface GetLocationMultigroupQuery {
  // coordinate to sort from
  latitude?: string;
  // coordinate to sort from
  longitude?: string;
  // Merge multigroups from different providers. Set false to get only from queried provider
  merge?: string;
  // return multigroup location/brands in response
  expanded?: boolean;
  // return additional attributes in response
  extended?: boolean;
  // return additional hours and deliveryHours properties in response
  hours?: boolean;
}

export type GetLocationMultigroupBody = void;

export type GetLocationMultigroupResponse = MultiGroup;

export interface GetLocationMultigroupRequest
  extends GetLocationMultigroupQuery,
    GetLocationMultigroupPath {
  body: GetLocationMultigroupBody;
}

export interface PutLocationMultigroupPath {
  // multigroup id
  id: string;
}

export type PutLocationMultigroupQuery = void;

export type PutLocationMultigroupBody = MultiGroup;

export type PutLocationMultigroupResponse = MultiGroup;

export interface PutLocationMultigroupRequest
  extends PutLocationMultigroupQuery,
    PutLocationMultigroupPath {
  body: PutLocationMultigroupBody;
}

export interface DeleteLocationMultigroupPath {
  // multigroup id
  id: string;
}

export type DeleteLocationMultigroupQuery = void;

export interface DeleteLocationMultigroupBody {
  // List of groups to remove
  groups?: Group[];
}

export type DeleteLocationMultigroupResponse = MultiGroup;

export interface DeleteLocationMultigroupRequest
  extends DeleteLocationMultigroupQuery,
    DeleteLocationMultigroupPath {
  body: DeleteLocationMultigroupBody;
}

export interface PatchLocationMultigroupPath {
  // multigroup id
  id: string;
}

export type PatchLocationMultigroupQuery = void;

export type PatchLocationMultigroupBody = MultiGroup;

export type PatchLocationMultigroupResponse = MultiGroup;

export interface PatchLocationMultigroupRequest
  extends PatchLocationMultigroupQuery,
    PatchLocationMultigroupPath {
  body: PatchLocationMultigroupBody;
}

export interface GetLocationMultigroupUserPath {
  // multigroup
  id: string;
  // user
  user_id: string;
}

export interface GetLocationMultigroupUserQuery {
  expanded?: boolean;
}

export type GetLocationMultigroupUserBody = void;

export type GetLocationMultigroupUserResponse = Groups;

export interface GetLocationMultigroupUserRequest
  extends GetLocationMultigroupUserQuery,
    GetLocationMultigroupUserPath {
  body: GetLocationMultigroupUserBody;
}

export type PostLocationGroupPath = void;

export type PostLocationGroupQuery = void;

export type PostLocationGroupBody = Group;

export type PostLocationGroupResponse = Group;

export interface PostLocationGroupRequest extends PostLocationGroupQuery, PostLocationGroupPath {
  body: PostLocationGroupBody;
}

export interface GetLocationGroupPath {
  // group id
  id: string;
}

export interface GetLocationGroupQuery {
  latitude?: number;
  longitude?: number;
  // When fetching a group, brands will come with private and public configs
  include_brands_config?: boolean;
  // show additional hidden properties/entities
  extended?: boolean;
  // return only groups with brands that have web_order_enabled switched on
  web?: boolean;
}

export type GetLocationGroupBody = void;

export type GetLocationGroupResponse = Group;

export interface GetLocationGroupRequest extends GetLocationGroupQuery, GetLocationGroupPath {
  body: GetLocationGroupBody;
}

export interface PutLocationGroupPath {
  // group id
  id: string;
}

export type PutLocationGroupQuery = void;

export type PutLocationGroupBody = Group;

export type PutLocationGroupResponse = Group;

export interface PutLocationGroupRequest extends PutLocationGroupQuery, PutLocationGroupPath {
  body: PutLocationGroupBody;
}

export interface DeleteLocationGroupPath {
  // group id
  id: string;
}

export type DeleteLocationGroupQuery = void;

export interface DeleteLocationGroupBody {
  // List of locations to remove
  locations?: Location[];
}

export type DeleteLocationGroupResponse = Group;

export interface DeleteLocationGroupRequest
  extends DeleteLocationGroupQuery,
    DeleteLocationGroupPath {
  body: DeleteLocationGroupBody;
}

export interface PatchLocationGroupPath {
  // group id
  id: string;
}

export type PatchLocationGroupQuery = void;

export type PatchLocationGroupBody = Group;

export type PatchLocationGroupResponse = Group;

export interface PatchLocationGroupRequest extends PatchLocationGroupQuery, PatchLocationGroupPath {
  body: PatchLocationGroupBody;
}

export interface GetLocationGroupDeliverydestinationPath {
  // Group ID
  id: string;
}

export type GetLocationGroupDeliverydestinationQuery = void;

export type GetLocationGroupDeliverydestinationBody = void;

export interface GetLocationGroupDeliverydestinationResponse {
  delivery_destinations?: DeliveryDestinations;
}

export interface GetLocationGroupDeliverydestinationRequest
  extends GetLocationGroupDeliverydestinationQuery,
    GetLocationGroupDeliverydestinationPath {
  body: GetLocationGroupDeliverydestinationBody;
}

export interface PostLocationGroupDeliverydestinationPath {
  // Group ID
  id: string;
}

export type PostLocationGroupDeliverydestinationQuery = void;

export type PostLocationGroupDeliverydestinationBody = PostOrPatchDeliveryDestination;

export type PostLocationGroupDeliverydestinationResponse = DeliveryDestination;

export interface PostLocationGroupDeliverydestinationRequest
  extends PostLocationGroupDeliverydestinationQuery,
    PostLocationGroupDeliverydestinationPath {
  body: PostLocationGroupDeliverydestinationBody;
}

export interface GetLocationGroupDeliverydestinationPath {
  // Group ID
  id: string;
  // Delivery Destination ID
  delivery_destination: string;
}

export type GetLocationGroupDeliverydestinationQuery = void;

export type GetLocationGroupDeliverydestinationBody = void;

export type GetLocationGroupDeliverydestinationResponse = DeliveryDestination;

export interface GetLocationGroupDeliverydestinationRequest
  extends GetLocationGroupDeliverydestinationQuery,
    GetLocationGroupDeliverydestinationPath {
  body: GetLocationGroupDeliverydestinationBody;
}

export interface PatchLocationGroupDeliverydestinationPath {
  // Group ID
  id: string;
  // Delivery Destination ID
  delivery_destination: string;
}

export type PatchLocationGroupDeliverydestinationQuery = void;

export type PatchLocationGroupDeliverydestinationBody = PostOrPatchDeliveryDestination;

export type PatchLocationGroupDeliverydestinationResponse = DeliveryDestination;

export interface PatchLocationGroupDeliverydestinationRequest
  extends PatchLocationGroupDeliverydestinationQuery,
    PatchLocationGroupDeliverydestinationPath {
  body: PatchLocationGroupDeliverydestinationBody;
}

export interface DeleteLocationGroupDeliverydestinationPath {
  // Group ID
  id: string;
  // Delivery Destination ID
  delivery_destination: string;
}

export type DeleteLocationGroupDeliverydestinationQuery = void;

export type DeleteLocationGroupDeliverydestinationBody = void;

export interface DeleteLocationGroupDeliverydestinationResponse {
  deleted_delivery_destination?: DeliveryDestination;
}

export interface DeleteLocationGroupDeliverydestinationRequest
  extends DeleteLocationGroupDeliverydestinationQuery,
    DeleteLocationGroupDeliverydestinationPath {
  body: DeleteLocationGroupDeliverydestinationBody;
}

export interface GetLocationGroupUserPath {
  // group
  id: string;
  // user
  user_id: string;
}

export interface GetLocationGroupUserQuery {
  latitude?: number;
  longitude?: number;
}

export type GetLocationGroupUserBody = void;

export type GetLocationGroupUserResponse = Group;

export interface GetLocationGroupUserRequest
  extends GetLocationGroupUserQuery,
    GetLocationGroupUserPath {
  body: GetLocationGroupUserBody;
}

export type GetLocationBrandsPath = void;

export type GetLocationBrandsQuery = void;

export type GetLocationBrandsBody = void;

export interface GetLocationBrandsResponse {
  brands?: Brands;
}

export interface GetLocationBrandsRequest extends GetLocationBrandsQuery, GetLocationBrandsPath {
  body: GetLocationBrandsBody;
}

export interface GetLocationBrandDeliverydestinationsPath {
  // Brand ID
  id: string;
}

export type GetLocationBrandDeliverydestinationsQuery = void;

export type GetLocationBrandDeliverydestinationsBody = void;

export type GetLocationBrandDeliverydestinationsResponse = DeliveryDestinationIDs;

export interface GetLocationBrandDeliverydestinationsRequest
  extends GetLocationBrandDeliverydestinationsQuery,
    GetLocationBrandDeliverydestinationsPath {
  body: GetLocationBrandDeliverydestinationsBody;
}

export interface PostLocationBrandDocumentPath {
  // Brand ID
  id: string;
}

export type PostLocationBrandDocumentQuery = void;

export interface PostLocationBrandDocumentBody {
  post_body: {
    document_name?: string,
    document_type?: string,
    // base64 string
    document?: string,
  };
}

export type PostLocationBrandDocumentResponse = BrandDocumentsResponse;

export interface PostLocationBrandDocumentRequest
  extends PostLocationBrandDocumentQuery,
    PostLocationBrandDocumentPath {
  body: PostLocationBrandDocumentBody;
}

export interface PatchLocationBrandDocumentPath {
  // Brand ID
  id: string;
}

export type PatchLocationBrandDocumentQuery = void;

export type PatchLocationBrandDocumentBody = void;

export interface PatchLocationBrandDocumentResponse {
  document?: BrandDocument;
}

export interface PatchLocationBrandDocumentRequest
  extends PatchLocationBrandDocumentQuery,
    PatchLocationBrandDocumentPath {
  body: PatchLocationBrandDocumentBody;
}

export interface DeleteLocationBrandDocumentPath {
  // Brand ID
  id: string;
}

export type DeleteLocationBrandDocumentQuery = void;

export type DeleteLocationBrandDocumentBody = void;

export interface DeleteLocationBrandDocumentResponse {
  deleted_document?: BrandDocument;
}

export interface DeleteLocationBrandDocumentRequest
  extends DeleteLocationBrandDocumentQuery,
    DeleteLocationBrandDocumentPath {
  body: DeleteLocationBrandDocumentBody;
}

export interface GetLocationBrandDocumentsPath {
  // Brand ID
  id: string;
}

export type GetLocationBrandDocumentsQuery = void;

export type GetLocationBrandDocumentsBody = void;

export type GetLocationBrandDocumentsResponse = BrandDocumentsResponse;

export interface GetLocationBrandDocumentsRequest
  extends GetLocationBrandDocumentsQuery,
    GetLocationBrandDocumentsPath {
  body: GetLocationBrandDocumentsBody;
}

export interface GetLocationBrandTimeslotsPath {
  // Brand ID
  id: string;
}

export interface GetLocationBrandTimeslotsQuery {
  // Get the pickup timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type GetLocationBrandTimeslotsBody = void;

export type GetLocationBrandTimeslotsResponse = TimeSlots;

export interface GetLocationBrandTimeslotsRequest
  extends GetLocationBrandTimeslotsQuery,
    GetLocationBrandTimeslotsPath {
  body: GetLocationBrandTimeslotsBody;
}

export type PostLocationMarketplaceTimeslotsPath = void;

export interface PostLocationMarketplaceTimeslotsQuery {
  // Get the pickup timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type PostLocationMarketplaceTimeslotsBody = MarketPlace;

export type PostLocationMarketplaceTimeslotsResponse = TimeSlots;

export interface PostLocationMarketplaceTimeslotsRequest
  extends PostLocationMarketplaceTimeslotsQuery,
    PostLocationMarketplaceTimeslotsPath {
  body: PostLocationMarketplaceTimeslotsBody;
}

export type PostLocationMarketplaceTimeslotsDeliveryPath = void;

export interface PostLocationMarketplaceTimeslotsDeliveryQuery {
  // Get the delivery timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type PostLocationMarketplaceTimeslotsDeliveryBody = MarketPlace;

export type PostLocationMarketplaceTimeslotsDeliveryResponse = TimeSlots;

export interface PostLocationMarketplaceTimeslotsDeliveryRequest
  extends PostLocationMarketplaceTimeslotsDeliveryQuery,
    PostLocationMarketplaceTimeslotsDeliveryPath {
  body: PostLocationMarketplaceTimeslotsDeliveryBody;
}

export interface GetLocationBrandTimeslotsMenuPath {
  // Brand ID
  id: string;
  // Menu ID
  menu: string;
}

export interface GetLocationBrandTimeslotsMenuQuery {
  // Get the pickup timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type GetLocationBrandTimeslotsMenuBody = void;

export type GetLocationBrandTimeslotsMenuResponse = TimeSlots;

export interface GetLocationBrandTimeslotsMenuRequest
  extends GetLocationBrandTimeslotsMenuQuery,
    GetLocationBrandTimeslotsMenuPath {
  body: GetLocationBrandTimeslotsMenuBody;
}

export interface GetLocationBrandTimeslotsDeliveryPath {
  // Brand ID
  id: string;
}

export interface GetLocationBrandTimeslotsDeliveryQuery {
  // Get the delivery timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type GetLocationBrandTimeslotsDeliveryBody = void;

export type GetLocationBrandTimeslotsDeliveryResponse = TimeSlots;

export interface GetLocationBrandTimeslotsDeliveryRequest
  extends GetLocationBrandTimeslotsDeliveryQuery,
    GetLocationBrandTimeslotsDeliveryPath {
  body: GetLocationBrandTimeslotsDeliveryBody;
}

export interface GetLocationBrandTimeslotsDeliveryMenuPath {
  // Brand ID
  id: string;
  // Menu ID
  menu: string;
}

export interface GetLocationBrandTimeslotsDeliveryMenuQuery {
  // Get the delivery timeslots after this date within the business hours of the location
  date?: number;
  // Limit the number of timeslots returned
  limit?: number;
}

export type GetLocationBrandTimeslotsDeliveryMenuBody = void;

export type GetLocationBrandTimeslotsDeliveryMenuResponse = TimeSlots;

export interface GetLocationBrandTimeslotsDeliveryMenuRequest
  extends GetLocationBrandTimeslotsDeliveryMenuQuery,
    GetLocationBrandTimeslotsDeliveryMenuPath {
  body: GetLocationBrandTimeslotsDeliveryMenuBody;
}

export type PostLocationBrandPath = void;

export type PostLocationBrandQuery = void;

export type PostLocationBrandBody = Brand;

export type PostLocationBrandResponse = Brand;

export interface PostLocationBrandRequest extends PostLocationBrandQuery, PostLocationBrandPath {
  body: PostLocationBrandBody;
}

export interface GetLocationBrandPath {
  // Brand ID
  id: string;
}

export interface GetLocationBrandQuery {
  // If true, includes brand public/private configs into response. Auth should be provided.
  include_config?: boolean;
  // show additional hidden properties/entities
  extended?: boolean;
}

export type GetLocationBrandBody = void;

export type GetLocationBrandResponse = Brand;

export interface GetLocationBrandRequest extends GetLocationBrandQuery, GetLocationBrandPath {
  body: GetLocationBrandBody;
}

export interface PatchLocationBrandPath {
  // Brand ID
  id: string;
}

export type PatchLocationBrandQuery = void;

export type PatchLocationBrandBody = Brand;

export type PatchLocationBrandResponse = Brand;

export interface PatchLocationBrandRequest extends PatchLocationBrandQuery, PatchLocationBrandPath {
  body: PatchLocationBrandBody;
}

export interface DeleteLocationBrandPath {
  // Brand ID
  id: string;
}

export type DeleteLocationBrandQuery = void;

export type DeleteLocationBrandBody = Brand;

export type DeleteLocationBrandResponse = Brand;

export interface DeleteLocationBrandRequest
  extends DeleteLocationBrandQuery,
    DeleteLocationBrandPath {
  body: DeleteLocationBrandBody;
}

export interface PutLocationBrandPath {
  // Brand ID
  id: string;
}

export type PutLocationBrandQuery = void;

export type PutLocationBrandBody = Brand;

export type PutLocationBrandResponse = Brand;

export interface PutLocationBrandRequest extends PutLocationBrandQuery, PutLocationBrandPath {
  body: PutLocationBrandBody;
}

export type GetLocationSectorPath = void;

export type GetLocationSectorQuery = void;

export type GetLocationSectorBody = void;

export type GetLocationSectorResponse = Sectors;

export interface GetLocationSectorRequest extends GetLocationSectorQuery, GetLocationSectorPath {
  body: GetLocationSectorBody;
}

export type PostLocationSectorPath = void;

export type PostLocationSectorQuery = void;

export type PostLocationSectorBody = CreateSector;

export type PostLocationSectorResponse = Sector;

export interface PostLocationSectorRequest extends PostLocationSectorQuery, PostLocationSectorPath {
  body: PostLocationSectorBody;
}

export interface GetLocationSectorPath {
  // sector
  id: string;
}

export interface GetLocationSectorQuery {
  // Omits nested children of a sector if false
  expanded?: boolean;
}

export type GetLocationSectorBody = void;

export type GetLocationSectorResponse = Sector;

export interface GetLocationSectorRequest extends GetLocationSectorQuery, GetLocationSectorPath {
  body: GetLocationSectorBody;
}

export interface PatchLocationSectorPath {
  // sector
  id: string;
}

export interface PatchLocationSectorQuery {
  // Omits nested children of a sector if false
  expanded?: boolean;
}

export type PatchLocationSectorBody = CreateSector;

export type PatchLocationSectorResponse = Sector;

export interface PatchLocationSectorRequest
  extends PatchLocationSectorQuery,
    PatchLocationSectorPath {
  body: PatchLocationSectorBody;
}

export type PostLocationCompanyPath = void;

export type PostLocationCompanyQuery = void;

export interface PostLocationCompanyBody {
  name: {
    // Sector name
    name: string,
    // sector
    sector: string,
    label?: any,
    is?: {
      global_images_enabled?: boolean,
    },
  };
}

export type PostLocationCompanyResponse = Company;

export interface PostLocationCompanyRequest
  extends PostLocationCompanyQuery,
    PostLocationCompanyPath {
  body: PostLocationCompanyBody;
}

export interface GetLocationCompanyPath {
  // Company ID
  id: string;
}

export interface GetLocationCompanyQuery {
  expanded?: boolean;
}

export type GetLocationCompanyBody = void;

export type GetLocationCompanyResponse = Company;

export interface GetLocationCompanyRequest extends GetLocationCompanyQuery, GetLocationCompanyPath {
  body: GetLocationCompanyBody;
}

export interface PatchLocationCompanyPath {
  // Company ID
  id: string;
}

export type PatchLocationCompanyQuery = void;

export type PatchLocationCompanyBody = CompanyUpdateBody;

export type PatchLocationCompanyResponse = Company;

export interface PatchLocationCompanyRequest
  extends PatchLocationCompanyQuery,
    PatchLocationCompanyPath {
  body: PatchLocationCompanyBody;
}

