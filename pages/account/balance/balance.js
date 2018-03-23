/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//balance.js
//获取应用实例
let app = getApp();
let header;
Page({
  data: {},
  onShow: function () {
    app.toLoad()
    header = wx.getStorageSync('header')
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/account/init.htm',
      header: header,
      success: function (res) {
        var userData = res.data
        var myBalance = parseFloat(userData.balanceAmount).toFixed(2)
        var withdrawAmount = parseFloat(userData.withdrawAmount).toFixed(2)
        //更新数据
        that.setData({
          myBalance: myBalance,
          withdrawAmount: withdrawAmount
        })
        wx.hideLoading()
      }
    })
  }
})
