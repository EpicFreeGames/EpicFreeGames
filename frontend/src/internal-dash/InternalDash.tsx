import { BrowserRouter } from "react-router-dom";
import { Entrypoint } from "./Entrypoint";
import { AuthProvider } from "./auth";
import { ApiProvider } from "./trpc";

export function InternalDash() {
	return (
		<AuthProvider>
			<ApiProvider>
				<BrowserRouter>
					<Entrypoint />
				</BrowserRouter>
			</ApiProvider>
		</AuthProvider>
	);
}
