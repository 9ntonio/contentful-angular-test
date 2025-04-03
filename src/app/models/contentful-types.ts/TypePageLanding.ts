import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeComponentSeoSkeleton } from "./TypeComponentSeo";
import type { TypePageProductSkeleton } from "./TypePageProduct";

export interface TypePageLandingFields {
  internalName: EntryFieldTypes.Symbol;
  seoFields?: EntryFieldTypes.EntryLink<TypeComponentSeoSkeleton>;
  heroBannerHeadline: EntryFieldTypes.Symbol;
  heroBannerHeadlineColor?: EntryFieldTypes.Symbol;
  heroBannerImage: EntryFieldTypes.AssetLink;
  products?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypePageProductSkeleton>
  >;
}

export type TypePageLandingSkeleton = EntrySkeletonType<
  TypePageLandingFields,
  "pageLanding"
>;
export type TypePageLanding<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypePageLandingSkeleton, Modifiers, Locales>;
