module.exports = {
  'secret' : '',
  'db_info' : {
    local: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '',
      database: ''
    },
  },
  'federation' : {
    'naver' : {
      'client_id' : '',
      'secret_id' : '',
      'callback_url' : '/oauth/naver/callback'
    },
    'kakao' : {
      'client_id' : '',
      'callback_url' : '/oauth/kakao/callback'
    }
  }
};
