// window.onload = function() {
//   function getChromeVersion() {
//     var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
//
//     return raw ? parseInt(raw[2], 10) : false;
//   }
//
// }
$(document).ready(function() {
  $("#loginForm").bootstrapValidator({
    message: chrome.i18n.getMessage('error_message'),
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        message: chrome.i18n.getMessage('not_valid_username'),
        validators: {
          notEmpty: {
            message: chrome.i18n.getMessage('null_username')
          },
          stringLength: {
            min: 2,
            max: 30,
            message: chrome.i18n.getMessage('username_length')
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_]+$/,
            message: chrome.i18n.getMessage('username_regexp')
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: chrome.i18n.getMessage('null_password')
          },

          stringLength: {
            min: 1,
            max: 30,
            message: chrome.i18n.getMessage('password_length')
          }
        }
      }
    }
  });

  $('#username').attr("placeholder", chrome.i18n.getMessage('user_id_tip'));
  $('#username').focus();
  $('#password').attr("placeholder", chrome.i18n.getMessage('password_tip'));
  $('#keep_password_tip').html(chrome.i18n.getMessage('keep_password_tip'));
  $('#login_button').html(chrome.i18n.getMessage('login_msg'));
  $('#create_acount').html(chrome.i18n.getMessage('create_account_link')).bind(
    'click',
    function(evt) {
      window.open(PF.Constant.Default.REGISTER_URL);
    });
  $('.header_logo').on('click', function(evt) {
    window.open(PF.Constant.Default.WEBCLIENT_URL);
  });

  var loginCtrl = new LoginController();
});
