import { DealTypeOption, HomeTypeOption } from "../filters/filtersTypes";

export interface ContactDetails {
    name: string;
    phoneNumber: string;
    EmailAddress: string;
}

export interface Post {
    _id?: string;
    photos: any[];
    location: string;
    dealType: DealTypeOption;
    price: number;
    bedrooms: number;
    bathrooms: number;
    homeType: HomeTypeOption;
    area: number;
    contactDetails?: ContactDetails;
    comments?: string[];
    freeText?: string;
    creator: string;
}