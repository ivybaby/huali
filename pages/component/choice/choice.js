var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]

Page({
  data: {
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  openLocation: function (e) {
    console.log(e)
    var value = e.detail.value
    console.log(value)
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude),
      name: value.name,
      address: value.address
    })
  },
  onLoad: function (options) {
    /*console.log("onload");
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        that.setData({
          hasLocation: true,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
    
    if (wx.chooseAddress) {
      console.log("chooseAddress");
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          name:res.name,
          address:res.address
        })
      }
    })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }*/
  }
  
})
