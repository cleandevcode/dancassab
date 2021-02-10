import { Image } from './image.model';
import { Product } from './product.model';

export class Variant{
    id: string;
    available: boolean;
    title: string;
    weight: number;
    image: Image;
    price: string;
    compareAtPrice: string;
    sku: string;
    product: Product;
    option:any;
}
