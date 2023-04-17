import { IDashboardNav } from "./nav";

export function IDashboardHeader({ children }: { children: React.ReactNode }) {
	return (
		<header className="flex items-center justify-between">
			{children}

			<IDashboardNav />
		</header>
	);
}
