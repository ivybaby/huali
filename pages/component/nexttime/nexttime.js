// pages/component/datalist/datalist.js
var sliderWidth = 82; // 需要设置slider的宽度，用于计算中间位置
const datalistUrl = require('../../../config').datalistUrl + '/customerList.action';
const searchUrl = require('../../../config').searchUrl + '/search.action'

// 当前页数  
var pageNum = 0;
var timeNum = 0;


Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    tabs: ["意向选择", "下次拜访时间"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],//意向选择
    timeItems: [],//拜访时间
    startX: 0, //开始坐标
    startY: 0,
    scrollTop: 0,
    scrollHeight: 0,
    ishidden: false, //隐藏,
    isSearch: true,
    isAll: false,
    maxSize: 10
  },
  splitArr: function (oName) {
    var that = this;
    for (var i in oName) {
      var oUp = oName[i].updatetime;
      var oNext = oName[i].nextvisit;

      var oUpdatetime, oNextvisit;
      if (oNext === null || (oNext.replace(/\s*/, "").length == 0)) {
        oNextvisit = '';
      } else {
        oNextvisit = oNext.substring(0, oNext.indexOf('T'));
      }
      if (oUp === null || (oUp.replace(/\s*/, "").length == 0)) {
        oUpdatetime = '';
      } else {
        oUpdatetime = oUp.substring(0, oUp.indexOf('T'));
      }
      that.data.list.push({
        "addtime": oName[i].addtime,
        "areaid": oName[i].areaid,
        "code": oName[i].code,
        "customerid": oName[i].customerid,
        "entid": oName[i].entid,
        "gain": oName[i].gain,
        "gainStr": oName[i].gainStr,
        "intent": oName[i].intent,
        "intentStr": oName[i].intentStr,
        "linkman": oName[i].linkman,
        "name": oName[i].name,
        "nextvisit": oName[i].nextvisit,
        "phone": oName[i].phone,
        "sellerid": oName[i].sellerid,
        "type": oName[i].type,
        "typeStr": oName[i].typeStr,
        "updatetime": oName[i].updatetime,
        "splitUpdatetime": oUpdatetime,
        "splitNextvisit": oNextvisit
      });

    }
    that.setData({
      list: that.data.list
    });
    pageNum++;

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    pageNum = 0;
    this.setData({
      list: [],
      isSearch: true
    })
    this.loadMsgData(this, datalistUrl, {
      //sellerkey: '+vo+cgvtgnw=',
      sellerkey: wx.getStorageSync('sellerkey'),
      num: pageNum,
      orderby: this.data.activeIndex
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    pageNum = 0;
    this.setData({
      list: [],
      isSearch: true
    })
    this.loadMsgData(this, datalistUrl, {
      //sellerkey: '+vo+cgvtgnw=',
      sellerkey: wx.getStorageSync('sellerkey'),
      num: pageNum,
      orderby: this.data.activeIndex
    });
  },
  inputTyping: function (e) {
    let that = this;
    that.setData({
      inputVal: e.detail.value
    });
    var oVal = that.data.inputVal;
    //wx.getStorageSync('sellerkey')
    if (oVal.length > 0) {
      that.onSearchUrl(searchUrl, { "text": oVal, "sellerkey": wx.getStorageSync('sellerkey') });
      that.setData({
        isSearch: false
      });

    } else {
      pageNum = 0;
      that.setData({
        list: []
      });
      that.setData({
        isSearch: false
      });
      that.loadMsgData(that, datalistUrl, {
        //sellerkey: '+vo+cgvtgnw=',
        sellerkey: wx.getStorageSync('sellerkey'),
        num: pageNum,
        orderby: that.data.activeIndex
      });

    }

  },
  catchNavi: function (e) {
    wx.navigateTo({
      url: '../../component/customer/customer?attend=0&tranData=' + JSON.stringify(this.data.list[e.currentTarget.dataset.index])
    })
  },
  onSearchUrl: function (url, oData) {//搜索出的数据
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      data: oData,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (result) {
        if (result.data.success) {

          var oName = result.data.dataSearch.customerList;

          if (oName.length > 0) {
            that.setData({
              list: [],
              ishidden: true
            })
            that.splitArr(oName);
            that.setData({
              isLoading: false
            })
          } else {
            that.setData({
              list: [],
              ishidden: false
            })
          }
        } else {
          that.setData({
            ishidden: false
          })
        }
      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        that.setData({
          isLoading: false,
          ishidden: true
        })
      }
    });
  },
  loadMsgData: function (that, url, oLoadData) {
    that.setData({
      isAll: false
    });
    wx.request({
      url: url,
      method: 'POST',
      data: oLoadData,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.success) {
          // console.log("loadMsgData"+' '+that.data.isAll);
          var oName = res.data.dataCustomerList.customerList;
          // console.log(oName);
          var oLen = oName.length;
          if (oLen > 0) {
            if (oLen < (that.data.maxSize)) {
              that.setData({
                isAll: true
              });
            }
            that.splitArr(oName);
            that.setData({
              ishidden: true
            });
          } else {
            that.setData({
              isAll: true
            });
            if (that.data.list.length > 0) {
              that.setData({
                ishidden: true
              });
            } else {
              that.setData({
                ishidden: false
              });
            }

          }
        }
      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg);
      },
      complete: function () {
        that.loading = false
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    /* 设置标题 */
    /*  wx.setNavigationBarTitle({
        title: '客户信息登记',
        success: function () {
        },
        fail: function (err) {
        }
      });*/

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          oHeight: res.windowHeight - 44
        });

      }
    });
    wx.showLoading({
      title: '加载中',
    });
    that.loadMsgData(that, datalistUrl, {
      // sellerkey: '+vo+cgvtgnw=',
      sellerkey: wx.getStorageSync('sellerkey'),
      num: pageNum,
      orderby: that.data.activeIndex
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)



  },
  loading: false,
  scroll: function (event) {
    var that = this;
    //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    that.setData({
      scrollTop: event.detail.scrollTop
    });

    /* if (event.detail.scrollTop === 0) {
       pageNum = 0;
       that.setData({
         list: [],
         isSearch: true
       });
       if (that.loading) {
         return
       }
       that.loading = true;
      
       that.loadMsgData(that, datalistUrl, {
         //sellerkey: '+vo+cgvtgnw=',
         sellerkey: wx.getStorageSync('sellerkey'),
         num: pageNum,
         orderby: that.data.activeIndex
          });
     
     }*/
  },
  lower: function () {//触底滚动时触发
    // console.log("lower");
    let that = this;
    if (this.loading) {
      // console.log("iSLOADING");
      return
    }
    that.loading = true;

    if (that.data.isAll) {
      wx.showToast({
        title: '已全部加载',
        icon: 'success',
        duration: 1000
      });
    } else {

      if (that.data.isSearch) {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function () {
          that.loadMsgData(that, datalistUrl, {
            //sellerkey: '+vo+cgvtgnw=',
            sellerkey: wx.getStorageSync('sellerkey'),
            num: pageNum,
            orderby: that.data.activeIndex
          });
          wx.hideLoading();
        }, 1000)
      }
    }
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
    /* 设置标题 */
    /* wx.setNavigationBarTitle({
       title: '客户信息登记',
       success: function () {
       },
       fail: function (err) {
       }
     });*/
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    let that = this;
    pageNum = 0;
    that.setData({
      list: []
    });
    that.loadMsgData(that, datalistUrl, {
      //sellerkey: '+vo+cgvtgnw=',
      sellerkey: wx.getStorageSync('sellerkey'),
      num: pageNum,
      orderby: that.data.activeIndex
    });
    setTimeout(() => {
      if (!(that.loading)) {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    }, 1000)
  },
  uper: function () {
    this.onPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  }
})
