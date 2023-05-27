import { env } from "./configuration/env";

const levelMap = {
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
} as const;

function _logger(defaultContext?: any) {
	return {
		debug: (message: string, context?: any) =>
			log({
				level: "debug",
				message,
				context: defaultContext ? { ...defaultContext, ...context } : context,
			}),

		warn: (message: string, context?: any) =>
			log({
				level: "warn",
				message,
				context: defaultContext ? { ...defaultContext, ...context } : context,
			}),

		info: (message: string, context?: any) =>
			log({
				level: "info",
				message,
				context: defaultContext ? { ...defaultContext, ...context } : context,
			}),

		error: (message: string, context?: any) =>
			log({
				level: "error",
				message,
				context: defaultContext ? { ...defaultContext, ...context } : context,
			}),
	};
}

export const Logger = _logger();

type Props = {
	level: keyof typeof levelMap;
	message: string;
	context: any;
};

function log(props: Props) {
	const shouldLogToConsole = levelMap[env?.LOG || "debug"] <= levelMap[props.level];

	const datetime = new Date().toISOString();

	shouldLogToConsole &&
		console[props.level](
			JSON.stringify({ datetime, ...props }, null, env?.PRETTY_LOG ? 2 : undefined)
		);
}

export function LoggerWithRequestId(requestId: string) {
	return _logger({ requestId });
}
