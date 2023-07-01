import { BrowserRouter } from "react-router-dom";
import { AuthenticatedDash } from "./AuthenticatedDash";

export function Entrypoint() {
	return (
		<BrowserRouter>
			<AuthenticatedDash />
		</BrowserRouter>
	);
}
