import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeComponentSeoSkeleton } from "./TypeComponentSeo";

export interface TypePageProductFields {
    internalName: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    seoFields?: EntryFieldTypes.EntryLink<TypeComponentSeoSkeleton>;
    name: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    price: EntryFieldTypes.Number;
    featuredProductImage: EntryFieldTypes.AssetLink;
    productImages?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    relatedProducts?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypePageProductSkeleton>>;
}

export type TypePageProductSkeleton = EntrySkeletonType<TypePageProductFields, "pageProduct">;
export type TypePageProduct<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageProductSkeleton, Modifiers, Locales>;
