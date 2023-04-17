import { useQuery } from "react-query";

const apiBaseUrl = process.env.NEXT_PUBLIC_EFG_API_BASEURL!;

if (!apiBaseUrl) throw new Error("Missing environment variable NEXT_PUBLIC_EFG_API_BASEURL");

type Props = {
	path: string;
	method: string;
	body?: any;
	query?: URLSearchParams;
};

const apiRequest = <TData = any>({ method, path, body, query }: Props) =>
	fetch(`${apiBaseUrl}${path}${!!query ? `?${query.toString()}` : ""}`, {
		method,
		credentials: "include",
		...(body && {
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" },
		}),
	}).then(async (r) => {
		const json = await r.json().catch((e) => null);

		if (r.ok) {
			return json as TData;
		} else {
			console.error(`Api request failed - ${r.status}: ${json?.message ?? r.statusText}`);

			throw new Error(json?.message ?? r.statusText);
		}
	});

type ApiError = {
	message: string;
};

export const useApiRequest = <TData = any>(props: Props) =>
	useQuery<TData, ApiError>(props.path, () => apiRequest<TData>(props));
