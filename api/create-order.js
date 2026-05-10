// api/create-order.js
import AlipaySDK from 'alipay-sdk';

export default async function handler(req, res) {
// 临时允许 GET 以便调试
if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
}
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const alipay = new AlipaySDK({
    appId: process.env.ALIPAY_SANDBOX_APP_ID,
    privateKey: process.env.ALIPAY_SANDBOX_PRIVATE_KEY,
    alipayPublicKey: process.env.ALIPAY_SANDBOX_PUBLIC_KEY,
    gateway: process.env.ALIPAY_GATEWAY,
  });

  const outTradeNo = `ORDER_${Date.now()}`;

  const result = await alipay.pageExec('alipay.trade.page.pay', {
    bizContent: {
      out_trade_no: outTradeNo,
      product_code: 'FAST_INSTANT_TRADE_PAY',
      total_amount: '1.00',
      subject: '小狗贝利完整运势解锁',
    },
    returnUrl: 'https://xiaogoubailey.top?unlock=1',
    notifyUrl: 'https://xiaogoubailey.top/api/alipay/notify',
  });

  // 返回完整的 HTML 表单（自动提交）
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(result);
}
