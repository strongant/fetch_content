function LoginController() {
  var isAutoLogin = false;
  var errValidator = $('#div_error_validator');
  var user_id = $('#user_id');
  var password = $('#password');
  var keep_password = $('#kepp_password');

  $('#login_button').on('click', loginOnSubmit);
  $('.PFLogin').on('keydown', 'input,button', function(e) {
    if (e.which === 13) {
      loginOnSubmit();
    }
  });
  /**
   * 使用cookie自动登录
   * @param  {object} cookie 登录的cookie对象
   */
  function autoLogin(cookie) {
    isAutoLogin = true;
    var info = cookie.value;
    var longinParam = {
      client_type: PF.Constant.LOGIN_PARAMS.CLIENT_TYPE,
      api_version: PF.Constant.LOGIN_PARAMS.API_VERSION,
      cookieStr: info
    };
    login(longinParam);
  }
  //点击登陆按钮或者回车键进行触发此方法的调用
  function loginOnSubmit() {

    if (checkUserName() && checkPassword()) {
      doLogin();
    }
  }

  function checkUserName() {
    return true;
  }

  function checkPassword() {
    return true;
  }

  //执行请求登陆的操作
  function doLogin() {
    console.log('login');
  }

  function login(loginParam) {
    console.log('login');
  }
  this.autoLogin = autoLogin;
}
