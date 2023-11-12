export interface Config {
  [index: string]: any;
}

export type CreateConfig = any;

export interface BrandsTotals {
  "Brand Total"?: BrandPayments;
  is?: any;
}

export interface Tender {
  is?: BrandsTotals["is"];
}

export type BrandPayments = any;
