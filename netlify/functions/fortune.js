export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, type, age } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: '缺少宠物名字或种类' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '服务器未配置 API Key' });
  }

  let prompt = '';
  if (type === '塑料袋') {
    prompt = `你是一位幽默可爱的宠物玄学大师，现在遇到一个特殊的“宠物”：一只沃尔玛塑料袋（这是小狗贝利私藏的宝贝）。请为这只塑料袋生成今日运势，不要提及任何具体名字，只用“这只塑料袋”或“贝利的塑料袋”称呼。

格式要求：
幸运色：...
今日宜：...
今日忌：...
（空一行）
然后输出完整版内容（包含：塑料袋的小心愿、今天最该回避的事、一句搞怪吉言）。风格要轻松、有梗。`;
  } else {
    let ageRule = '';
    if (age && (age.includes('月') || parseInt(age) < 1)) {
      ageRule = '年龄偏小（幼年）：建议包含磨牙、探索、短时间兴奋玩耍等';
    } else if (age && (parseInt(age) >= 7 || age.includes('老'))) {
      ageRule = '年龄偏大（老年）：建议包含软垫休息、温和散步、关节保健等';
    } else if (age) {
      ageRule = '成年宠物：建议适度运动、互动游戏、规律饮食';
    } else {
      ageRule = '年龄未知：正常通用内容';
    }
    prompt = `你是一位宠物玄学大师，风格温暖治愈、带点幽默。请为一只${type}，名字叫“${name}”，年龄${age || "未知"}，生成今日运势。
特别规则：${ageRule}
输出格式（前三行免费，后为付费完整版）：
幸运色：...
今日宜：...
今日忌：...
（空一行）
完整版内容：包括幸运数字、开运小物、与主人的互动建议、综合吉言。`;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 550
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API 调用失败');
    }
    const fortune = data.choices[0].message.content;
    res.status(200).json({ fortune });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
