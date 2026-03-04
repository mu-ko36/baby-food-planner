export default async function handler(req, res) {

  try {

    const { ingredients } = req.body

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

必ずJSON形式で回答してください。

{
 "days":[
  {
   "day":1,
   "menu":"メニュー名",
   "recipe":"簡単レシピ"
  }
 ]
}
`
          }
        ]
      })
    })

const data = await response.json()

// 念のためログ
console.log("Claude response:", data)

// Claudeのテキスト取得
const text = data?.content?.[0]?.text || ""

if (!text) {
  throw new Error("Claude response empty")
}

// JSON部分抽出
const jsonStart = text.indexOf("{")
const jsonEnd = text.lastIndexOf("}") + 1

if (jsonStart === -1 || jsonEnd === -1) {
  throw new Error("JSON not found in Claude response")
}

const jsonString = text.slice(jsonStart, jsonEnd)

const result = JSON.parse(jsonString)

res.status(200).json(result)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: "Claude API error",
      detail: error.message
    })

  }
}