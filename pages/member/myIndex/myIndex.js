/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//myIndex.js
//获取应用实例
var app = getApp()
var header
Page({
  data: {
    userInfo: {},
    isLoad: false,
    myBalance: '0.00'
  },
  onShow: function (e) {
    app.toLoad()
    header = wx.getStorageSync('header')
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/member/me.htm',
      header: header,
      success: function (res) {
        var userData = res.data.data
        var mobile = userData.mobile
        var myBalance = parseFloat(userData.myBalance).toFixed(2)
        //更新数据
        that.setData({
          myBalance: myBalance
        })
        wx.hideLoading()
      }
    })
  },
  onLoad: function () {
    new app.WeToast()
    var that = this
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  //点击进行拨打电话
  showTel: function () {
    wx.showActionSheet({
      itemList: ['拨打：400-6666-520', '拨打：0538-5629999'],
      itemColor: "#382070",
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: '400-6666-520' 
          })
        }
        if (res.tapIndex == 1) {
          wx.makePhoneCall({
            phoneNumber: '0538-5629999' 
          })
        }
      }
    })
  },
  //点击进行友情提示
  toTip: function () {
    this.wetoast.toast({
      title: '该功能暂未开放',
      duration: 2000
    })
  },
})
