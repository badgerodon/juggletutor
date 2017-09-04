CREATE TABLE families (
	id INTEGER NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	attribute_options TEXT NOT NULL
);
CREATE TABLE attributes (
	id INTEGER NOT NULL PRIMARY KEY,
	name TEXT NOT NULL
);
CREATE TABLE values (
	id INTEGER NOT NULL PRIMARY KEY,
	attribute_id INTEGER NOT NULL REFERENCES attributes (id),
	name TEXT NOT NULL
);

CREATE TABLE users (
	id TEXT NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	picture TEXT NOT NULL,
	type TEXT NOT NULL
);
CREATE INDEX users_type_idx ON users(type);

CREATE TABLE demonstrations (
	id TEXT NOT NULL PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users (id),
	family_id INTEGER NOT NULL REFERENCES families(id),
	attributes TEXT NOT NULL,
	date_submitted TIMESTAMP NOT NULL,
	status TEXT NOT NULL
);
CREATE INDEX demonstrations_family_id_idx ON demonstrations(family_id);
CREATE INDEX demonstrations_status_idx ON demonstrations(status);

CREATE TABLE lessons (
	id TEXT NOT NULL PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users (id),
	family_id INTEGER NOT NULL REFERENCES families (id),
	attributes TEXT NOT NULL,
	lesson TEXT NOT NULL,
	date_submitted TIMESTAMP NOT NULL,
	status TEXT NOT NULL
);
CREATE INDEX lessons_family_id_idx ON lessons(family_id);
CREATE INDEX lessons_status_idx ON lessons(status);