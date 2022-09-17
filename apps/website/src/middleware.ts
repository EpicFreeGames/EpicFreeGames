import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { efgApiBaseUrl, efgApiToken } from "~utils/envs";

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const splittedPath = req.nextUrl.pathname.split("/");

  if (splittedPath.length !== 4) return NextResponse.redirect(req.nextUrl.origin);

  const redirectType = splittedPath.at(-2);
  const gameId = splittedPath.at(-1);

  const gameResponse = await fetch(`${efgApiBaseUrl}/games/${gameId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${efgApiToken}`,
    },
  });

  if (!gameResponse.ok) return NextResponse.redirect(req.nextUrl.origin);
  const game = await gameResponse.json().catch(() => null);

  if (!game) return NextResponse.redirect(req.nextUrl.origin);

  if (redirectType === "web") {
    return NextResponse.redirect(game.webLink);
  } else if (redirectType === "app") {
    return NextResponse.redirect(game.appLink);
  } else {
    return NextResponse.redirect(req.nextUrl.origin);
  }
};

export const config = {
  matcher: ["/r/web/:gameId?", "/r/app/:gameId?"],
};
