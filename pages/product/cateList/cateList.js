/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//index.js
//获取应用实例
var app = getApp();
var isLoad = false
Page({
  data: {},
  select_cate: function (e) {
    var selCate = e.currentTarget.dataset.cate
    var typeList = e.currentTarget.dataset.type
    wx.setStorageSync('type_list', typeList)
    this.setData({
      selCate: selCate,
      type_list: typeList,
      topNum: 0
    })
  },
  toSearch: function (e) {
    wx.navigateTo({
      url: '/pages/product/search/search',
    })
  },
  onShow: function (e) {
    if (isLoad) {
      wx.hideLoading()
    }
  },
  onLoad: function () {
    var that = this;
    var lat = wx.getStorageSync('lat')
    var lon = wx.getStorageSync('lon')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/index/category-types.htm',
      data: {
        lat: lat,
        lon: lon
      },
      success: function (res) {
        var cateData = res.data.data
        var cateList = cateData.cateList
        var selCate = cateList[0].cateId
        var type_list = cateList[0].cateList
        wx.setStorageSync('type_list', type_list)
        that.setData({
          cateList: cateList,
          selCate: selCate,
          type_list: type_list
        })
        isLoad = true
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
