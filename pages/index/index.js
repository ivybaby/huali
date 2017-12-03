//index.js
//获取应用实例
/*
const imgUrl = "../image/logo.png";
const requestUrl = require('../../config').requestUrl + '/customerList.action';

var app = getApp();
Page({
  onLoad: function () {
    var that=this;
    var isTrue = app.globalData.hasLogin;//默认
    if (isTrue){
       
                  this.setData({
                    hasLogin: true
                  })
            
                  if (wx.getStorageSync('sellerkey').length > 0 && (wx.getStorageSync('sellerkey')!='')){
                    
                    wx.navigateTo({
                      url: '../component/customer/customer'
                    });
                  }else{
                    wx.navigateTo({
                      url: '../component/bindTo/bindTo',
                    })
                  }
    }else{
      this.setData({
        hasLogin: false
      })
    }
   
  },
  data: { 
    companyInfo:imgUrl
    },
  login: function () {
    var that = this
    wx.login({
      success: function (res) {
        
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true
        })
        that.update();
        wx.navigateTo({
    
          url: '../component/bindTo/bindTo',
        });
      
      }
    })
  }
})*/

var util = require('../../utils/util.js');
const loginUrl = require('../../config').loginUrl + '/sendSMS.action';

const arrayUrl = require('../../config').areaUrl + '/areaEntList.action';/* 分公司 */
const messageUrl = require('../../config').messageUrl + '/sendSMS.action';/* 发送手机号 */
const registerUrl = require('../../config').registerUrl + '/register.action';/* 注册 */
const sellerkeyUrl = require('../../config').sellerkeyUrl + '/checkSeller.action';/* 验证selleykey */

var arrDis = new Array();
var arrCom = new Array();
var arrEnId = new Array();

var app = getApp();
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
    jia: '',
    overdue: true,
    isNull: true,
    arrayCompany: [],
    indexCom: 0,
    isLoading: false,
    verCode: '发送验证码',
    countdown: 90,
    isCodeTrue: '',
    setKey: 'sellerkey',
    setKeyVal: ''
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
  codeChange: function (e) {/* 验证码输入 */
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      arrayCompany: arrCom[e.detail.value]
    });

  },
  bindComChange: function (e) {

    var x = parseInt(e.detail.value);
    this.setData({
      indexCom: e.detail.value
    })
  },
  settime: function (obj) {
    var self = this;
    var time = self.data.countdown;
    if (time == 0) {

      self.setData({
        verCode: "重新获取"
      })
      self.setData({
        countdown: 90,
        isNull: false,
        overdue: true
      });
      return;
    } else {
      self.setData({
        verCode: "发送" + time + "s"
      })

      self.setData({
        countdown: --time,
        isNull: true,
        overdue: false
      });

    }
    setTimeout(function () {
      self.settime(obj);
    }, 1000)
  },
  bindCode: function (e) {/* 验证码点击事件 */
    var self = this;
    var tel = self.data.data.replace(/\s/, "");
    if (tel.length > 0) {
      //计时
      self.settime();
    } else {
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
        phone: self.data.data
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        //console.log(res);
        if(!res.data.success){
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.message,
            success: function (res) {
            }
          })
        }
      },
      fail: function ({ errMsg }) {
        console.log(errMsg);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务器错误',
          success: function (res) {
            if(res.confirm){
              self.setData({
                loading: false
              })
            }
          }
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
    const isExpire = options.isExpire
    /*
    *增加测试*/
   /*wx.navigateTo({
      url: '../component/addCustomer/addCustomer'
    })
    wx.switchTab({
      url: '../component/datalist/datalist',
    })*/
    var self = this;

    let skey = wx.getStorageSync('sellerkey');  //获取本地的sellerkey

    var isLogin = app.globalData.hasLogin;
    if ((wx.getStorageSync('sellerkey').length > 0) && (wx.getStorageSync('sellerkey') != '')) {
      /* wx.navigateTo({
         url: '../component/customer/customer',
       })*/
      wx.request({
        url: sellerkeyUrl,
        method: 'POST',
        data: {
          sellerkey: skey
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (result) {
          if (result.data.success) {
            if (isExpire!='1'){
              wx.switchTab({
                url: '../component/datalist/datalist',
              })
            }
          
          } else {
            console.log('request fail', result.data.message);
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: result.data.message,
              success: function (res) {

              }
            })
          }
        },
        fail: function ({ errMsg }) {
          console.log('request fail', errMsg);
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '服务器错误',
            success: function (res) {
            
            }
          })
        }
      });

    } else {
      // var isLogin=true;
      if (isLogin === false || typeof (isLogin) == 'undefined') {
        wx.login({
          success: _getUserInfo
        })

      }
    }
    function _getUserInfo() {
      wx.getUserInfo({
        success: function (res) {
          app.globalData.hasLogin = true;
          self.update()
        }
      })
    }
    

 

  
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    var finalTime = time.substring(0, time.indexOf(' ')).split('/').join('-');
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
        var j = 0;
        var oArea = result.data.dataAreaEntList.areaEntList;

        if (oArea.length > 0) {
          arrCom.push(new Array());/* arrComde=[[],[]] */
          arrEnId.push(new Array());

          for (i in oArea) {
            arrDis[i] = oArea[i].name;
            var tmp = new Array();
            var oEnId = new Array();
            for (j in oArea[i].entList) {
              tmp[j] = oArea[i].entList[j].name;
              oEnId[j] = oArea[i].entList[j].id;
            }
            arrCom[i] = tmp;
            arrEnId[i] = oEnId;
          }
         
          self.setData({
            array: arrDis,
            arrayCompany: arrCom[0],
            isLoading: false
          });
        }


      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务器错误',
          success: function (res) {
            if (res.confirm) {
              self.setData({
                isLoading: false
              })
            }
          }
        })
       
      }
    });


    /* 设置标题 */
    wx.setNavigationBarTitle({
      title: '业务员注册',
      success: function () {
        // console.log('setNavigationBarTitle success')
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '服务器错误',
          success: function (res) {
            
          }
        })
        
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
    var that = this;
    that.setData({
      isLoading: true,
      isCodeTrue: ''
    });


    var key = that.data.key,
      data = that.data.data;
    var storageData;
    var isName = false,
      isTel = false,
      isCode = false;

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

      if (/^[a-zA-Z ]{1,20}$/.test(key) || /^[\u4e00-\u9fa5]{1,10}$/.test(key)) {
        that.setData({
          key: key
        });
        isName = true;

      } else {
        that.setData({
          key: key,
          'dialog.hidden': false,
          'dialog.title': '姓名格式错误',
          'dialog.content': '',
          isLoading: false
        });

      }

      if (isName) {
        if ((data.length === 0) || (data == ' ')) {
          that.setData({
            key: key,
            data: data,
            'dialog.hidden': false,
            'dialog.title': '电话不能为空',
            'dialog.content': '',
            isLoading: false
          });
        } else {
          if (/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9])|(17[0-9]))\d{8}$/.test(data)) {
            isTel = true;

            /* 验证码 */
            if (that.data.code.length === 0 || (that.data.code.length == ' ')) {

              that.setData({
                isCodeTrue: '验证码不能为空',
                isLoading: false
              });
              isCode = false;
            } else {
              if (that.data.code.length != 6) {
                that.setData({
                  isCodeTrue: '验证码格式错误',
                  isLoading: false
                });
                isCode = false;
              } else {
                isCode = true;
              }

            }
          
          } else {
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

      if (isName && isTel && isCode) {
        
        wx.request({/* 绑定 */
          url: registerUrl,
          method: 'POST',
          data: {
            name: that.data.key,
            phone: that.data.data,
            entid: arrEnId[that.data.index][that.data.indexCom],
            code: that.data.code
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
           // console.log(arrEnId[that.data.index][that.data.indexCom]);
           
            if (res.data.success) {//返回是成功的

              that.setData({
                setKeyVal: res.data.dataRegister.sellerkey,
                isLoading: false
              })
              wx.setStorageSync(that.data.setKey, that.data.setKeyVal);/* 缓存 sellerkey */
           
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 1000
              });
              setTimeout(function () {
                /* 链接地址 */
                wx.switchTab({
                  url: '../component/datalist/datalist',
                })
               /* wx.navigateTo({ url: '../component/customer/customer?title=customer' });*/
                that.setData({
                  isCodeTrue: '',
                  isLoading: false
                });
              }, 500)
            } else {
              // wx.showToast({
              //   title: '绑定失败',
              //   duration: 1000
              // });
              wx.showModal({
                title: '提示',
                showCancel:false,
                content: res.data.message,
                success: function (res) {
                  if (res.confirm) {
                    that.setData({
                      isLoading: false
                    });
                   } //else if (res.cancel) {

                  //  }
                }
              })
              
            }

          },
          fail: function ({ message }) {
            // console.log('submit form fail, errMsg is:', message); 
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '服务器错误',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    isCodeTrue: message,
                    isLoading: false
                  })
                }
              }
            })
            
          }
        })


      }
     
    }

  },
})