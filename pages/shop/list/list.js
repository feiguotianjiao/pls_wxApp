/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//list.js
//获取应用实例
var app = getApp()
var sysDpr = app.getSysDpr()
var isTopset = false
var shopList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var isLoad = false
var totalPage, lat, lon, shopCateId
Page({
  data: {
    toTop_style: 'display:none'
  },
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
  onReachBottom: function () {
    var that = this
    if (loadTxt) {
      loadTxt = false
      that.setData({
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
      isSet_bottom_tipStyle = true
      pageNo = pageNo + 1
      if (pageNo > totalPage) {
        wx.showLoading({
          title: '已经加载完毕',
          mask: false
        })
        setTimeout(function () {
          wx.hideLoading()
          isSet_bottom_tipStyle = false
        }, 1000)
      } else {
        app.toLoad()
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/latlon/shop/categorys_page.htm',
          data: {
            lat: lat,
            lon: lon,
            shopCateId: shopCateId,
            pageNo: pageNo
          },
          success: function (res) {
            var shopData = res.data.data
            shopList = shopList.concat(shopData.shopList)
            that.setData({
              shopList: shopList
            })
            isSet_bottom_tipStyle = false
            wx.hideLoading()
          }
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 10000)
      }
    }
  },
  onShow: function () {
    if (isLoad) {
      wx.hideLoading()
    }
  },
  onLoad: function (opt) {
    var that = this
    shopCateId = opt.shopCateId
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    app.toLoad()
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/shop/categorys_page.htm',
      data: {
        lat: lat,
        lon: lon,
        shopCateId: shopCateId,
        pageNo: pageNo
      },
      success: function (res) {
        var shopData = res.data.data
        shopList = shopData.shopList
        totalPage = shopData.totalPage
        that.setData({
          shopList: shopList
        })
        wx.hideLoading()
        isLoad = true
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onHide: function () {
    app.toLoad()
  }
})
