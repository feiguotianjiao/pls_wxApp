/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//shopCart.js
//获取应用实例
var app = getApp();
var sysDpr = app.getSysDpr();
var wHeight;
var itemCount = 7;
var common = require('common.js');
Page({
  data: {
    cartTip_top: '',
    cartContent_top: '',
    cartItems_style: '',
    cartMes_left: '',
    mask_style: '',
    isShow:false
  },
  showSwich: function (e) {
    var that = this
    var isShow = e.currentTarget.dataset.isshow
    common.changePos(that, isShow, itemCount, wHeight)
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: function (res) {
        wHeight = res.windowHeight * sysDpr;
      }
    })
  }
})