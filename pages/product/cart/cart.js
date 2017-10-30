/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//cart.js
//获取应用实例
var app = getApp()
Page({
  data: {},
  toWriteOrder: function (event) {
    var shopId = event.currentTarget.dataset.shopid
    app.toWriteOrder(shopId)
  },
  onShow: function () {
    app.toLoad()
    var that = this
    var isSendList = []
    var noSendList = []
    var cartChange = wx.getStorageSync('cartChange')
    var cartList = [1, 2]
    that.setData({
      cartList: cartList,
      isSendList: isSendList,
      noSendList: noSendList
    })
    if (cartChange) {
      var header = wx.getStorageSync('header')
      var lat = wx.getStorageSync('lat')
      var lon = wx.getStorageSync('lon')
      var cartJson = app.getCartJson()
      if (cartJson) {
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/latlng/cart/info-new.htm',
          data: {
            lat: lat,
            lon: lon,
            cartJson: cartJson,
            isOnlyShowSend: false
          },
          header: header,
          success: function (res) {
            cartList = res.data.data.cartList
            for (var i in cartList) {
              var shopCartObj = cartList[i]
              var pdList = shopCartObj.pdlist
              var totalNum = 0
              for (var j in pdList) {
                totalNum += parseInt(pdList[j].num)
              }
              shopCartObj.totalNum = totalNum
              if (shopCartObj.canSend) {
                isSendList.push(shopCartObj)
              } else {
                noSendList.push(shopCartObj)
              }
              cartList[i] = shopCartObj
            }
            that.setData({
              cartList: cartList,
              isSendList: isSendList,
              noSendList: noSendList
            })
            wx.hideLoading()
            wx.setStorageSync('cartList', cartList)
            wx.setStorageSync('cartChange', false)
          }
        })
      } else {
        cartList = []
        that.setData({
          cartList: cartList
        })
        wx.hideLoading()
        wx.setStorageSync('cartList', cartList)
        wx.setStorageSync('cartChange', false)
      }
    } else {
      cartList = wx.getStorageSync('cartList')
      if (!cartList) cartList = []
      if (cartList.length < 1) {
        cartList = []
        that.setData({
          cartList: cartList
        })
      } else {
        for (var i in cartList) {
          var shopCartObj = cartList[i]
          var pdList = shopCartObj.pdlist
          var totalNum = 0
          for (var j in pdList) {
            totalNum += parseInt(pdList[j].num)
          }
          shopCartObj.totalNum = totalNum
          if (shopCartObj.canSend) {
            isSendList.push(shopCartObj)
          } else {
            noSendList.push(shopCartObj)
          }
          cartList[i] = shopCartObj
        }
        that.setData({
          cartList: cartList,
          isSendList: isSendList,
          noSendList: noSendList
        })
      }
      wx.hideLoading()
      wx.setStorageSync('cartList', cartList)
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
