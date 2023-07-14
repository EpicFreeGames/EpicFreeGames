import { PermissionString } from "./types";

import { calcPermissionBitsFromStrings } from "./calcPermissionBitsFromStrings";

export const hasPerms = (permissions: bigint, neededPerms: PermissionString[]) => {
	const neededBigint = calcPermissionBitsFromStrings(neededPerms);

	return (BigInt(permissions) & neededBigint) === neededBigint;
};
