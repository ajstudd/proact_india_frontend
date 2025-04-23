export type AddressType = 'home' | 'work';
export type ShippingType = 'standard' | 'express';

export interface IAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  country_code: string;
  zipCode: string;
  dial_code: string;
  dial_country_code: string;
  email: string;
  mobile: string;
  name: string;
  user: string;
  addressType: AddressType;
  isBillingAddress: boolean;
  isShippingAddress: boolean;
  shippingTypeLabel: ShippingType;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface GetAddressResponse {
  success: boolean;
  data: IAddress[];
}

export type AddressResponsePayload = Omit<
  IAddress,
  '_id' | '__v' | 'createdAt' | 'updatedAt' | 'user'
>;
export type UpdateResponsePayload = Omit<
  IAddress,
  '__v' | 'createdAt' | 'updatedAt' | 'user'
>;
