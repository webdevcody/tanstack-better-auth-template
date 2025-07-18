import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { redirect } from "@tanstack/react-router";

export const isAuthenticated = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const request = getWebRequest();

  if (!request?.headers) {
    throw redirect({ to: "/" });
  }
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw redirect({ to: "/" });
  }

  return next({
    context: { userId: session.user.id },
  });
});

export const optionalAuthentication = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const request = getWebRequest();

  const session = await auth.api.getSession({ headers: request.headers });

  return next({
    context: { userId: session?.user.id },
  });
});
