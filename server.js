C:\Users\Pathway\Downloads\cse340motors>node server.js
✅ App listening on http://localhost:5500 (NODE_ENV=development)
Executed query: {
  text: 'SELECT * FROM public.classification ORDER BY classification_name',
  params: undefined
}
Executed query: { text: 'SELECT to_regclass($1::text)', params: [ '"session"' ] }
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833532,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747133 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833533,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747146 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833546,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747147 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747147 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833547,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833547,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747147 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833547,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747153 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833553,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747153 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747153 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833553,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747153 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833554,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833554,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747161 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833561,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747162 ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747162 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833562,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'SELECT sess FROM "session" WHERE sid = $1 AND expire >= to_timestamp($2)',
  params: [ 'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs', 1758747162 ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833562,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
Executed query: {
  text: 'INSERT INTO "session" (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid',
  params: [
    Session { cookie: [Object], flash: {} },
    1758833562,
    'h5cz00a2bkRTAShnvCPy2lYhpgrYTuZs'
  ]
}
