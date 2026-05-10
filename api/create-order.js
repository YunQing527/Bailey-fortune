export default async function handler(req, res) {
  try {
    // 检查环境变量
    const appId = process.env.ALIPAY_SANDBOX_APP_ID;
    const privateKey = process.env.ALIPAY_SANDBOX_PRIVATE_KEY;
    const publicKey = process.env.ALIPAY_SANDBOX_PUBLIC_KEY;
    const gateway = process.env.ALIPAY_GATEWAY;

    res.status(200).json({
      appIdExists: !!appId,
      privateKeyExists: !!privateKey,
      publicKeyExists: !!publicKey,
      gatewayExists: !!gateway,
      appIdValue: appId ? '隐藏' : '无',
      gatewayValue: gateway ? '隐藏' : '无',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
