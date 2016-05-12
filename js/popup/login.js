function LoginController() {
  var isAutoLogin = false;
  var errValidator = $('#div_error_validator');
  var username = $('#username');
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
    var loginMsg = chrome.i18n.getMessage('logging');
    PopupView.showWaiting(loginMsg);
    var loginParam = {
      client_type: PF.Constant.LOGIN_PARAMS.CLIENT_TYPE,
      api_version: PF.Constant.LOGIN_PARAMS.API_VERSION,
      username: username.val(),
      password: 'md5.' + hex_md5(password.val())
    };
    login(loginParam);
  }

  function login(loginParam) {
    console.log(loginParam);
    var port = chrome.extension.connect({
      name: 'login'
    });
    port.postMessage(loginParam);
    port.onMessage.addListener(function(res) {
      var code = res.code;
      console.log('code' + code);
    });
  }
  this.autoLogin = autoLogin;
}
