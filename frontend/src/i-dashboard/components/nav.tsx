"use client";

import { useRouter } from "next/navigation";

import Dropdown from "@/ui/Dropdown";
import { MenuIcon } from "@/ui/Icons/Menu";

export function IDashboardNav() {
	const router = useRouter();

	return (
		<Dropdown>
			<Dropdown.Button>
				<MenuIcon />
			</Dropdown.Button>

			<Dropdown.Menu>
				<Dropdown.MenuItem onSelect={() => router.push("/i-dashboard")}>
					Dashboard
				</Dropdown.MenuItem>
				<Dropdown.MenuItem onSelect={() => router.push("/i-dashboard/games")}>
					Games
				</Dropdown.MenuItem>
				<Dropdown.MenuItem onSelect={() => router.push("/i-dashboard/sends")}>
					Sends
				</Dropdown.MenuItem>
			</Dropdown.Menu>
		</Dropdown>
	);
}
