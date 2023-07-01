import { Route, Routes } from "react-router-dom";
import { AppIndexPage } from "./components/App/AppIndexPage/AppIndexPage";
import { AppGamesPage } from "./components/App/AppGamesPage/AppGamesPage";

export function AuthenticatedDash() {
	return (
		<Routes>
			<Route path="/dash">
				<Route index element={<AppIndexPage />} />
				<Route path="games" element={<AppGamesPage />} />
			</Route>
		</Routes>
	);
}
