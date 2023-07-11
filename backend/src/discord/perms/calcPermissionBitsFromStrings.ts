import { BitwisePermissionFlags, PermissionString } from "./types";

export const calcPermissionBitsFromStrings = (permissions: PermissionString[]) =>
	permissions.reduce((bits, perm) => {
		bits |= BigInt(BitwisePermissionFlags[perm]);
		return bits;
	}, BigInt(0));
