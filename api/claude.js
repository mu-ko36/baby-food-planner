export default async function handler(req, res) {
   { ingredients } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        {
          role: "user",
content: `
以下の食材で11ヶ月赤ちゃん向け離乳食メニューを作ってください。

食材:
${ingredients}

必ず以下のJSON形式で回答してください。
説明文は書かないでください。

{
  "days":[
    {
      "day":1,
      "menu":"メニュー名",
      "recipe":"簡単レシピ"
    }
  ]
}

3日分作ってください。
`        }
      ]
    })
  });

  const data = await response.json();

  res.status(200).json(data);
}