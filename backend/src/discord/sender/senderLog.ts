export function senderLogError(props: {
	index: number;
	serverId: string;
	type: "webhook" | "message";
	ctx: string;
	error?: any;
}) {
	console.log("SENDER ERROR", JSON.stringify(props));
}
