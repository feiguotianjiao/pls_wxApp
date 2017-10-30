/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//index.js
//获取应用实例
var app = getApp();
Page({
  data: {},
  //点击进行拨打电话
  showTel: function () {
    wx.showActionSheet({
      itemList: ['拨打：400-6666-520', '拨打：0538-5629999'],
      itemColor: "#382070",
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: '400-6666-520' //仅为示例，并非真实的电话号码
          })
        }
        if (res.tapIndex == 1) {
          wx.makePhoneCall({
            phoneNumber: '0538-5629999' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  },
  onLoad: function (opt) {
    app.toLoad()
    var header = wx.getStorageSync('header')
    var that = this
    var orderList = wx.getStorageSync('orderList')
    var idt = opt.idt
    var ordersNo = opt.ordersNo
    header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/orders/detail.htm',
      header: header,
      data: {
        ordersNo: ordersNo
      },
      success: function (res) {
        var orderData = res.data.data
        that.setData({
          orderData: orderData
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
