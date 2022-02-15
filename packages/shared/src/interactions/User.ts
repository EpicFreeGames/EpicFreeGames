export interface User {
  permissions: {
    bits: bigint;
    hasPermission: (bits: bigint, checkFor: bigint) => boolean;
  } | null;
  id: string;
  tag: string;
  locale: string;
}
