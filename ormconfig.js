
module.exports= {
    development: {
       dialect: 'postgres',
       host: 'snuffleupagus.db.elephantsql.com',
       port: 5432,
       username: 'kknnchbw',
       password: 'WB2mIyeCwyblC4rdOEWxL_o_XnYnpBZt',
       database: 'kknnchbw',
    },
    test: {
       dialect: 'postgres',
       host: 'localhost',
       port: 5432,
       username: 'roku',
       password: 'roku',
       database: 'test',
    },
    production: {
       dialect: 'postgres',
       host: 'localhost',
       port: 5432,
       username: 'roku',
       password: 'roku',
       database: 'prod'
    }
}