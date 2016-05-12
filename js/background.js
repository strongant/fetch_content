var PF_Context = {
  token: '', //token初始值不能设置为null，会造成xmlrpc无法解析，返回错误
  tab: null,
  user_id: null,
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

function portLoginAjax(loginParam, port, params, callback) {
  console.log('loginParam:' + loginParam + "\tport:" + port + "\tarams:" +
    params);
}
chrome.extension.onConnect.addListener(onConnectListener);
