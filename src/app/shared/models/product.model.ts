
import { Variant } from './variant.model';
import { Image } from './image.model';

export interface Collection {
  title: string;
}

export interface Tag {
  value: string;
}
export class Product{
    id: string;
    sku: string;
    title: string;
    createdAt: Date;
    description: string='';
    descriptionHtml: string='';
    descriptionPlainSummary: string;
    handle: string;
    collection: string;
    productType: string;
    publishedAt: Date;
    tags: Tag[];
    updatedAt: Date;
    collections:Collection[];
    variants: Variant[];
    vendor: string;
    images: Image[];
    not_campaign?: boolean;
    img_shown?: string;
}
