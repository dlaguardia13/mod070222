create table tb_user (
	user_id uuid not null,
	name varchar not null,
	last_name varchar not null,
	email varchar not null,
    password varchar not null,
	created_at timestamp with time zone,
	updated_at timestamp with time zone,
	deleted_at timestamp with time zone,
	constraint pk_tb_ur primary key(user_id)
);

create table tb_cryptocurrency (
	cryptocurrency_id uuid not null,
	name varchar not null,
	symbol varchar not null,
	v_dolar float not null,
    v_quetzal float not null,
	constraint pk_tb_cc primary key(cryptocurrency_id)
);

create table tb_realcurrency (
	realcurrency_id uuid not null,
	name varchar not null,
	symbol varchar not null,
	constraint pk_tb_rc primary key(realcurrency_id)
);

create table tb_as_user_cryptocurrency (
	as_user_crytocurrency_id uuid not null,
	tb_user_user_id uuid not null,
	tb_cryptocurrency_cryptocurrency_id uuid not null,
	stock float not null,
	constraint pk_tb_as_ur_cc primary key(as_user_crytocurrency_id)
);

alter table tb_as_user_cryptocurrency add constraint fk_tb_user_as_ur_cc
foreign key (tb_user_user_id)
references tb_user (user_id);

alter table tb_as_user_cryptocurrency add constraint fk_tb_crypto_as_ur_cc
foreign key (tb_cryptocurrency_cryptocurrency_id)
references tb_cryptocurrency (cryptocurrency_id);

create table tb_bank_account (
	bank_account_id uuid not null,
	tb_user_user_id uuid not null,
	tb_realcurrency_realcurrency_id uuid not null,
	no_account varchar,
    balance float,
	constraint pk_tb_ba primary key(bank_account_id)
);

alter table tb_bank_account add constraint fk_tb_ur_ba
foreign key (tb_user_user_id)
references tb_user (user_id);

alter table tb_bank_account add constraint fk_tb_ba_rc
foreign key (tb_realcurrency_realcurrency_id)
references tb_realcurrency (realcurrency_id);

create table tb_user_operation_log (
	user_op_log_id uuid not null,
	tb_user_user_id uuid not null,
	tb_cryptocurrency_cryptocurrency_id uuid not null,
	tb_realcurrency_realcurrency_id uuid not null,
    type integer not null,
    exchange_side integer,
	cc_amount_b float,
	cc_amount_a float,
	rc_amount_b float,
    rc_amount_a float,
	sell_at timestamp with time zone,
	buy_at timestamp with time zone,
	exchange_at timestamp with time zone,
    login timestamp with time zone,
    logout timestamp with time zone,
    user_created boolean,
	constraint pk_tb_ur_op_lg primary key(user_op_log_id)
);

alter table tb_user_operation_log add constraint fk_tb_ol_ur
foreign key (tb_user_user_id)
references tb_user (user_id);

alter table tb_user_operation_log add constraint fk_tb_ol_cc
foreign key (tb_cryptocurrency_cryptocurrency_id)
references tb_cryptocurrency (cryptocurrency_id);

alter table tb_user_operation_log add constraint fk_tb_ol_rc
foreign key (tb_realcurrency_realcurrency_id)
references tb_realcurrency (realcurrency_id);

---

insert into tb_cryptocurrency (cryptocurrency_id, "name", symbol, v_dolar, v_quetzal)
values(uuid_generate_v4(), 'Bitcoin', '₿', 27406, 213822);

insert into tb_cryptocurrency (cryptocurrency_id, "name", symbol, v_dolar, v_quetzal)
values(uuid_generate_v4(), 'Ethereum', 'Ξ', 1828, 142677);

insert into tb_cryptocurrency (cryptocurrency_id, "name", symbol, v_dolar, v_quetzal)
values(uuid_generate_v4(), 'Tether', '₮', 1, 8);

insert into tb_realcurrency (realcurrency_id, "name", symbol)
values(uuid_generate_v4(), 'Dolar', '$');

insert into tb_realcurrency (realcurrency_id, "name", symbol)
values(uuid_generate_v4(), 'Quetzal', 'Q');