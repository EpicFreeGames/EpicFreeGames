"use client";

import { useRouter } from "next/navigation";

import { useSession } from "@/i-dashboard/queries/auth/session";

export default function Page() {
	const router = useRouter();
	const { isLoading, error, data } = useSession();

	if (isLoading) {
		return null;
	}

	if (error || !data) {
		router.push("/i-dashboard/login");
		return null;
	}

	return (
		<>
			<h1 className="py-4 text-2xl">Dashboard</h1>

			<div className="flex gap-2">
				<div className="grow rounded-md bg-gray-500 p-2">test</div>
				<div className="grow rounded-md bg-gray-500 p-2">test</div>
			</div>
		</>
	);
}
