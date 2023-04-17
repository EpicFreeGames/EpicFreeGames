"use client";

import { useRouter } from "next/navigation";

import { useSession } from "@/i-dashboard/queries/auth/session";

export default function Page() {
	const router = useRouter();
	const { isLoading, error, data } = useSession();

	if (!isLoading && (error || !data)) {
		router.push("/i-dashboard/login");
	}

	return <div>i-dashbord</div>;
}
