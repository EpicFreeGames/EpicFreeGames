import { z } from "zod";
import { RequestData } from "./request";

export async function validateRequestData<
	TBody extends z.ZodTypeAny,
	TPathParams extends z.ZodTypeAny,
	TQueryParams extends z.ZodTypeAny
>(
	req: RequestData<z.infer<TBody>, z.infer<TPathParams>, z.infer<TQueryParams>>,
	validation: HandlerValidation<TBody, TPathParams, TQueryParams>
): Promise<
	| {
			valid: true;
			req: RequestData<z.infer<TBody>, z.infer<TPathParams>, z.infer<TQueryParams>>;
			errors?: never;
	  }
	| {
			valid: false;
			req?: never;
			errors: Errors;
	  }
> {
	let valid = true;
	let errors: Errors = {
		body: {},
		query: {},
		path: {},
	};

	if (validation.body && req.body) {
		const bodyResult = await validation.body.safeParseAsync(req.body);

		if (!bodyResult.success) {
			valid = false;
			errors.body = bodyResult.error.flatten().fieldErrors;
		} else {
			req.body = bodyResult.data;
		}
	}

	if (validation.query && req.queryParams) {
		const queryResult = await validation.query.safeParseAsync(req.queryParams);

		if (!queryResult.success) {
			valid = false;
			errors.query = queryResult.error.flatten().fieldErrors;
		} else {
			req.queryParams = queryResult.data;
		}
	}

	if (validation.path && req.pathParams) {
		const pathResult = await validation.path.safeParseAsync(req.pathParams);

		if (!pathResult.success) {
			valid = false;
			errors.path = pathResult.error.flatten().fieldErrors;
		} else {
			req.pathParams = pathResult.data;
		}
	}

	if (valid) {
		return {
			valid: true,
			req: req as RequestData<z.infer<TBody>, z.infer<TPathParams>, z.infer<TQueryParams>>,
		};
	} else {
		return {
			valid: false,
			errors,
		};
	}
}

export type HandlerValidation<
	TBody extends z.ZodTypeAny,
	TPathParams extends z.ZodTypeAny,
	TQueryParams extends z.ZodTypeAny
> = {
	body?: TBody;
	path?: TPathParams;
	query?: TQueryParams;
};

type Errors = {
	body: {
		[x: string]: string[] | undefined;
		[x: number]: string[] | undefined;
		[x: symbol]: string[] | undefined;
	};
	query: {
		[x: string]: string[] | undefined;
		[x: number]: string[] | undefined;
		[x: symbol]: string[] | undefined;
	};
	path: {
		[x: string]: string[] | undefined;
		[x: number]: string[] | undefined;
		[x: symbol]: string[] | undefined;
	};
};
