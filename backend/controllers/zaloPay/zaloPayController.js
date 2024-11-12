const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs');
const { publicLink } = require('./config');
const Order = require('../../models/orderModel');
const OrderController = require('../orderController');

const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};


exports.payment = async (req, res) => {

    const { orderId } = req.body
    const orderBook = await Order.findById(orderId)
    if (!orderBook) {
        return res.status(404).json({ message: 'Order not found' });
    }
    
        const embed_data = {
            //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
            redirecturl: 'http://localhost:3000',
        };


        const items = orderBook.itemsPayment;

        const order = {
            app_id: config.app_id,
            app_trans_id: `ZaloPay_${moment().format('YYMMDD')}_${orderId}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: orderBook.userId,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: orderBook.finalAmount,
            //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
            //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
            callback_url: `${publicLink}/api/zalopay/callback`,
            description: `BookShop - Payment for the order #${orderId}`,
            bank_code: '',
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            config.app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        try {
            const result = await axios.post(config.endpoint, null, { params: order });
            return res.status(200).json(result.data);
        } catch (error) {
            console.log(error);
        }
}

exports.callback = async (req, res) => {
    let result = {};
    console.log(req.body);
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id'],
            );

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message);
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
}

exports.checkStatusOrder = async (req, res) => {
    const { app_trans_id } = req.params;
    let postData = {
        app_id: config.app_id,
        app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
        /**
         * kết quả mẫu
          {
            "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
            "return_message": "",
            "sub_return_code": 1,
            "sub_return_message": "",
            "is_processing": false,
            "amount": 50000,
            "zp_trans_id": 240331000000175,
            "server_time": 1711857138483,
            "discount_amount": 0
          }
        */
    } catch (error) {
        console.log('lỗi');
        console.log(error);
    }
}