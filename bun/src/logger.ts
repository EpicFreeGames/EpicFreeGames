import { env } from "./env";

const levelMap = {
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
} as const;

export const Logger = {
	debug: (message: string, context?: any) =>
		log({
			level: "debug",
			message,
			context,
		}),

	warn: (message: string, context?: any) =>
		log({
			level: "warn",
			message,
			context,
		}),

	info: (message: string, context?: any) =>
		log({
			level: "info",
			message,
			context,
		}),

	error: (message: string, context?: any) =>
		log({
			level: "error",
			message,
			context,
		}),
};

type Props = {
	level: keyof typeof levelMap;
	message: string;
	context: any;
};

function log(props: Props) {
	const shouldLogToConsole = levelMap[env?.LOG || "debug"] >= levelMap[props.level];

	const datetime = new Date().toISOString();

	shouldLogToConsole &&
		console[props.level](
			JSON.stringify({ datetime, ...props }, null, env?.PRETTY_LOG ? 2 : undefined)
		);
}
