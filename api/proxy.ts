export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const betaHeader = req.headers.get("anthropic-beta");

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "anthropic-version": "2023-06-01",
    "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
  };
  if (betaHeader) headers["anthropic-beta"] = betaHeader;

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers,
    body,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
