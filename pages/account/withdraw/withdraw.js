/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//withdraw.js
//获取应用实例
let app = getApp()
let header, balance, withdrawNum
let isTo = false
Page({
  data: {},
  checkNum: function (e) {
    withdrawNum = parseFloat(e.detail.value)
    if (withdrawNum < 0 || isNaN(withdrawNum) || withdrawNum > balance || withdrawNum == 0){
      this.wetoast.toast({
        title: '请输入大于0，小于或等于' + balance+'的数字',
        duration: 2000
      })
      isTo = false
    } else {
      isTo = true
    }
  },
  toWithdraw: function () {
    var that = this
    if(!isTo){
      that.wetoast.toast({
        title: '请输入大于0，小于或等于' + balance + '的数字',
        duration: 2000
      })
      return
    }
    wx.showModal({
      title: '提现提示',
      content: '您将提现的金额为：' + withdrawNum + '元，您是否确认提现？',
      confirmText: '确认提现',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/account/withdrawup.htm',
            data:{
              amountStr: '1'
            },
            header: header,
            success: function (res) {
              var errorInfo = res.data.errorInfo
              if (errorInfo){
                that.wetoast.toast({
                  title: errorInfo,
                  duration: 2000
                })
              }else{
                wx.redirectTo({
                  url: '/pages/account/withdrawSuccess/withdrawSuccess'
                })
              }
            },
            fail:function(){
              wx.showModal({
                title: '提现提示',
                content: '数据提交失败，请重新提交！！'
              })
            }
          })
        }
      }
    })
  },
  onLoad: function (opt) {
    new app.WeToast()
    balance = parseFloat(opt.balance)
    header = wx.getStorageSync('header')
  }
})
