var PF_Context = {
  token: '', //token初始值不能设置为null，会造成xmlrpc无法解析，返回错误
  tab: null,
  username: null,
  queryTime: 0, // 当前轮询次数
  cookies: null,
  myPFEmail: '',
  openAPIUrl: ''
};

function onConnectListener(port) {
  //console.log('-------onConnectListener----')
  //console.log(port)
  var name = port.name;
  if (!name) {
    return;
  }
  switch (name) {
    case 'login':
      port.onMessage.addListener(portLogin);
      break;
    case 'saveDocument':
      port.onMessage.addListener(function(info) {
        console.log(info);
        if (!info) {
          return;
        }
        if (info.isNative === true) {
          //调用本地客户单保存，不需要进行登录
          saveToNative(info);
        } else {
          if (!info.title || !info.params) {
            return;
          }
          //登录成功后保存
          saveToServer(info);
        }
      });
      break;
    case 'checkLogin':
      port.onMessage.addListener(function(msg) {
        if (Wiz_Context.token !== null) {
          getTab(wizRequestPreview);
          port.postMessage(true);
        } else {
          port.postMessage(false);
        }
      });
      break;
    case 'initRequest':
      //页面初始化请求，需要返回是否已登录、是否可获取文章、是否可获取选择信息
      //TODO 返回是否可获取文章、是否可获取选择信息
      var hasNative = hasNativeClient(),
        info = {
          token: Wiz_Context.token,
          hasNative: hasNative
        };
      getTab(wizRequestPreview);
      port.postMessage(info);
      break;
    case 'logout':
      Wiz_Context.token = null;
      break;
  }
}

function portLogin(loginParam, port) {
  portLoginAjax(loginParam, port);
}


/**
 *获取当前页面的tab信息
 */
function getTab(callback, params) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    Wiz_Context.tab = tabs[0];
    callback(tabs[0], params);
  });
}

/**
 *请求剪辑页面回调函数
 */
function sendTabRequestCallbackByBrowserAction(option) {
  if (!option) {
    //当前页面无法剪辑
    chrome.extension.connect({
      'name': 'pagePreviewFailure'
    });
  }
}

function PFRequestPreview(tab, op) {
  if (!op) {
    //默认为文章
    op = 'article';
  }
  Wiz.Browser.sendRequest(tab.id, {
    name: 'preview',
    op: op
  }, sendTabRequestCallbackByBrowserAction);
}


function getOpenApiUrl() {
  if (!PF_Context.openAPIUrl || PF_Context.openAPIUrl.length < 1) {
    $.ajax({
      url: PF.Constant.Default.API_URL,
      type: 'GET',
      async: false,
      success: function(data) {
        PF_Context.openAPIUrl = data;
      },
      error: function(error) {
        console.log("getOpenApiUrl() error:" + error);
      }
    });
  }
  return PF_Context.openAPIUrl;
}

function portLoginAjax(loginParam, port, params, callback) {
  console.log('loginParam:' + loginParam + "\tport:" + port + "\tarams:" +
    params);
  var loginError = function(err) {
    try {
      if (err) {
        port.postMessage(err);
      }
    } catch (error) {
      console.log("portLoginAjax callError error:" + error);
    }
  };

  var loginSuccess = function(responseJSON) {
    try {
      if (responseJSON.code != 200) {
        if (port) {
          port.postMessage({
            code: responseJSON.code,
            cookieStr: responseJSON.cookie_str
          });
        }
        //cookie登录失败(更改密码)，清除cookie和localStorage
        PF.Cookie.removeCookies(PF.Constant.Default.COOKIE_URL, PF.Constant
          .Default.COOKIE_CERT);
        localStorage.clear();
        return;
      }

      PF_Context.token = responseJSON.token;
      PF_Context.kbGuid = responseJSON.kb_guid;
      PF_Context.myPFEmail = responseJSON.mypf_email;
      if (params) {
        //saveToServer(params);
      }
      if (port) {
        port.postMessage({
          code: responseJSON.code,
          cookieStr: responseJSON.cookie_str
        });
        if (callback) {
          callback(port);
        }
      }
    } catch (error) {
      console.log('portLoginAjax callSuccess Error: ' + error);
    }
  };
  //缓存username
  PF_Context.username = loginParam.username;
  var openapiUrl = getOpenApiUrl();
  console.log("getOpenApiUrl:" + openapiUrl);
  $.ajax({
    type: 'POST',
    url: openapiUrl + '/login',
    data: loginParam,
    success: loginSuccess,
    error: loginError
  });
}
chrome.extension.onConnect.addListener(onConnectListener);
