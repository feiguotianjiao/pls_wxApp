/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//index.js
//获取应用实例
var app = getApp(); 
var sendDate = new Date()
var dataStr = (sendDate.getMinutes()).toString() + (sendDate.getSeconds()) + (sendDate.getMilliseconds())
Page({
  data: {
    motto: '',
    couponShow: 'display:none;',
    codeImg: 'http://pls.asj.com/MyImageServlet?date=' + dataStr
  },
  toAddCoupon: function (e) {
    sendDate = new Date()
    dataStr = (sendDate.getMinutes()).toString() + (sendDate.getSeconds()) + (sendDate.getMilliseconds())
    this.setData({
      couponShow: 'display:block;',
      codeImg: 'http://pls.asj.com/MyImageServlet?date=' + dataStr
    })
  },
  bindCoupon: function (e) {
    this.setData({
      couponShow: 'display:none;'
    })
  },
  cancelBindCounpon: function (e) {
    this.setData({
      couponShow: 'display:none;'
    })
  },
  changeCodeImg: function (e) {
    sendDate = new Date()
    dataStr = (sendDate.getMinutes()).toString() + (sendDate.getSeconds()) + (sendDate.getMilliseconds())
    this.setData({
      codeImg: 'http://pls.asj.com/MyImageServlet?date=' + dataStr
    })
  },
  onLoad: function () {
    console.log('onLoad');
  }
})
