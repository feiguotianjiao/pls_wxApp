/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//manageAddress.js
var app = getApp()
var addressList = []
Page({
  data: {},
  delAddress: function (e) {
    app.toLoad()
    var addressId = wx.getStorageSync('addressId')
    var adId = e.currentTarget.dataset.adid
    var index = e.currentTarget.dataset.index
    var that = this
    var header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/address/del.htm',
      header: header,
      data:{
        adId: adId
      },
      success: function () {
        addressList.splice(index,1)
        that.setData({
          hisAddress_list: addressList
        })
        if (parseInt(addressId) == parseInt(adId)){
          wx.setStorageSync('addressId', '')
        }
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onLoad: function () {
    app.toLoad()
    var that = this
    var header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/member/address/list.htm',
      header: header,
      success: function (res) {
        addressList = res.data.data
        that.setData({
          hisAddress_list: addressList
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
