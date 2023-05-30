import fetch from "node-fetch";
import { User } from "../../models/tb_user.model.js";
import { CryptoCurrency } from "../../models/tb_cryptocurrency.model.js";
import { RealCurrency } from "../../models/tb_realcurrency.model.js";
import { UserCryptocurrency } from "../../models/tb_as_user_cryptocurrency.model.js";
import { BankAccount } from "../../models/tb_bank_account.model.js";
import { UserOperationLog } from "../../models/tb_user_operation_log.model.js";

let btc, eth, usdt, hDataB, hDataE, hDataT = {};

fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,USDT&tsyms=USD,GTQ")
.then((response) => {
    return response.json();
})
.then((val) => {
    btc = val.BTC;
    eth = val.ETH;
    usdt = val.USDT;
});

fetch("https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2")
.then((response) => {
    return response.json();
})
.then((val) => {
    hDataB = val.Data.Data;
});

fetch("https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=USD&limit=2")
.then((response) => {
    return response.json();
})
.then((val) => {
    hDataE = val.Data.Data;
});

fetch("https://min-api.cryptocompare.com/data/v2/histoday?fsym=USDT&tsym=USD&limit=2")
.then((response) => {
    return response.json();
})
.then((val) => {
    hDataT = val.Data.Data;
});

var response = {};

export async function buyCryptoCurrency(req, res) {
    let { userId } = req.params;
    let { cryptocurrency_id, d_amount, accepted } = req.body;
    let buyTop, total;
    let simulation = {};
    let vBtc, vEth, vUsdt;
    let today = new Date();

    try {
        let cryptocurrency_ = await CryptoCurrency.findByPk(cryptocurrency_id, {
            attributes: ['name', 'symbol', 'v_dolar']
        });

        let bankAccount = await BankAccount.findOne({
            where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" },
            attributes: ['tb_realcurrency_realcurrency_id', 'balance'],
            include: { model: RealCurrency, attributes: ['name', 'symbol'] }
        });

        let userCryptocurrency = await UserCryptocurrency.findOne({
            where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id },
            attributes: ['tb_cryptocurrency_cryptocurrency_id', 'stock'],
            include: { model: CryptoCurrency, attributes: ['name', 'symbol', 'v_dolar'] }
        });

        bankAccount = bankAccount.toJSON();
        cryptocurrency_ = cryptocurrency_.toJSON();
        
        if (userCryptocurrency) {
            userCryptocurrency = userCryptocurrency.toJSON();
    
            if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vBtc);
                buyTop = (parseFloat(d_amount) / vBtc);
                // total = cc_amount * vBtc;
            } else if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vEth);
                buyTop = (parseFloat(d_amount) / vEth);
                // total = cc_amount * vEth;
            } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether"){
                usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vUsdt);
                buyTop = (parseFloat(d_amount) / vUsdt);
                // total = cc_amount * vUsdt;
            }
    
            // if (buyTop && (cc_amount <= buyTop)) {
            if (d_amount <= bankAccount.balance) {
                simulation.cryptocurrency_id = cryptocurrency_id;
                simulation.d_amount = d_amount;
                simulation.cryptocurrency_formated = `${userCryptocurrency.tb_cryptocurrency.symbol} ${Number((buyTop).toFixed(5))}`;
                simulation.new_stock_formated = `${userCryptocurrency.tb_cryptocurrency.symbol} ${Number((userCryptocurrency.stock + buyTop).toFixed(5))}`;
                // simulation.total_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((total).toFixed(2))}`;
                simulation.balance_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((bankAccount.balance - d_amount).toFixed(2))}`;
                simulation.accepted = accepted;
    
                bankAccount && userCryptocurrency && accepted == false ? [response.status = 200, response.value = simulation] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            } else {
                response.status = 400; 
                response.value = { message: 'Operación No Valida!' };
            }
            
            if (accepted == true) {
                let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b",
                type: 1, cc_amount_b: userCryptocurrency.stock, cc_amount_a: (userCryptocurrency.stock + buyTop), rc_amount_b: bankAccount.balance, rc_amount_a: (bankAccount.balance - d_amount), buy_at: today });
    
                let cAccount = await UserCryptocurrency.update({stock: (userCryptocurrency.stock + buyTop)}, 
                    {
                        where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id }
                    }
                );
    
                let bAccount = await BankAccount.update({balance: (bankAccount.balance - d_amount)}, 
                    {
                        where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" }
                    }
                );
    
                cAccount && bAccount && op ? [response.status = 200, response.value = { message: 'Done!' }] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            }
        } else {

            if (cryptocurrency_.name === "Bitcoin") {
                btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(cryptocurrency_.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vBtc);
                buyTop = (parseFloat(d_amount) / vBtc);
                // total = cc_amount * vBtc;
            } else if (cryptocurrency_.name === "Ethereum") {
                eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(cryptocurrency_.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vEth);
                buyTop = (parseFloat(d_amount) / vEth);
                // total = cc_amount * vEth;
            } else if (cryptocurrency_.name === "Tether"){
                usdt.USD != null ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(cryptocurrency_.v_dolar);
                // buyTop = (parseFloat(bankAccount.balance) / vUsdt);
                buyTop = (parseFloat(d_amount) / vUsdt);
                // total = cc_amount * vUsdt;
            }

            // if (buyTop && (cc_amount <= buyTop)) {
            if (d_amount <= bankAccount.balance) {
                simulation.cryptocurrency_id = cryptocurrency_id;
                simulation.d_amount = d_amount;
                simulation.cryptocurrency_formated = `${cryptocurrency_.symbol} ${Number((buyTop).toFixed(5))}`;
                simulation.new_stock_formated = `${cryptocurrency_.symbol} ${Number((buyTop).toFixed(5))}`;
                // simulation.total_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((total).toFixed(2))}`;
                simulation.balance_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((bankAccount.balance - d_amount).toFixed(2))}`;
                simulation.accepted = accepted;
    
                bankAccount && accepted == false ? [response.status = 200, response.value = simulation] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            } else {
                response.status = 400; 
                response.value = { message: 'Operación No Valida!' };
            }

            if (accepted == true) {
                let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b",
                type: 1, cc_amount_b: 0, cc_amount_a: buyTop, rc_amount_b: bankAccount.balance, rc_amount_a: (bankAccount.balance - d_amount), buy_at: today });
    
                let newCryptoAccount = await UserCryptocurrency.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, stock: buyTop });
    
                let bAccount = await BankAccount.update({balance: (bankAccount.balance - d_amount)}, 
                    {
                        where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" }
                    }
                );
    
                newCryptoAccount && bAccount && op ? [response.status = 200, response.value = { message: 'Done!' }] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            }
        }
    
        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function sellCryptoCurrency(req, res) {
    let { userId } = req.params;
    let { cryptocurrency_id, cc_amount, accepted } = req.body;
    let total, totalQ;
    let simulation = {};
    let vBtc, vEth, vUsdt, vBtcQ, vEthQ, vUsdtQ;
    let today = new Date();

    try {
        let bankAccount = await BankAccount.findOne({
            where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" },
            attributes: ['tb_realcurrency_realcurrency_id', 'balance'],
            include: { model: RealCurrency, attributes: ['name', 'symbol'] }
        });

        let userCryptocurrency = await UserCryptocurrency.findOne({
            where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id },
            attributes: ['tb_cryptocurrency_cryptocurrency_id', 'stock'],
            include: { model: CryptoCurrency, attributes: ['name', 'symbol', 'v_dolar', 'v_quetzal'] }
        });

        userCryptocurrency = userCryptocurrency.toJSON();
        bankAccount = bankAccount.toJSON();

        if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
            btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
            btc.GTQ ? vBtcQ = parseFloat(btc.GTQ) : vBtcQ = parseFloat(userCryptocurrency.tb_cryptocurrency.v_quetzal);
            total = cc_amount * vBtc;
            totalQ = cc_amount * vBtcQ;
        } else if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
            eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
            eth.GTQ ? vEthQ = parseFloat(eth.GTQ) : vEthQ = parseFloat(userCryptocurrency.tb_cryptocurrency.v_quetzal);
            total = cc_amount * vEth;
            totalQ = cc_amount * vEthQ;
        } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether"){
            usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
            usdt.GTQ ? vUsdtQ = parseFloat(usdt.GTQ) : vUsdtQ = parseFloat(userCryptocurrency.tb_cryptocurrency.v_quetzal);
            total = cc_amount * vUsdt;
            totalQ = cc_amount * vUsdtQ;
        }

        if (cc_amount <= userCryptocurrency.stock) {
            simulation.cryptocurrency_id = cryptocurrency_id;
            simulation.cc_amount = cc_amount;
            simulation.new_stock_formated = `${userCryptocurrency.tb_cryptocurrency.symbol} ${Number((userCryptocurrency.stock - cc_amount).toFixed(5))}`;
            simulation.total_dollars_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((total).toFixed(2))}`;
            simulation.total_quetzal_formated = `GTQ ${Number((totalQ).toFixed(2))}`;
            simulation.new_balance_formated = `${bankAccount.tb_realcurrency.symbol} ${Number((bankAccount.balance + total).toFixed(2))}`;
            simulation.accepted = accepted;

            bankAccount && userCryptocurrency && accepted == false ? [response.status = 200, response.value = simulation] : [response.status = 400, response.value = { message: 'Bad Request!' }];
        } else {
            response.status = 400; 
            response.value = { message: 'Operación No Valida!' };
        }

        if (accepted == true) {
            let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b",
            type: 2, cc_amount_b: userCryptocurrency.stock, cc_amount_a: (userCryptocurrency.stock - cc_amount), rc_amount_b: bankAccount.balance, rc_amount_a: (bankAccount.balance + total), sell_at: today });

            let cAccount = await UserCryptocurrency.update({stock: (userCryptocurrency.stock - cc_amount)}, 
                {
                    where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id }
                }
            );

            let bAccount = await BankAccount.update({balance: (bankAccount.balance + total)}, 
                {
                    where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" }
                }
            );

            cAccount && bAccount && op ? [response.status = 200, response.value = { message: 'Done!' }] : [response.status = 400, response.value = { message: 'Bad Request!' }];
        }
    
        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function exchangeCryptoCurrency(req, res) {
    let { userId } = req.params;
    let { cryptocurrency_id, cc_amount, requested_cryptocurrency_id, accepted } = req.body;
    let mcc_total, ccr_total, ex_amount;
    let simulation = {};
    let vBtc, vEth, vUsdt;
    let today = new Date();

    try {
        let cryptocurrency_ = await CryptoCurrency.findByPk(requested_cryptocurrency_id, {
            attributes: ['name', 'symbol', 'v_dolar']
        });

        let bankAccount = await BankAccount.findOne({
            where: { tb_user_user_id: userId, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b" },
            attributes: ['tb_realcurrency_realcurrency_id', 'balance'],
            include: { model: RealCurrency, attributes: ['name', 'symbol'] }
        });

        let userCryptocurrency = await UserCryptocurrency.findOne({
            where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id },
            attributes: ['tb_cryptocurrency_cryptocurrency_id', 'stock'],
            include: { model: CryptoCurrency, attributes: ['name', 'symbol', 'v_dolar'] }
        });

        let rUserCryptocurrency = await UserCryptocurrency.findOne({
            where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: requested_cryptocurrency_id },
            attributes: ['tb_cryptocurrency_cryptocurrency_id', 'stock'],
            include: { model: CryptoCurrency, attributes: ['name', 'symbol', 'v_dolar'] }
        });

        bankAccount = bankAccount.toJSON();
        cryptocurrency_ = cryptocurrency_.toJSON();

        if (rUserCryptocurrency) {
            rUserCryptocurrency = rUserCryptocurrency.toJSON();
            userCryptocurrency = userCryptocurrency.toJSON();
    
            if (rUserCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(rUserCryptocurrency.tb_cryptocurrency.v_dolar);
    
                if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                    eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vEth;
                    ex_amount = (parseFloat(mcc_total) / vBtc);
                    ccr_total = ex_amount * vBtc;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether") {
                    usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vUsdt;
                    ex_amount = (parseFloat(mcc_total) / vBtc);
                    ccr_total = ex_amount * vBtc;
                }
            } else if (rUserCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(rUserCryptocurrency.tb_cryptocurrency.v_dolar);
                
                if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                    btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vBtc;
                    ex_amount = (parseFloat(mcc_total) / vEth);
                    ccr_total = ex_amount * vEth;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether") {
                    usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vUsdt;
                    ex_amount = (parseFloat(mcc_total) / vEth);
                    ccr_total = ex_amount * vEth;
                }
            } else if (rUserCryptocurrency.tb_cryptocurrency.name === "Tether"){
                usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(rUserCryptocurrency.tb_cryptocurrency.v_dolar);
                
                if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                    btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vBtc;
                    ex_amount = (parseFloat(mcc_total) / vUsdt);
                    ccr_total = ex_amount * vUsdt;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                    eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vEth;
                    ex_amount = (parseFloat(mcc_total) / vUsdt);
                    ccr_total = ex_amount * vUsdt;
                }
            }

            if (mcc_total <= ccr_total) {
                simulation.cryptocurrency_id = cryptocurrency_id;
                simulation.requested_cryptocurrency_id = requested_cryptocurrency_id;
                simulation.cc_amount = cc_amount;
                // simulation.new_stock_formated = `${userCryptocurrency.tb_cryptocurrency.symbol} ${Number((userCryptocurrency.stock - cc_amount).toFixed(5))}`;
                simulation.requested_cryptocurrency_stock_formated = `${rUserCryptocurrency.tb_cryptocurrency.symbol} ${Number((ex_amount).toFixed(5))}`;
                simulation.dolar_value = `$ ${Number((ccr_total).toFixed(2))}`;
                simulation.accepted = accepted;
    
                rUserCryptocurrency && userCryptocurrency && accepted == false ? [response.status = 200, response.value = simulation] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            } else {
                response.status = 400; 
                response.value = { message: 'Operación No Valida!' };
            }

            if (accepted == true) {
                let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b",
                type: 3, exchange_side: `${rUserCryptocurrency.tb_cryptocurrency.symbol}`, cc_amount_b: userCryptocurrency.stock, cc_amount_a: (userCryptocurrency.stock - cc_amount), rc_amount_b: rUserCryptocurrency.stock, rc_amount_a: (rUserCryptocurrency.stock + ex_amount), exchange_at: today });
    
                let cAccount = await UserCryptocurrency.update({stock: (userCryptocurrency.stock - cc_amount)}, 
                    {
                        where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id }
                    }
                );

                let cAccount_ = await UserCryptocurrency.update({stock: (rUserCryptocurrency.stock + ex_amount)}, 
                    {
                        where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: requested_cryptocurrency_id }
                    }
                );
    
                cAccount && cAccount_ && op ? [response.status = 200, response.value = { message: 'Done!' }] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            }
        } else {
            if (cryptocurrency_.name === "Bitcoin") {
                btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(cryptocurrency_.v_dolar);
    
                if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                    eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vEth;
                    ex_amount = (parseFloat(mcc_total) / vBtc);
                    ccr_total = ex_amount * vBtc;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether") {
                    usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vUsdt;
                    ex_amount = (parseFloat(mcc_total) / vBtc);
                    ccr_total = ex_amount * vBtc;
                }
            } else if (cryptocurrency_.name === "Ethereum") {
                eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(cryptocurrency_.v_dolar);
                
                if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                    btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vBtc;
                    ex_amount = (parseFloat(mcc_total) / vEth);
                    ccr_total = ex_amount * vEth;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Tether") {
                    usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vUsdt;
                    ex_amount = (parseFloat(mcc_total) / vEth);
                    ccr_total = ex_amount * vEth;
                }
            } else if (cryptocurrency_.name === "Tether") {
                usdt.USD ? vUsdt = parseFloat(usdt.USD) : vUsdt = parseFloat(cryptocurrency_.v_dolar);
                
                if (userCryptocurrency.tb_cryptocurrency.name === "Bitcoin") {
                    btc.USD ? vBtc = parseFloat(btc.USD) : vBtc = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vBtc;
                    ex_amount = (parseFloat(mcc_total) / vUsdt);
                    ccr_total = ex_amount * vUsdt;
                } else if (userCryptocurrency.tb_cryptocurrency.name === "Ethereum") {
                    eth.USD ? vEth = parseFloat(eth.USD) : vEth = parseFloat(userCryptocurrency.tb_cryptocurrency.v_dolar);
                    mcc_total = cc_amount * vEth;
                    ex_amount = (parseFloat(mcc_total) / vUsdt);
                    ccr_total = ex_amount * vUsdt;
                }
            }

            if (mcc_total <= ccr_total) {
                simulation.cryptocurrency_id = cryptocurrency_id;
                simulation.requested_cryptocurrency_id = requested_cryptocurrency_id;
                simulation.cc_amount = cc_amount;
                // simulation.new_stock_formated = `${userCryptocurrency.tb_cryptocurrency.symbol} ${Number((userCryptocurrency.stock - cc_amount).toFixed(5))}`;
                simulation.requested_cryptocurrency_stock_formated = `${cryptocurrency_.symbol} ${Number((ex_amount).toFixed(5))}`;
                simulation.dolar_value = `$ ${Number((ccr_total).toFixed(2))}`;
                simulation.accepted = accepted;
    
                cryptocurrency_ && userCryptocurrency && accepted == false ? [response.status = 200, response.value = simulation] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            } else {
                response.status = 400; 
                response.value = { message: 'Operación No Valida!' };
            }

            if (accepted == true) {
                let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id, tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b",
                type: 3, exchange_side: `${cryptocurrency_.symbol}`, cc_amount_b: userCryptocurrency.stock, cc_amount_a: (userCryptocurrency.stock - cc_amount), rc_amount_b: 0, rc_amount_a: ex_amount, exchange_at: today });
    
                let cAccount = await UserCryptocurrency.update({stock: (userCryptocurrency.stock - cc_amount)}, 
                    {
                        where: { tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency_id }
                    }
                );

                let cAccount_ = await UserCryptocurrency.create({ tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: requested_cryptocurrency_id, stock: ex_amount});
    
                cAccount && cAccount_ && op ? [response.status = 200, response.value = { message: 'Done!' }] : [response.status = 400, response.value = { message: 'Bad Request!' }];
            }
        }

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function getOperationLogs(req, res) {
    let { type, userId } = req.params;
    let { limit, cryptocurrency } = req.query;
    let whereOptions = {};
    limit ? limit : limit = 10;
    cryptocurrency ? whereOptions = { type, tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: cryptocurrency } : whereOptions = { type, tb_user_user_id: userId};
    type == 4 && cryptocurrency ? whereOptions = { type, tb_user_user_id: userId} : null;
    console.log(userId);
    try {
        let opLog = await UserOperationLog.findAll({
            where: whereOptions,
            include: [
                { model: User, attributes: [['user_id', '_id'], 'name', 'last_name', 'email'] },
                { model: CryptoCurrency, attributes: [['cryptocurrency_id', '_id'], 'name', 'symbol']},
                { model: RealCurrency, attributes: [['realcurrency_id', '_id'], 'name', 'symbol']},

            ],
            limit
        });

        switch (parseInt(type)) {
            case 0:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();

                    log.created_by = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    delete log.sell_at;
                    delete log.buy_at;
                    delete log.exchange_at;
                    delete log.login;
                    delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;

                    return log;
                }));
                break;
                    
            case 1:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();
    
                    log.user = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;
                    log.crypto_amount = `${log.tb_cryptocurrency.symbol} ${Number((log.cc_amount_a - log.cc_amount_b).toFixed(5))}`;
                    log.total = `${log.tb_realcurrency.symbol} ${Number((log.rc_amount_b - log.rc_amount_a).toFixed(2))}`;
                    log.crypto_stock_a = `${log.tb_cryptocurrency.symbol} ${Number((log.cc_amount_a).toFixed(5))}`;
                    log.balance_a = `${log.tb_realcurrency.symbol} ${Number((log.rc_amount_a).toFixed(2))}`;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    delete log.sell_at;
                    // delete log.buy_at;
                    delete log.exchange_at;
                    delete log.login;
                    delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;
                    delete log.createdAt;
                    delete log.user_name;
                    delete log.user_created;
    
                    return log;
                }));
            break;

            case 2:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();
    
                    log.user = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;
                    log.crypto_amount = `${log.tb_cryptocurrency.symbol} ${Number((log.cc_amount_b - log.cc_amount_a).toFixed(5))}`;
                    log.total = `${log.tb_realcurrency.symbol} ${Number((log.rc_amount_a - log.rc_amount_b).toFixed(2))}`;
                    log.crypto_stock_a = `${log.tb_cryptocurrency.symbol} ${Number((log.cc_amount_a).toFixed(5))}`;
                    log.balance_a = `${log.tb_realcurrency.symbol} ${Number((log.rc_amount_a).toFixed(2))}`;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    // delete log.sell_at;
                    delete log.buy_at;
                    delete log.exchange_at;
                    delete log.login;
                    delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;
                    delete log.createdAt;
                    delete log.user_name;
                    delete log.user_created;
    
                    return log;
                }));
            break;
        
            case 3:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();
    
                    log.user = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;
                    log.given_crypto = `${log.tb_cryptocurrency.symbol} ${Number((log.cc_amount_b - log.cc_amount_a).toFixed(5))}`;
                    log.acquired_crypto = `${log.exchange_side} ${Number((log.rc_amount_a - log.rc_amount_b).toFixed(5))}`;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    delete log.sell_at;
                    delete log.buy_at;
                    // delete log.exchange_at;
                    delete log.login;
                    delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;
                    delete log.createdAt;
                    delete log.user_name;
                    delete log.user_created;
    
                    return log;
                }));
            break;
            
            case 4:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();

                    log.user = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    delete log.sell_at;
                    delete log.buy_at;
                    delete log.exchange_at;
                    // delete log.login;
                    // delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;
                    delete log.user_name;
                    delete log.user_created;

                    return log;
                }));
            break;

            case 5:
                opLog = await Promise.all(opLog.map(async (log) => {
                    log = log.toJSON();

                    log.user = log.tb_user.name + " " + log.tb_user.last_name + " | " + log.tb_user.email;

                    delete log.tb_cryptocurrency_cryptocurrency_id;
                    delete log.tb_realcurrency_realcurrency_id;
                    delete log.exchange_side;
                    delete log.cc_amount_b;
                    delete log.cc_amount_a;
                    delete log.rc_amount_b;
                    delete log.rc_amount_a;
                    delete log.sell_at;
                    delete log.buy_at;
                    delete log.exchange_at;
                    delete log.login;
                    // delete log.logout;
                    delete log.tb_cryptocurrency;
                    delete log.tb_realcurrency;
                    delete log.tb_user;
                    delete log.updatedAt;
                    delete log.deletedAt;
                    delete log.user_name;
                    delete log.user_created;

                    return log;
                }));
            break;

            default:
                break;
        }

        opLog ? [response.status = 200, response.value = opLog] : [response.status = 404, response.value = { message: 'Not found!' }];

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function getHistoricalValue(req, res) {
    let { currency } = req.query;
    currency ? currency : currency = "5eae7503-fc9f-4498-85ac-a4db89c674a8";
    let crypto = {};
    let resp = {};

    try {

        let currency_ = await CryptoCurrency.findByPk(currency, {
            attributes: ['name', 'symbol']
        });

        currency_.name == "Bitcoin" ? crypto = hDataB : null;
        currency_.name == "Ethereum" ? crypto = hDataE : null;
        currency_.name == "Tether" ? crypto = hDataT : null;

        resp.currency = `${currency_.symbol} | ${currency_.name}`;

        resp.data = await Promise.all(crypto.map(async (data) => {
            // data = data.toJSON();
            // Unix Timestamp
            let timestamps = new Date(data.time * 1000);

            data.high_formated = `$ ${data.high}`
            data.low_formated = `$ ${data.low}`
            // data.date = "" + timestamps.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
            data.time_ = new Date(data.time * 1000);

            delete data.open;
            delete data.volumefrom;
            delete data.volumeto;
            delete data.close;
            delete data.conversionType;
            delete data.conversionSymbol;
            // delete data.time;

            return data;
        }));

        crypto && currency_ ? [response.status = 200, response.value = resp] : [response.status = 404, response.value =  {message: "Not Found!"}];

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};