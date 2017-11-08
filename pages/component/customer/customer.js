// pages/component/customer/customer.js
const requestUrl = require('../../../config').requestUrl +'/customerList.action';/* 用户是否已存在 */

const optionUrl = require('../../../config').optionUrl +'/optionList.action';
const upUrl = require('../../../config').upUrl +'/newCustomer.action';

var arrayArr = [], 
arrayfiveArr=[],
attendArr=[];

const duration = 2000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    index: 0,
    indexfive:0,
    indexattend:0,
    isData: false,
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    customerName:'',
    isHide:true,
    custName:'',
    linkCust:'',
    custTel:'',
    must1:false,
    must2:false,
    must3:false,
    isLoading:false,
    list:'',
    custDegree:'提交',
    ismethod:'insert'
  },
  bindPickerChange: function (e) {
   /* console.log('picker发送选择改变，携带值为', e.detail.value)*/
    this.setData({
      index: e.detail.value
    })
  },
  bindChangeFive: function (e) {
    /* console.log('picker发送选择改变，携带值为', e.detail.value)*/
    this.setData({
      indexfive: e.detail.value
    })
  },
  bindChangeAttend: function (e) {
    /* console.log('picker发送选择改变，携带值为', e.detail.value)*/
    this.setData({
      indexattend: e.detail.value
    })
  },
  regSplit: function (keyWord,list){ /* 查找 */
    var len = list.length;
    var arr = [];
    var reg = new RegExp(keyWord);
    for (var i = 0; i < len; i++) {
      //如果字符串中不包含目标字符会返回-1
      if (list[i].match(reg)) {
        arr.push(list[i]);
      }
    }
    return arr;
  },
  bindCustInput:function(e){
    this.setData({
      linkCust: e.detail.value
    })
  },
  bindTelInput: function (e) {
    this.setData({
      custTel: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    /* 每次输入的时候 */
    var inputValue = e.detail.value.replace(/\s*/, "");
    
    /*  获取数据*/
    var self = this;
 
    self.setData({
      loading: true,
      custName: inputValue,
      isHide:false,
      ismethod:'insert'
    })
    if (inputValue.length>0){
      /* 发送请求 数据库是否有匹配客户名称 */
     // console.log(wx.getStorageSync('sellerkey'));
      console.log(wx.getStorageSync('sellerkey'));
      wx.request({
        url: requestUrl,
        method: 'POST',
        data: {
          sellerkey:wx.getStorageSync('sellerkey')
          //sellerkey:'UsyPq7SdOvA='
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (result) {
          /* wx.showToast({
             title: '请求成功',
             icon: 'success',
             mask: true,
             duration: duration
           })*/
          console.log(result);
          var oName = result.data.dataCustomerList.customerList;
          var originData=new Array();
          for (var i in oName) {
          
            originData[i] = oName[i].name;
            
            var arr = self.regSplit(inputValue, originData);
            self.setData({
              list: arr
            });
            //console.log(arr);
          
          
          if (arr.length > 0) {
             // console.log(arr.length);
              self.setData({
                isData: true
              });
            }
          }
          
          self.setData({
            isLoading: false
          })
          
          
        },

        fail: function ({ errMsg }) {
          console.log('request fail', errMsg)
          self.setData({
            isLoading: false
          })
        }
      });
     
     
  
    }
  
    console.log('bindKeyInput   ');
  },
  /* 点击下拉框 */
  bindChangeName: function (e) {
    var self = this;

    var inVal = e.currentTarget.dataset.id;

    self.setData({
      custName: inVal,
      list: '',
      custDegree: '提交',
      ismethod: 'insert',
      index: 0,
      indexfive: 0,
      indexattend: 0,
      linkCust: '',
      custTel: '',
      customerName:''
    });

    var inputValue = self.data.custName;
    
    wx.request({
      url: requestUrl,/* 用户已存在.josn */
      method: 'POST',
      data: {
        sellerkey:wx.getStorageSync('sellerkey')
        //sellerkey: 'UsyPq7SdOvA='
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (result) {
        var i = 0;
        var oName = result.data.dataCustomerList.customerList;
        for (i in oName) {

          if (oName[i].name === inputValue) {

            if (oName.length > 0) {
              self.setData({
                custName: inputValue,
                index: parseInt(oName[i].type)-1,
                indexfive: parseInt(oName[i].gain)-1,
                indexattend: parseInt(oName[i].intent)-1,
                linkCust: oName[i].linkman,
                custTel: oName[i].phone,
                custDegree: '编辑',
                ismethod: 'update',
                customerName: oName[i].customerid
              });
            } else {
              self.setData({
                index: 0,
                indexfive: 0,
                indexattend: 0,
                linkCust: '',
                custTel: ''
              });
            }
            return;
          }
        }
        /**如果下拉框内数据对应没有数据  */
        if ((i + 1) != oName.length) {
          self.setData({
            index: 0,
            indexfive: 0,
            indexattend: 0,
            linkCust: '',
            custTel: ''
          });
        }

        self.setData({
          isLoading: false

        })
        console.log("bindChangeName");

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          isLoading: false
        })
      }
    });



  },
  /* 下拉框失去焦点  */
  bindOut:function(e){
   var self = this;
  
   var inputValue = e.detail.value.replace(/\s*/, "");
     self.setData({
       isHide: true,
       custName: inputValue,
       custDegree: '提交',
       ismethod: 'insert',
       index: 0,
       indexfive: 0,
       indexattend: 0,
       linkCust: '',
       custTel: '',
       customerName:''
     });
    wx.request({
      url: requestUrl,
       method: 'POST',
       data: {
         sellerkey:wx.getStorageSync('sellerkey')
         //sellerkey: 'UsyPq7SdOvA='
       },
       header: { 'content-type': 'application/x-www-form-urlencoded' },
       success: function (result) {
         var i = 0;
         var oName = result.data.dataCustomerList.customerList;
         for (i in oName) {

           if (oName[i].name === inputValue) {
            
             if (oName.length > 0) {  
               self.setData({
                 custName: inputValue,
                 index: parseInt(oName[i].type)-1,
                 indexfive: parseInt(oName[i].gain)-1,
                 indexattend: parseInt(oName[i].intent)-1,
                 linkCust: oName[i].linkman,
                 custTel: oName[i].phone,
                 custDegree: '编辑',
                 ismethod:'update',
                 customerName: oName[i].customerid
               });

             } 
             break;
           }
         }
         /**如果对应没有数据 */
         if (((i + 1) == oName.length) && (self.data.custDegree=='提交')) {
           self.setData({
             index: 0,
             indexfive: 0,
             indexattend: 0,
             linkCust: '',
             custTel: ''
           });
         }
         self.up
         self.setData({
           isLoading: false
         })

       },
       fail: function ({ errMsg }) {
         console.log('request fail', errMsg)
         self.setData({
           isLoading: false
         })
       }
     });
     console.log('bindOut  ');
   
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    /* 设置标题 */
    wx.setNavigationBarTitle({
      title: '客户信息登记',
      success: function () {
        console.log('setNavigationBarTitle success')
      },
      fail: function (err) {
        console.log('setNavigationBarTitle fail, err is', err)
      }
    });

    wx.request({
      url: optionUrl,/* array.josn */
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (result) {
       
        var oList = result.data.dataOptionList;
        var i = 0;
       
        for (var j in oList.typeList){
            arrayArr[j] = oList.typeList[j]['name'];
        }
       
        for (var j in oList.gainList) {
            arrayfiveArr[j] = oList.gainList[j]['name'];
        }
         
        for (var j in oList.intentList) {
            attendArr[j] = oList.intentList[j]['name'];
        }
        self.setData({
            array: arrayArr,
            arrayfive: arrayfiveArr,
            attend: attendArr
        });

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          isLoading: false
        })
      }
    });




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
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
 * 提交表单
 */
  regTrue:function(textVal,isText,targtVal,modalMessage,status){

    if (textVal.length === 0 || textVal == ' ') {
      this.setData({
        targtVal: textVal,
        'dialog.hidden': false,
        'dialog.title': modalMessage + '不能为空',
        'dialog.content': ''
      });
      this.setData({
        isLoading: false
      });
    } else {
     if(isText){
     /*if (/^[a-zA-Z 0-9]{1,40}$/.test(textVal) || /^[\u4e00-\u9fa5]{1,10}$/.test(textVal)) {*/
         this.setData({
           targtVal: textVal,
           isLoading: false
         });
         if (status) {
           this.must2 = true;
         } else {
           this.must1 = true;
         }
        
     /* } else {
         this.setData({
           targtVal: textVal,
           'dialog.hidden': false,
           'dialog.title': modalMessage + '格式错误',
           'dialog.content': ''
         });
        
         this.must2 = false;
         this.must1 = false;
      }*/
     }else{
      /* if (/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$/.test(textVal)) {
       */
       if (textVal.length === 0 || textVal == ' '){ 

         this.setData({
           targtVal: textVal,
           'dialog.hidden': false,
           'dialog.title': modalMessage + '格式错误',
           'dialog.content': ''
         });
         this.setData({
           isLoading: false
         });
         this.must3 = false;
          
       } else {
         this.setData({
           targtVal: textVal
         });
         this.must3 = true;
       }
     }
     
    }
  },
  formSubmit: function (e) {
    var that=this;
    that.setData({
      isLoading: true
    });
   
 
    var oName = e.detail.value.name.replace(/\s*/, ""); /*客户名称*/ 
    var oContact = e.detail.value.customerContact.replace(/\s*/, "");/* 客户联系人 */
    var oTelephone = e.detail.value.telephone.replace(/\s/, "");/* 联系电话 */
    
    that.regTrue(oName, true, that.custName,"客户名称");
    
    if (that.must1){
      that.regTrue(oContact, true, that.linkCust, "客户联系人",true);
      if (that.must2){
        that.regTrue(oTelephone, false, that.custTel, "联系电话");
      }
    }
    var x1 =parseInt(that.data.index)+1;
    var x2 = parseInt(that.data.indexfive)+1;
    var x3 = parseInt(that.data.indexattend)+1;

    if (that.must1 && that.must2 && that.must3){
      if(that.data.ismethod=='update'){
        wx.request({  //编辑 
          url: upUrl,
          method: 'POST',
          data: {
            method: that.data.ismethod,
            name: that.data.custName,
            customerid: that.data.customerName,
            type: x1,
            gain: x2,
            intent: x3,
            linkman: that.data.linkCust,
            phone: that.data.custTel,
            sellerkey: wx.getStorageSync('sellerkey')
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {

            console.log(that.data.ismethod + ' ' + that.data.custName + ' ' + x1 + ' ' + x2 + ' ' + x3 + ' ' + that.data.linkCust + ' ' + that.data.custTel + ' ' + wx.getStorageSync('sellerkey'));
            console.log(res);
            if (res.data.success) {
              that.setData({
                isLoading: true
              });
              wx.showToast({
                title: '更新成功',
                icon: 'success',
                duration: duration
              });
              setTimeout(function () {
                that.setData({
                  custName: '',
                  index: 0,
                  indexfive: 0,
                  indexattend: 0,
                  linkCust: '',
                  custTel: '',
                  custDegree: '提交',
                  isLoading: false
                });
              }, duration);
            } else {
              wx.showToast({
                title: '更新失败',
                icon: 'fail',
                duration: duration
              });
              that.setData({
                isLoading: false
              });

            }



          },
          fail: function ({ errMsg }) {
            // console.log('submit form fail, errMsg is:', errMsg);
            that.setData({
              isCodeTrue: errMsg,
              isLoading: false
            })
          }
        }) 
      }else{
        wx.request({  //提交 
          url: upUrl,
          method: 'POST',
          data: {
            method: that.data.ismethod,
            name: that.data.custName,
            type: x1,
            gain: x2,
            intent: x3,
            linkman: that.data.linkCust,
            phone: that.data.custTel,
            sellerkey: wx.getStorageSync('sellerkey')
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {

          /*  console.log(that.data.ismethod + ' ' + that.data.custName + ' ' + x1 + ' ' + x2 + ' ' + x3 + ' ' + that.data.linkCust + ' ' + that.data.custTel + ' ' + wx.getStorageSync('sellerkey'));*/
            console.log(res);
            if (res.data.success) {
              that.setData({
                isLoading: true
              });
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: duration
              });
              setTimeout(function () {
                that.setData({
                  custName: '',
                  index: 0,
                  indexfive: 0,
                  indexattend: 0,
                  linkCust: '',
                  custTel: '',
                  custDegree: '提交',
                  isLoading: false
                });
              }, duration);
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'fail',
                duration: duration
              });
              that.setData({
                isLoading: false
              });

            }



          },
          fail: function ({ errMsg }) {
            // console.log('submit form fail, errMsg is:', errMsg);
            that.setData({
              isCodeTrue: errMsg,
              isLoading: false
            })
          }
        }) 
      }
      
     
      
    }
    
    
  }
})