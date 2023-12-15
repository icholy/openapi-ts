export interface Config {
  [index: string]: any;
}

export type CreateConfig = Record<string | number, any>;

export interface BrandsTotals {
  "Brand Total"?: BrandPayments;
  is?: Record<string | number, any>;
}

export interface Tender {
  is?: BrandsTotals["is"];
}

export type BrandPayments = Record<string | number, any>;
