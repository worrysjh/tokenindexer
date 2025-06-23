create table contracts (
	id serial primary key,
	address TEXT unique not null,
	network text not null,
	created_at timestamp default now()
);

create table tokens (
	id serial primary key,
	token_id text not null,
	contract_address text not null,
	owner text not null,
	token_uri text,
	updated_at timestamp default now()
);

create table transactions (
	id serial primary key,
	tx_hash text not null,
	block_number integer,
	event_type text,
	token_id text,
	from_address text,
	to_address text,
	contract_address text,
	created_at timestamp default now()
);