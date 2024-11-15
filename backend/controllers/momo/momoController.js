const axios = require('axios');
const crypto = require('crypto');
const Order = require('../../models/orderModel')
const Payment = require('../../models/paymentModel')
const config = require('./config');
const PaymentController = require('../paymentController')
const {publicPort} = require('../../publicPort')
exports.momoPayment =  async (req, res) => {
  const { orderId } = req.body
     const orderBook = await Order.findById(orderId)

    if (!orderBook) {
        return res.status(404).json({ message: 'Order not found' });
     }

    const payment = await Payment.findOne({orderId})
    if(!payment){
        return res.status(404).json({ message: 'Order not found' });
     }
    let {
      accessKey,
      secretKey,
      orderInfo,
      partnerCode,
    
      requestType,
      extraData,
      orderGroupId,
      autoCapture,
      lang,
    } = config;
    var redirectUrl = `http://localhost:3000/payment/success?orderId=${orderId}`
    var amount = payment.finalAmount;
    //var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var ipnUrl= `${publicPort}/api/momo/callback/${payment.transactionId}`
  
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
  
    //signature
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'BookShop',
      storeId: 'BookShop',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
  
    // Send the request and handle the response
    let result;
    try {
      result = await axios(options);
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ statusCode: 500, message: error.message });
    }
};

exports.momoCallback = async (req, res) => {
  const {transactionId} = req.params
    /**
      resultCode = 0: giao dịch thành công.
      resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
      resultCode <> 0: giao dịch thất bại.
     */
    console.log('callback: ');
    console.log(req.body);
    try{
      await PaymentController.updatePaymentStatus(
        { params: { transactionId: transactionId }, body: { paymentStatus: 'success',finalAmount: 0 } },
        {
            status: (code) => ({ json: (message) => console.log('Update response:', message) }),
        }
    );
    return res.status(204).json(req.body);
    }
    catch(error){
      console.log(error)
    }
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */
  
    
  }

  exports.check = async (req, res) => {
    const { orderId } = req.body;
  
    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
  
    const result = await axios(options);
  
    return res.status(200).json(result.data);
  }