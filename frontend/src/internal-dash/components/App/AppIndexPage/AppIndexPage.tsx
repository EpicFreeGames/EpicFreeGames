import { Link } from "react-router-dom";
import { trpc } from "../../../trpc";

export function AppIndexPage() {
	const sendMutation = trpc.test.send.useMutation();

	return (
		<div>
			<button
				onClick={() => {
					sendMutation.mutateAsync();
				}}
			>
				{sendMutation.isLoading ? "loading..." : "send"}
			</button>
		</div>
	);
}
