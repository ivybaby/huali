/**
 * 小程序配置文件
 */

// 此处主机域名是解决方案分配的域名

//var host = "http://183.129.224.70:8022" //测试地址
var host = "https://scm.energyman.cn";
var config = {

  // 下面的地址配合云端 Server 工作
  host,

  // 登录地址，用于建立会话
  loginUrl: `${host}/scm`,
  messageUrl: `${host}/scm`,
  areaUrl: `${host}/scm`,
  optionUrl: `${host}/scm`,
  registerUrl: `${host}/scm`,
  requestUrl: `${host}/scm`,
  upUrl: `${host}/scm`,
  datalistUrl:`${host}/scm`,
  searchUrl: `${host}/scm`,
  visitUrl: `${host}/scm`,
  sellerkeyUrl: `${host}/scm`

  // 测试的请求地址，用于测试会话
  //requestUrl: `https://${host}/testRequest`,

  // 用code换取openId
 /* openIdUrl: `https://${host}/openid`,

  // 测试的信道服务接口
  tunnelUrl: `https://${host}/tunnel`,

  // 生成支付订单的接口
  paymentUrl: `https://${host}/payment`,

  // 发送模板消息接口
  templateMessageUrl: `https://${host}/templateMessage`,

  // 上传文件接口
  uploadFileUrl: `https://${host}/upload`,

  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`*/
};

module.exports = config
