import { useApiRequest } from "../apiRequest";

export type ApiSession = {
	id: string;
	user_id: string;
};

export const useSession = () =>
	useApiRequest<ApiSession>({
		method: "GET",
		path: "/auth/session",
	});
