export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      ...(req.headers["anthropic-beta"]
        ? { "anthropic-beta": req.headers["anthropic-beta"] }
        : {}),
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
