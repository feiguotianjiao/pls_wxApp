/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//subject.js
//获取应用实例
var app = getApp();
var sysDpr = app.getSysDpr();
var isTopset = false
var floorList = []
var loadTxt = true
var isLoaded = false
var isSet_bottom_tipStyle = false
var subjectId, indexfloorNo
Page({
  data: {
    toTop_style: 'display:none',
    isLoad: false
  },
  //页面滑动时返回顶端按钮出现
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr;
    if (toTop > 900) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < 900) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onReachBottom: function (e) {
    var that = this
    if (loadTxt) {
      loadTxt = false
      this.setData({
        bottom_tipStyle: 'transition:height 1s;height:120rpx;'
      })
      setTimeout(function () {
        that.setData({
          bottom_tipStyle: 'transition:height 1s;height:0px;'
        })
        loadTxt = true
      }, 1000)
    }
    if (!isSet_bottom_tipStyle) {
      isSet_bottom_tipStyle = false
      if (isLoaded) {
        wx.showLoading({
          title: '已经加载完毕',
          mask: false
        })
        setTimeout(function () {
          wx.hideLoading()
          isSet_bottom_tipStyle = false
        }, 1000)
      } else {
        indexfloorNo = indexfloorNo + 1
        wx.showLoading({
          title: '数据加载中',
          mask: false
        })
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/subject/floors.htm',
          data: {
            subjectId: subjectId,
            indexfloorNo: indexfloorNo
          },
          success: function (res) {
            var useData = res.data.data
            var floors = useData.floors
            if (floors.length > 0) {
              floorList = floorList.concat(floors)
              that.setData({
                floorList: floorList
              })
            } else {
              isLoaded = true
            }
            wx.hideLoading()
            isSet_bottom_tipStyle = false
          }
        })
      }
    }
  },
  addCart: function (event) {
    var pdId = parseInt(event.currentTarget.dataset.pdid)
    var shopId = parseInt(event.currentTarget.dataset.shopid)
    var that = this
    app.addCartData(that, shopId, pdId)
  },
  onShow: function () {
    var that = this
    var isLoad = this.data.isLoad
    if (isLoad){
      wx.hideLoading()
    }
    app.getCartCount(that)
  },
  onLoad: function (opt) {
    isTopset = false
    isSet_bottom_tipStyle = false
    indexfloorNo = 0
    isLoaded = false
    subjectId = opt.subjectId
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/subject/floors.htm',
      data: {
        subjectId: subjectId,
        indexfloorNo: indexfloorNo
      },
      success: function (res) {
        var useData = res.data.data
        floorList = useData.floors
        var subject = useData.subject
        var bgColor = subject.bgColor
        var imageUrl = subject.imageUrl
        var describe_txt = subject.info
        var subjectName = subject.subjectName
        wx.setNavigationBarTitle({
          title: subjectName
        })
        that.setData({
          bgColor: bgColor,
          imageUrl: imageUrl,
          floorList: floorList,
          describe_txt: describe_txt,
          isLoad: true
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
