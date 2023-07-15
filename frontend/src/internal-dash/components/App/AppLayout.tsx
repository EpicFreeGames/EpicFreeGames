import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
	return (
		<div className="flex flex-col fixed w-full gap-2 h-full overflow-auto">
			<nav className="fixed z-10 w-full py-4 bg-gray-900/50 backdrop-blur-sm">
				<div className="mx-auto flex h-full max-w-[1000px] items-center justify-between gap-3 px-3">
					<div className="flex gap-2">
						<Link to="games">games</Link>
						<Link to="sends">sends</Link>
					</div>
				</div>
			</nav>

			<main className="mt-14 max-w-[1000px] mx-auto w-full px-3">
				<Outlet />
			</main>
		</div>
	);
}
