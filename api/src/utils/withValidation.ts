import { Request, Response } from "express";
import { z } from "zod";
import { Middleware } from "../types";

interface Handler<TBody, TParams, TQueryString> {
  (req: Request<TParams, {}, TBody, TQueryString>, res: Response): any;
}

interface ValidationProps<TBody, TParams, TQueryString> {
  body?: TBody;
  query?: TQueryString;
  params?: TParams;
}

export const withValidation =
  <
    TBody extends z.ZodTypeAny,
    TParams extends z.ZodTypeAny,
    TQueryString extends z.ZodTypeAny
  >(
    { body, query, params }: ValidationProps<TBody, TParams, TQueryString>,
    handler: Handler<z.infer<TBody>, z.infer<TParams>, z.infer<TQueryString>>
  ): Middleware =>
  async (req, res, next) => {
    if (body) {
      const result = await body.safeParseAsync(req.body);

      if (!result.success)
        return res.status(400).json({
          statusCode: 400,
          error: "Bad Request",
          message: "Body validation failed",
          details: result.error.format()._errors,
        });
    }

    if (query) {
      const result = await query.safeParseAsync(req.query);

      if (!result.success)
        return res.status(400).json({
          statusCode: 400,
          error: "Bad Request",
          message: "Querystring validation failed",
          details: result.error.format()._errors,
        });
    }

    if (params) {
      const result = await params.safeParseAsync(req.params);

      if (!result.success)
        return res.status(400).json({
          statusCode: 400,
          error: "Bad Request",
          message: "Params validation failed",
          details: result.error.format()._errors,
        });
    }

    handler(req, res);
  };