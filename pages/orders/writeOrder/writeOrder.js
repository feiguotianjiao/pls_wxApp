/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//writeOrder.js
//获取应用实例
var app = getApp();
var sendDate = new Date()
var days = ['日', '一', '二', '三', '四', '五', '六']
var timesArr = ['00:00--01:00', '01:00--02:00', '02:00--03:00', '03:00--04:00', '04:00--05:00', '05:00--06:00', '06:00--07:00', '07:00--08:00', '08:00--09:00', '09:00--10:00', '10:00--11:00', '11:00--12:00', '12:00--13:00', '13:00--14:00', '14:00--15:00', '15:00--16:00', '16:00--17:00', '17:00--18:00', '18:00--19:00', '19:00--20:00', '20:00--21:00', '21:00--22:00', '22:00--23:00', '23:00--00:00']
var nowTimes = []
var times = []
var nowTime = sendDate.getHours()
var nowDay = sendDate.getDay()
var payType = 0
var isOpen = false
var dataStr, header, shopId, lat, lon, cartJson, addressId, totalPay, deliveryType, addressDetail, addressMobile, addressConsignee, cartList, addrName, couponNo, mIsLoad, cIsLoad
var notice = ''
Page({
  data: {
    payClass: ['', 'on', ''],
    days: days,
    value: [nowDay, 0],
    sendTimeClass: 'edit',
    pickerShow: 'display:none;',
    couponShow: 'display:none;'
  },
  changePay: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var isDown = this.data.payClass[0]
    var dataArr = this.data.payClass
    if (isDown == 'down') {
      for (var id in dataArr) {
        if (id == index) {
          dataArr[id] = 'isSel'
        } else {
          dataArr[id] = ''
        }
      }
    } else {
      for (var id in dataArr) {
        if (id == 0) {
          dataArr[id] = 'down'
        } else if (id == index) {
          dataArr[id] = 'on isSel'
        } else {
          dataArr[id] = 'on'
        }
      }
    }
    if (index == 1) {
      payType = 0
    } else if (index == 2) {
      payType = 1
    }
    this.setData({
      payClass: dataArr
    })
  },
  selectCoupon: function (e) {
    app.toLoad()
    var that = this
    var index = parseInt(e.currentTarget.dataset.ind)
    var isDown = that.data.couponsClass[0]
    var dataArr = that.data.couponsClass
    var couponArr = that.data.couponItemClass
    if (isDown == 'down') {
      if (isNaN(index)){
        couponNo = ""
        dataArr = ["", "isSel", ""]
        for (var id in couponArr) {
          couponArr[id] = ''
        }
      }else{
        couponNo = e.currentTarget.dataset.no
        dataArr = ["", "", ""]
        for (var id in couponArr) {
          if(id == index) {
            couponArr[id] = 'isSel'
          } else {
            couponArr[id] = ''
          }
        }
      }
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/orders/write.htm',
        header: header,
        data: {
          shopId: shopId,
          cartJson: cartJson,
          addressId: addressId,
          couponNo: couponNo
        },
        success: function (res) {
          var userData = res.data.data
          totalPay = userData.totalPriceNew.toFixed(2)
          that.setData({
            couponsClass: dataArr,
            couponItemClass: couponArr,
            totalPay: totalPay
          })
          wx.hideLoading()
        }
      })
    } else {
      dataArr = ["down", "on", "on"]
      for (var tid in couponArr) {
        if (couponArr[tid] == 'isSel') {
          couponArr[tid] = 'on isSel'
        } else{
          couponArr[tid] = 'on'
        }
      } 
      that.setData({
        couponsClass: dataArr,
        couponItemClass: couponArr
      })
      wx.hideLoading()
    }
  },
  toAddCoupon: function (e) {
    var that = this
    wx.downloadFile({
      url: 'https://pls.asj.com/MyImageServlet',
      header: header,
      success: function (res) {
        var imgUrl = res.tempFilePath
        that.setData({
          couponShow: 'display:block;',
          codeImg: imgUrl
        })
      }
    })
  },
  bindCoupon: function (e) {
    wx.showLoading({
      title: '正在绑定中',
      mask: true
    })
    var that = this
    var couponNo = that.data.couponNo
    var couponCode = that.data.couponCode
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/coupon/bindingcoupon.htm',
      data: {
        couponNo: couponNo,
        couponCode: couponCode
      },
      header: header,
      success: function (res) {
        wx.hideLoading()
        var reInfo = res.data.errorInfo
        var reNo = res.data.errorNo
        if (reNo == "-1") {
          that.wetoast.toast({
            title: reInfo,
            duration: 2000
          })
          that.setData({
            couponCode: ''
          })
          that.toAddCoupon()
        } else if (reNo == "0") {
          that.setData({
            couponShow: 'display:none;',
            couponNo: '',
            couponCode: ''
          })
          app.toLoad()
          that.loadCoupons()
        }
      }
    })
  },
  cancelBindCounpon: function (e) {
    this.setData({
      couponShow: 'display:none;',
      couponNo: '',
      couponCode: ''
    })
  },
  changeCodeImg: function (e) {
    var that = this
    wx.downloadFile({
      url: 'https://pls.asj.com/MyImageServlet',
      header: header,
      success: function (res) {
        var imgUrl = res.tempFilePath
        that.setData({
          codeImg: imgUrl,
          couponCode: ''
        })
      }
    })
  },
  changeSend: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var dataArr = this.data.sendClass
    var takeWay, takeShow
    for (var id in dataArr) {
      if (id == index) {
        dataArr[id] = 'isSel'
      } else {
        dataArr[id] = ''
      }
    }
    if (index == 0) {
      takeWay = '配送'
      takeShow = 'display:none'
      deliveryType = 0
      nowTimes[0] = '尽快送达'
    } else if (index == 1) {
      takeWay = '自提'
      deliveryType = 1
      takeShow = ''
      nowTimes[0] = '尽快去提'
    }
    var thisTime = this.data.time
    if (thisTime == '尽快去提' || thisTime == '尽快送达') {
      this.data.times = nowTimes
      this.setData({
        takeWay: takeWay,
        time: nowTimes[0],
        takeShow: takeShow,
        sendClass: dataArr,
        times: nowTimes
      })
    } else {
      this.setData({
        takeWay: takeWay,
        takeShow: takeShow,
        sendClass: dataArr
      })
    }
  },
  sendTimeShow: function (e) {
    if (isOpen) {
      this.setData({
        sendTimeClass: 'edit',
        pickerShow: 'display:none;'
      })
      isOpen = false
    } else {
      this.setData({
        sendTimeClass: 'save',
        pickerShow: ''
      })
      isOpen = true
    }
  },
  sendTimeChange: function (e) {
    var val = e.detail.value
    if (nowDay == val[0]) {
      this.data.times = nowTimes
      this.setData({
        times: nowTimes,
        day: this.data.days[val[0]],
        time: this.data.times[val[1]],
        value: [val[0], val[1]]
      })
    } else {
      this.data.times = times
      this.setData({
        times: times,
        day: this.data.days[val[0]],
        time: this.data.times[val[1]],
        value: [val[0], val[1]]
      })
    }
  },
  toChangeArr: function (startTime, endTime) {
    if (startTime < endTime) {
      times = timesArr.slice(startTime, endTime)
      if (nowTime > endTime) {
        nowDay = nowDay + 1
        nowTimes = times;
      } else if (nowTime < startTime) {
        nowTimes = times;
      } else {
        var ind = nowTime - startTime
        nowTimes = times.slice(ind)
        nowTimes[0] = '尽快送达'
      }
    } else {
      times = timesArr.slice(0, endTime).concat(timesArr.slice(startTime))
      if (nowTime > endTime || nowTime < startTime) {
        nowTimes = times;
      } else if (nowTime > startTime) {
        nowTimes = timesArr.slice(nowTime)
        nowTimes[0] = '尽快送达'
      } else if (nowTime < endTime) {
        nowTimes = times.slice(nowTime)
        nowTimes[0] = '尽快送达'
      }
    }
  },
  changeIptVal: function (e) {
    var iptVal = e.detail.value
    var iptKey = e.currentTarget.dataset.ipt
    if (iptKey == 'address') {
      addressDetail = iptVal
    } else if (iptKey == 'name') {
      addressConsignee = iptVal
    } else if (iptKey == 'mobile') {
      addressMobile = iptVal
      if (!app.isMobile(addressMobile)) {
        this.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
      }
    } else if (iptKey == 'notice') {
      notice = iptVal
    } else if (iptKey == 'couponNo') {
      this.setData({
        couponNo: iptVal
      })
    } else if (iptKey == 'couponCode') {
      this.setData({
        couponCode: iptVal
      })
    }
  },
  toSubmit: function () {
    var that = this
    addressDetail = addressDetail.replace(/(^\s*)|(\s*$)/g, "")
    if (addressDetail.length < 3) {
      that.wetoast.toast({
        title: '请填写详细地址',
        duration: 2000
      })
      return
    }
    if (addressConsignee.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
      that.wetoast.toast({
        title: '请填写收货人姓名',
        duration: 2000
      })
      return
    }
    if (!addressMobile) {
      that.wetoast.toast({
        title: '请填写手机号',
        duration: 2000
      })
      return
    } else {
      if (!app.isMobile(addressMobile)) {
        that.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
        return
      }
    }
    var dayVal = that.data.value[0]
    var time = that.data.time
    if (dayVal != nowDay) {
      time = '星期' + that.data.day + '　' + time
    }
    if (addrName){
      addressDetail = addrName + '@' + addressDetail
    }
    app.toLoad()
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/orders/create.htm',
      header: header,
      data: {
        addressId: addressId,
        shopId: shopId,
        cartJson: cartJson,
        deliveryType: deliveryType,
        time: time,
        payType: payType,
        couponNo: couponNo,
        notice: notice,
        addressDetail: addressDetail,
        addressMobile: addressMobile,
        addressConsignee: addressConsignee
      },
      success: function (res) {
        var ordersNo = res.data.data
        if (ordersNo) {
          for (var i in cartList) {
            if (cartList[i].shopId == shopId) {
              var pdList = cartList[i].pdlist
              var tempPdList = []
              for (var j in pdList) {
                if (pdList[j].isSel == 0) {
                  tempPdList.push(pdList[j])
                }
              }
              if (tempPdList.length > 0) {
                cartList[i].pdlist = tempPdList
                wx.setStorageSync('cartList', cartList)
              } else {
                cartList.splice(i, 1)
                wx.setStorageSync('cartList', cartList)
              }
            }
          }
          if (payType == 0) {
            wx.redirectTo({
              url: '/pages/orders/orderPay/orderPay?ordersNo=' + ordersNo,
            })
          } else if (payType == 1) {
            wx.redirectTo({
              url: '/pages/orders/success/success?ordersNo=' + ordersNo,
            })
          }
          wx.hideLoading()
        } else {
          wx.hideLoading()
          that.wetoast.toast({
            title: '订单生成出错',
            duration: 2000
          })
        }
      }
    })
  },
  loadCoupons: function (){
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/coupon/rulelist.htm',
      header: header,
      data: {
        shopID: shopId,
        cartJson: cartJson
      },
      success: function (res) {
        var couponsData = res.data.data
        if (couponsData) {
          var couponsCount = couponsData.length
          var couponsClass = ["", "on", ""]
          var couponItemClass = []
          for (var i = 0; i < couponsCount; i++) {
            couponItemClass[i] = ""
          }
          that.setData({
            couponsData: couponsData,
            couponsCount: couponsCount,
            couponItemClass: couponItemClass,
            couponsClass: couponsClass
          })
        }
        cIsLoad = true
        if (mIsLoad) {
          wx.hideLoading()
        }
      }
    })
  },
  onLoad: function (opt) {
    app.toLoad()
    payType = 0
    new app.WeToast()
    var that = this
    shopId = opt.shopId
    cartJson = opt.pdsJson
    header = wx.getStorageSync('header')
    cartList = wx.getStorageSync('cartList')
    addrName = wx.getStorageSync('addrName')
    var preAddr = wx.getStorageSync('preAddr')
    addressId = wx.getStorageSync('addressId')
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    if (addressId) {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/orders/write.htm',
        header: header,
        data: {
          shopId: shopId,
          cartJson: cartJson,
          addressId: addressId
        },
        success: function (res) {
          var userData = res.data.data
          var startTime = parseInt(userData.startTime)
          var endTime = parseInt(userData.endTime)
          totalPay = userData.totalPriceNew.toFixed(2)
          that.toChangeArr(startTime, endTime)
          var mobile = userData.mobile
          if (!app.isMobile(mobile)) {
            mobile = ''
          }
          addressDetail = userData.address
          var detailArr = addressDetail.split('@')
          if (detailArr.length > 1){
            addressDetail = detailArr[1]
          }
          addressMobile = mobile
          addressConsignee = userData.consignee
          var isSend = userData.isSend
          if (isSend) {
            deliveryType = 0
            that.setData({
              userData: userData,
              preAddr: preAddr,
              addressDetail: addressDetail,
              isSend: isSend,
              mobile: mobile,
              sendClass: ['isSel', ''],
              takeWay: '配送',
              takeShow: 'display:none',
              day: days[nowDay],
              times: nowTimes,
              time: nowTimes[0],
              totalPay: totalPay
            })
          } else {
            deliveryType = 1
            that.setData({
              userData: userData,
              preAddr: preAddr,
              addressDetail: addressDetail,
              isSend: isSend,
              mobile: mobile,
              sendClass: ['', 'isSel'],
              takeWay: '自提',
              takeShow: '',
              day: days[nowDay],
              times: nowTimes,
              time: nowTimes[0],
              totalPay: totalPay
            })
          }
          mIsLoad = true
          if(cIsLoad){
            wx.hideLoading()
          }
        }
      })
    } else {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/orders_address/write.htm',
        header: header,
        data: {
          shopId: shopId,
          lat: lat,
          lon: lon,
          cartJson: cartJson
        },
        success: function (res) {
          var userData = res.data.data
          var startTime = parseInt(userData.startTime)
          var endTime = parseInt(userData.endTime)
          totalPay = userData.totalPriceNew.toFixed(2)
          that.toChangeArr(startTime, endTime)
          var mobile = userData.mobile
          if (!app.isMobile(mobile)) {
            mobile = ''
          }
          addressId = userData.adId
          addressDetail = userData.address
          addressMobile = mobile
          addressConsignee = userData.consignee
          wx.setStorageSync('addressId', addressId)
          var isSend = userData.isSend
          if (isSend) {
            deliveryType = 0
            that.setData({
              userData: userData,
              preAddr: preAddr,
              isSend: isSend,
              mobile: mobile,
              sendClass: ['isSel', ''],
              takeWay: '配送',
              takeShow: 'display:none',
              day: days[nowDay],
              times: nowTimes,
              time: nowTimes[0],
              totalPay: totalPay
            })
          } else {
            deliveryType = 1
            that.setData({
              userData: userData,
              preAddr: preAddr,
              isSend: isSend,
              mobile: mobile,
              sendClass: ['', 'isSel'],
              takeWay: '自提',
              takeShow: '',
              day: days[nowDay],
              times: nowTimes,
              time: nowTimes[0],
              totalPay: totalPay
            })
          }
          mIsLoad = true
          if (cIsLoad) {
            wx.hideLoading()
          }
        }
      })
    }
    that.loadCoupons()
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
