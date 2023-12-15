export interface Config {
  [index: string]: any;
}

export type CreateConfig = Record<string, any>;

export interface BrandsTotals {
  "Brand Total"?: BrandPayments;
  is?: Record<string, any>;
}

export interface Tender {
  is?: BrandsTotals["is"];
}

export type BrandPayments = Record<string, any>;
