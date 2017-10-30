/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//orderList.js
//获取应用实例
var app = getApp()
var sysDpr = app.getSysDpr()
var isTopset = false
var orderList = []
var pageNo = 1
var loadTxt = true
var isSet_bottom_tipStyle = false
var isLoad = false
var header, totalPage
Page({
  data: {
    toTop_style: 'display:none'
  },
  //页面滑动时返回顶端按钮出现
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
          url: 'https://safe.asj.com/pls/appapi/orders/mlist.htm',
          data: {
            pageNo: pageNo
          },
          header: header,
          success: function (res) {
            var userData = res.data.data
            orderList = orderList.concat(userData.orderList)
            wx.setStorageSync('orderList', orderList)
            that.setData({
              orderList: orderList
            })
            wx.hideLoading()
            isSet_bottom_tipStyle = false
          }
        })
      }
    }
  },
  onShow: function () {
    orderList = wx.getStorageSync('orderList')
    if (orderList && isLoad) {
      this.setData({
        orderList: orderList
      })
      wx.hideLoading()
    }else{
      this.onLoad()
    }
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
  toPay: function (e) {
    var that = this
    var idt = parseInt(e.currentTarget.dataset.idt)
    var ordersNo = e.currentTarget.dataset.order
    wx.showActionSheet({
      itemList: ['在线支付', '货到付款'],
      itemColor: "#382070",
      success: function (res) {
        app.toLoad()
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/orders/orderPay/orderPay?ordersNo=' + ordersNo + '&idt=' + idt,
          })
        }
        if (res.tapIndex == 1) {
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/payment/pay.htm',
            header: header,
            data: {
              ordersNo: ordersNo,
              payInterface: 3
            },
            success: function (res) {
              wx.navigateTo({
                url: '/pages/orders/success/success?ordersNo=' + ordersNo,
              })
              orderList[idt].ordersStatus = 2
              wx.setStorageSync('orderList', orderList)
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  toCancel: function (e) {
    var that = this
    var idt = parseInt(e.currentTarget.dataset.idt)
    var ordersNo = e.currentTarget.dataset.order
    wx.showModal({
      title: '取消订单',
      content: '取消订单后，您将无法操作此订单，若有需要您可重新下单……',
      confirmText: '取消订单',
      cancelText: '放弃取消',
      success: function (res) {
        if (res.confirm) {
          app.toLoad()
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/orders/cancel.htm',
            data: {
              ordersNo: ordersNo
            },
            header: header,
            success: function () {
              orderList[idt].ordersStatus = 7
              that.setData({
                orderList: orderList
              })
              wx.setStorageSync('orderList', orderList)
              wx.hideLoading()
            }
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 10000)
        }
      }
    })
  },
  toConfirm: function (e) {
    var that = this
    var idt = parseInt(e.currentTarget.dataset.idt)
    var ordersNo = e.currentTarget.dataset.order
    wx.showModal({
      title: '确认收货',
      content: '确认收货后，有任何问题，欢迎联系客服，我们将竭诚为您服务！',
      confirmText: '确认收货',
      cancelText: '放弃确认',
      success: function (res) {
        if (res.confirm) {
          app.toLoad()
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/orders/sure.htm',
            data: {
              ordersNo: ordersNo
            },
            header: header,
            success: function () {
              orderList[idt].ordersStatus = 8
              that.setData({
                orderList: orderList
              })
              wx.setStorageSync('orderList', orderList)
              wx.hideLoading()
            }
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 10000)
        }
      }
    })
  },
  toDel: function (e) {
    var that = this
    var idt = parseInt(e.currentTarget.dataset.idt)
    var ordersNo = e.currentTarget.dataset.order
    wx.showModal({
      title: '删除订单',
      content: '删除订单后，您将无法再查看该订单的任何信息，如需帮助请联系客服~',
      confirmText: '确认删除',
      cancelText: '放弃删除',
      success: function (res) {
        if (res.confirm) {
          app.toLoad()
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/orders/showapp.htm',
            data: {
              ordersNo: ordersNo
            },
            header: header,
            success: function () {
              var tempPage = pageNo + 1
              if (tempPage < totalPage || tempPage == totalPage) {
                wx.request({
                  url: 'https://safe.asj.com/pls/appapi/orders/mlist.htm',
                  data: {
                    pageNo: pageNo
                  },
                  header: header,
                  success: function (res) {
                    var userData = res.data.data
                    totalPage = userData.totalPage
                    var tempOrderList = userData.orderList
                    var theIndex = tempOrderList.length - 1
                    var addObj = tempOrderList[theIndex]
                    orderList.splice(idt, 1)
                    if (addObj){
                      orderList.push(addObj)
                    }
                    wx.setStorageSync('orderList', orderList)
                    that.setData({
                      orderList: orderList
                    })
                    wx.hideLoading()
                  }
                })
              }
            }
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 10000)
        }
      }
    })
  },
  onLoad: function () {
    app.toLoad()
    var that = this
    pageNo = 1
    header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/orders/mlist.htm',
      data: {
        pageNo: pageNo
      },
      header: header,
      success: function (res) {
        var userData = res.data.data
        orderList = userData.orderList
        totalPage = userData.totalPage
        that.setData({
          orderList: orderList
        })
        wx.setStorageSync('orderList', orderList)
        isLoad = true
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
