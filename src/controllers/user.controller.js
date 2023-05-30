import fetch from "node-fetch";
import { Op } from "sequelize";
import { User } from "../../models/tb_user.model.js";
import { CryptoCurrency } from "../../models/tb_cryptocurrency.model.js";
import { RealCurrency } from "../../models/tb_realcurrency.model.js";
import { UserCryptocurrency } from "../../models/tb_as_user_cryptocurrency.model.js";
import { BankAccount } from "../../models/tb_bank_account.model.js";
import { UserOperationLog } from "../../models/tb_user_operation_log.model.js";

var response = {};

export async function findUsers (req, res) {
    let { name } = req.query;
    !name ? name = '' : null;

    try {
        let users = await User.findAll({
            include: [ 
                {
                    model: UserCryptocurrency, attributes: [['as_user_crytocurrency_id','_id'], 'tb_cryptocurrency_cryptocurrency_id', 'stock'],
                    include: [
                        { model: CryptoCurrency, attributes: [['cryptocurrency_id', '_id'], 'name', 'symbol', 'v_dolar', 'v_quetzal'] }
                    ]
                },
                {
                    model: BankAccount, attributes: [['bank_account_id','_id'], 'tb_realcurrency_realcurrency_id', 'no_account', 'balance'],
                    include: [
                        { model: RealCurrency, attributes: [['realcurrency_id', '_id'], 'name', 'symbol'] }
                    ]
                },
                // {
                //     model: UserOperationLog, attributes: [['user_op_log_id','_id'], 'type', 'user_created', 'user_name'],
                //     where: {type: 0}
                // }
            ],
            where: {
                name: { [Op.iLike]: `%${name}%` } 
            }
        });

        users = await Promise.all(users.map(async (user) => {
            user = user.toJSON();

            user.full_name = user.name + ' ' + user.last_name + " | " + user.email;

            user.tb_as_user_cryptocurrencies = await Promise.all(user.tb_as_user_cryptocurrencies.map(async (crypto) => {
                // crypto.crypto_id = crypto.tb_cryptocurrency._id;
                // crypto.currency_data = crypto.tb_cryptocurrency.symbol + ' | ' + crypto.tb_cryptocurrency.name;
                crypto.currency_data = crypto.tb_cryptocurrency.name;
                crypto.currency_formated = `${crypto.tb_cryptocurrency.symbol}. ${Number((crypto.stock).toFixed(5))}`;
                // crypto.dolar = crypto.tb_cryptocurrency.v_dolar;
                // crypto.quetzal = crypto.tb_cryptocurrency.v_quetzal;

                delete crypto.tb_cryptocurrency;

                return crypto;
            }));

            user.tb_bank_accounts = await Promise.all(user.tb_bank_accounts.map(async (realCurrency) => {
                // realCurrency.realCurrency_id = realCurrency.tb_realcurrency._id;
                realCurrency.currency_data = realCurrency.tb_realcurrency.symbol + ' | ' + realCurrency.tb_realcurrency.name;
                realCurrency.currency_formated = `${realCurrency.tb_realcurrency.symbol} ${Number((realCurrency.balance).toFixed(2))}`;
                
                delete realCurrency.tb_realcurrency;

                return realCurrency;
            }));

            delete user.name;
            delete user.last_name;
            delete user.password;
            delete user.email;

            return user;
        }));

        users ? [response.status = 200, response.value = users] : [response.status = 404, response.value = { message: 'Not found!' }];

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function findUser (req, res) {
    let { userId } = req.params;
    try {
        let user = await User.findByPk(userId, {
            include: [ 
                {
                    model: UserCryptocurrency, attributes: [['as_user_crytocurrency_id','_id'], 'tb_cryptocurrency_cryptocurrency_id', 'stock'],
                    include: [
                        { model: CryptoCurrency, attributes: [['cryptocurrency_id', '_id'], 'name', 'symbol', 'v_dolar', 'v_quetzal'] }
                    ]
                },
                {
                    model: BankAccount, attributes: [['bank_account_id','_id'], 'tb_realcurrency_realcurrency_id', 'no_account', 'balance'],
                    include: [
                        { model: RealCurrency, attributes: [['realcurrency_id', '_id'], 'name', 'symbol'] }
                    ]
                },
                // {
                //     model: UserOperationLog, attributes: [['user_op_log_id','_id'], 'type', 'user_created', 'user_name'],
                //     where: {type: 0}
                // }
            ]
        });

        
        user = user.toJSON();

        user.full_name = user.name + ' ' + user.last_name + " | " + user.email;

        user.tb_as_user_cryptocurrencies = await Promise.all(user.tb_as_user_cryptocurrencies.map(async (crypto) => {
            // crypto.crypto_id = crypto.tb_cryptocurrency._id;
            // crypto.currency_data = crypto.tb_cryptocurrency.symbol + ' | ' + crypto.tb_cryptocurrency.name;
            crypto.currency_data = crypto.tb_cryptocurrency.name;
            crypto.currency_formated = `${crypto.tb_cryptocurrency.symbol} ${Number((crypto.stock).toFixed(5))}`;
            // crypto.dolar = crypto.tb_cryptocurrency.v_dolar;
            // crypto.quetzal = crypto.tb_cryptocurrency.v_quetzal;

            delete crypto.tb_cryptocurrency;

            return crypto;
        }));

        user.tb_bank_accounts = await Promise.all(user.tb_bank_accounts.map(async (realCurrency) => {
            // realCurrency.realCurrency_id = realCurrency.tb_realcurrency._id;
            // realCurrency.currency_data = realCurrency.tb_realcurrency.symbol + ' | ' + realCurrency.tb_realcurrency.name;
            realCurrency.currency_data = realCurrency.tb_realcurrency.name;
            realCurrency.currency_formated = `${realCurrency.tb_realcurrency.symbol}. ${Number((realCurrency.balance).toFixed(2))}`;
                
            delete realCurrency.tb_realcurrency;

            return realCurrency;
        }));

        delete user.name;
        delete user.last_name;
        delete user.password;
        delete user.email;

        user ? [response.status = 200, response.value = user] : [response.status = 404, response.value = { message: 'Not found!' }];

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function createUser (req, res) {
    let { name, last_name, email, password, tb_cryptocurrency_cryptocurrency_id, stock, tb_realcurrency_realcurrency_id, no_account, balance } = req.body;
    let newUser, newCryptoCurrency, newBankAccount;
    tb_realcurrency_realcurrency_id ? tb_realcurrency_realcurrency_id : tb_realcurrency_realcurrency_id = "59c94fa7-d25f-4e09-be7c-3fc591942e9b";
    
    try {
        newUser = await User.create({name, last_name, email, password});

        if (newUser) {
            if (tb_cryptocurrency_cryptocurrency_id && stock) {
                newCryptoCurrency = await UserCryptocurrency.create({tb_user_user_id: newUser.user_id, tb_cryptocurrency_cryptocurrency_id, stock });   
            }

            newBankAccount = await BankAccount.create({tb_user_user_id: newUser.user_id, tb_realcurrency_realcurrency_id, no_account, balance});

            await UserOperationLog.create({tb_user_user_id: "ce8361d3-4250-429b-8e85-b058a3ac3ecc", tb_cryptocurrency_cryptocurrency_id: "5eae7503-fc9f-4498-85ac-a4db89c674a8", tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b", type: 0, user_name: `${newUser.name} ${newUser.last_name} | ${newUser.email}`, user_created: true});
        }

        newUser = newUser.toJSON();

        newUser.cryptocurrency_account = newCryptoCurrency;
        newUser.bank_account = newBankAccount;
        delete newUser.password;

        newUser && newCryptoCurrency && newBankAccount ? [response.status = 200, response.value = newUser] : [response.status = 404, response.value = { message: 'Not found!' }];

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function login(req, res) {
    let {email, password } = req.body;
    let today = new Date();

    try {
        let user = await User.findOne({
            where: {email, password},
            attributes: ['user_id']
        });

        if (user) {
            let op = await UserOperationLog.create({tb_user_user_id: user.user_id, tb_cryptocurrency_cryptocurrency_id: "5eae7503-fc9f-4498-85ac-a4db89c674a8", tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b", type: 4, login: today});

            op ? [response.status = 200, response.value = user] : [response.status = 400, response.value = { message: "Bad Request!" }];
        }
        else {
            [response.status = 400, response.value = { message: "Usuario/Contraseña Incorrectas!" }]
        }
        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};

export async function logout(req, res) {
    let { userId } = req.params;
    let today = new Date();

    try {
        let op_ = await UserOperationLog.findOne({
            where: {tb_user_user_id: userId, type: 4},
            attributes: ['user_op_log_id', 'logout']
        });

        // let op = await UserOperationLog.create({tb_user_user_id: userId, tb_cryptocurrency_cryptocurrency_id: "5eae7503-fc9f-4498-85ac-a4db89c674a8", tb_realcurrency_realcurrency_id: "59c94fa7-d25f-4e09-be7c-3fc591942e9b", type: 5, logout: today});

        if (op_) {
            let logOut = await UserOperationLog.update({logout: today}, {where: {tb_user_user_id: userId, type: 4}});

            logOut ? [response.status = 200, response.value = { message: "Done!" }] : [response.status = 400, response.value = { message: "Bad Request!" }];
        }

        res.status(response.status).send(response.value);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error!' });
    }
};