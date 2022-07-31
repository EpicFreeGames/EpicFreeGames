import {
  Handlers as FreshHandlers,
  MiddlewareHandlerContext as FreshMiddlewareHandlerContext,
} from "$fresh/server.ts";

export type State = {
  /**
   * Will be always defined, because it's checked in the middleware.
   */
  auth: string;
};

// deno-lint-ignore no-explicit-any
export type Handlers<TData = any> = FreshHandlers<TData, State>;
export type MiddlewareHandlerContext = FreshMiddlewareHandlerContext<State>;
