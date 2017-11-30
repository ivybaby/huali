
var util = require('../../../utils/util.js'); 
const loginUrl = require('../../../config').loginUrl +'/sendSMS.action';

const arrayUrl = require('../../../config').areaUrl +'/areaEntList.action';/* 分公司 */
const messageUrl = require('../../../config').messageUrl +'/sendSMS.action';/* 发送手机号 */
const registerUrl = require('../../../config').registerUrl +'/register.action';/* 注册 */

var arrDis = new Array();
var arrCom = new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    data: '',
    code: '',
    index: 0,
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    jia:'',
    overdue:true,
    isNull:true,
    arrayCompany:[],
    indexCom:0,
    isLoading:false,
    verCode:'发送验证码',
    countdown:90,
    isCodeTrue:'',
    enindex:1,
    setKey:'sellerkey',
    setKeyVal:''
  },
  keyChange: function (e) {
    this.setData({
      key: e.detail.value.replace(/\s*/, "")
    })
  },
  dataChange: function (e) {/* 电话号码输入 */
    var self = this;
    self.setData({
      data: e.detail.value.replace(/\s/, "")
    })
    
    if (self.data.data.length == 11) {
     
      self.setData({
        isNull: false
      })
    }
  },
  codeChange:function(e) {/* 验证码输入 */
    this.setData({
      code: e.detail.value.replace(/\s/, "")
    })
  },
  bindDateChange: function (e) {
    this.setData({
      dateTime: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindPickerChange:function(e) {
  
   
    this.setData({
      index: e.detail.value,
      arrayCompany: arrCom[e.detail.value],
    
    });

  },
  bindComChange: function (e) {
    var x = parseInt(e.detail.value) + 1;
    this.setData({
      indexCom: e.detail.value,
      enindex: x
    })
  },
  settime:function(obj) {
    var self=this;
    var time = self.data.countdown;
    if (time == 0) {

      self.setData({
        verCode: "重新获取"
      })
      self.setData({
        countdown: 90,
        isNull: false,
        overdue:true
      });
      return;
    } else {
      self.setData({
        verCode: "发送" + time+"s"
      })
    
      self.setData({
        countdown: --time,
        isNull:true,
        overdue:false
      });
    
    }
    setTimeout(function () {
      self.settime(obj);
    }, 1000)
  },
  bindCode:function(e){/* 验证码点击事件 */
    var self=this;
    var tel = self.data.data.replace(/\s/, "");
    if(tel.length>0){
      //计时
      self.settime();
    }else{
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '电话为空',
        'dialog.content': ''
      })
    }
  
    wx.request({/* 验证码发送 */
      url: messageUrl,
      method: 'POST',
      data: {
        phone:self.data.data
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //console.log(res);
      },
      fail: function ({ errMsg }) {
        console.log(errMsg);
        self.setData({
          loading: false
        })
      }
    })


  },
  
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var self=this;
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    var finalTime = time.substring(0,time.indexOf(' ')).split('/').join('-');
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      dateTime: finalTime
    }); 
    
    wx.request({
      url: arrayUrl,/* 地区.josn */
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (result) {
       
        var i = 0;
        var j=0;
        var oArea = result.data.dataAreaEntList.areaEntList;
        
        if (oArea.length>0){
          arrCom.push(new Array());/* arrComde=[[],[]] */

          for (i in oArea) {
            arrDis[i] = oArea[i].name;
            var tmp = new Array();
            for (j in oArea[i].entList) {
              tmp[j] = oArea[i].entList[j].name;
            }
            arrCom[i] = tmp;
          }
         

          self.setData({
            array: arrDis,
            arrayCompany: arrCom[0],
            isLoading: false
          });
        }
       

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          isLoading: false
        })
      }
    });


    /* 设置标题 */
    wx.setNavigationBarTitle({
      title: '业务员注册',
      success: function () {
      },
      fail: function (err) {
      }
    });
    
    return false
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 提交表单
   */
  formSubmit: function (e) {
    var that=this;
    that.setData({
       isLoading:true,
       isCodeTrue:''
    });

   
    var key = that.data.key,
      data = that.data.data;
    var storageData;
    var isName=false,
        isTel=false,
        isCode=false;

    if ((key.length === 0) || (key == ' ')) {
     
      that.setData({
          key: key,
          data: data,
          'dialog.hidden': false,
          'dialog.title': '姓名不能为空',
          'dialog.content': '',
          isLoading: false
        });
       
        
    } else {

      if (/^[a-zA-Z ]{1,20}$/.test(key)||/^[\u4e00-\u9fa5]{1,10}$/.test(key)){
        that.setData({
          key: key
        });
        isName=true;
      
      }else{
        that.setData({
          key: key,
          'dialog.hidden': false,
          'dialog.title': '姓名格式错误',
          'dialog.content': '',
           isLoading: false
        });
       
      }
      
      if (isName){
        if ((data.length === 0) || (data == ' ')) {
          that.setData({
            key: key,
            data: data,
            'dialog.hidden': false,
            'dialog.title': '电话不能为空',
            'dialog.content': '',
            isLoading: false
          });
        }else{
          if (/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$/.test(data)){
          isTel = true;
         
         /* 验证码 */
          if (that.data.code.length === 0 || (that.data.code.length == ' ')) {
           
            that.setData({
              isCodeTrue: '验证码不能为空',
              isLoading: false
            });
            isCode = false;
          }else{
            if (that.data.code.length!=6){
              that.setData({
                isCodeTrue: '验证码格式错误',
                isLoading: false
              });
              isCode = false;
            }else{
              isCode = true;
            }
            
          }
         /* if (that.data.code===that.data.jia){
            if (that.data.overdue){
              console.log("111");
              that.setData({
                isCodeTrue:'验证码已过期',
                isLoading: false
              });
             }else{
                isCode=true;
             }
          }else{
            if (that.data.code>0){
              that.setData({
                isCodeTrue: '验证码错误',
                isLoading: false
              });
            }else{
              that.setData({
                isCodeTrue: '验证码不能为空',
                isLoading: false
              });
            }
           
          }*/
        }else{
            that.setData({
              data: data,
              'dialog.hidden': false,
              'dialog.title': '电话格式错误',
              'dialog.content': '',
              isLoading: false
            });
        }
        }
      }

      if (isName && isTel && isCode){
            //console.log("enid"+that.data.enindex);
            wx.request({/* 绑定 */
              url: registerUrl,
              method: 'POST',
              data: {
                name:that.data.key,
                phone: that.data.data,
                entid: that.data.enindex,
                code:that.data.code
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
               // console.log(res);
               if(res.data.success){//返回是成功的
           
                 that.setData({
                   setKeyVal: res.data.dataRegister.sellerkey,

                   isLoading: false
                 })
                 wx.setStorageSync(that.data.setKey, that.data.setKeyVal);/* 缓存 sellerkey */
                 //  console.log(wx.getStorageSync('sellerkey'));
                 wx.showToast({
                   title: '绑定成功',
                   icon: 'success',
                   duration: 1000
                 });
                 setTimeout(function () {
                   /* 链接地址 */
                   wx.navigateTo({ url: '../customer/customer?title=customer' });
                   that.setData({
                     isCodeTrue: '',
                     isLoading: false
                   });
                 }, 500)
               }else{
                 wx.showToast({
                   title: '绑定失败',
                   icon: 'fail',
                   duration: 1000
                 });
                 that.setData({
                   isLoading: false
                 });
               }
                
              },
              fail: function ({ message }) {
               // console.log('submit form fail, errMsg is:', message); 
                that.setData({
                  isCodeTrue: message,
                  isLoading: false
                })
              }
            })
       
       
      }
      /*
      storageData = wx.getStorageSync(key);
      if (storageData === "") {
        this.setData({
          key: key,
          data: data,
          'dialog.hidden': false,
          'dialog.title': '读取数据失败',
          'dialog.content': '找不到 姓名 对应的数据'
        })
      } else {
        this.setData({
          key: key,
          data: data,
          isLoading:true,
          'dialog.hidden': false,
          'dialog.title': '读取数据成功',
          'dialog.content': "data: '" + storageData + "'"
        });
        wx.navigateTo({ url: '../choice/choice?title=choice' });
      }*/
    }
  
  },
})