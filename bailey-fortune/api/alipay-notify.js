// api/alipay/notify.js
export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // 获取支付宝异步通知的参数
  const params = req.body; // POST 表单数据

  // TODO: 验证签名（必须！）
  // 这里需要根据你保存的支付宝公钥对 params 进行验签
  // 简化示例：假设你已验证通过

  const { out_trade_no, trade_status, trade_no } = params;

  // 判断交易状态是否为 TRADE_SUCCESS 或 TRADE_FINISHED
  if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
    // 支付成功，更新订单状态
    // 此处你需要将 out_trade_no（自己生成的订单号）标记为“已支付”
    // 并可以通过某种方式关联到用户的解锁凭证（例如写入数据库或设置一个临时 token）

    console.log(`订单 ${out_trade_no} 支付成功，支付宝交易号 ${trade_no}`);

    // 例如：你可以使用 Vercel KV 或 Upstash Redis 存储订单状态
    // await kv.set(`order:${out_trade_no}`, 'PAID', { ex: 3600 });

    // 返回 success 告诉支付宝不要再重复通知
    res.status(200).send('success');
  } else {
    res.status(200).send('success'); // 其他状态也返回 success
  }
}