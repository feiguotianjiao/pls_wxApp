/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//setAddress.js
var app = getApp()
var adId, n, m, d, addrName, addressDetail, addressId, hasAddrName, header, toChangeStorage, lon, lat, delId
Page({
  data: {
  },
  changeIptVal: function (e) {
    var iptVal = e.detail.value
    var iptKey = e.currentTarget.dataset.ipt
    if (iptKey == 'address') {
      addressDetail = iptVal
    } else if (iptKey == 'name') {
      n = iptVal
    } else if (iptKey == 'mobile') {
      m = iptVal
      if (!app.isMobile(m)) {
        this.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
      }
    }
    console.log(iptVal)
  },
  goMap: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        lat = parseFloat(res.latitude) + 0.0063
        lon = parseFloat(res.longitude) + 0.0063
        addrName = res.name
        hasAddrName = true
        that.setData({
          addrName: addrName
        })
        if (adId) {
          delId = adId
          adId = ''
        }
      }
    })
  },
  toSubmit: function () {
    var that = this
    if (!n) {
      that.wetoast.toast({
        title: '请填写收货人姓名',
        duration: 2000
      })
      return
    } else {
      if (n.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
        that.wetoast.toast({
          title: '请输入2字符以上的姓名',
          duration: 2000
        })
        return
      }
    }
    if (!m) {
      that.wetoast.toast({
        title: '请填写手机号',
        duration: 2000
      })
      return
    } else {
      if (!app.isMobile(m)) {
        that.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
        return
      }
    }
    if (addrName.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
      that.wetoast.toast({
        title: '请选择您的大体位置',
        duration: 2000
      })
      return
    }
    if (!addressDetail) {
      that.wetoast.toast({
        title: '请填写详细地址',
        duration: 2000
      })
      return
    } else {
      addressDetail = addressDetail.replace(/(^\s*)|(\s*$)/g, "")
      if (addressDetail.length < 3) {
        that.wetoast.toast({
          title: '请填写3字符以上的详细地址',
          duration: 2000
        })
        return
      }
    }
    if (hasAddrName) {
      d = addrName + '@' + addressDetail
    }
    if (adId) {
      app.toLoad()
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/address/edit.htm',
        header: header,
        data: {
          adId: adId,
          n: n,
          m: m,
          d: d
        },
        success: function (res) {
          wx.redirectTo({
            url: '/pages/member/manageAddress/manageAddress',
          })
          wx.hideLoading()
        }
      })
    } else {
      app.toLoad()
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/address/add.htm',
        header: header,
        data: {
          lon: lon,
          lat: lat,
          n: n,
          m: m,
          d: d
        },
        success: function (res) {
          if (delId) {
            wx.request({
              url: 'https://safe.asj.com/pls/appapi/address/del.htm',
              header: header,
              data: {
                adId: delId
              },
              success: function () {
                if (toChangeStorage) {
                  wx.setStorageSync('addressId', '')
                  wx.setStorageSync('lat', lat)
                  wx.setStorageSync('lon', lon)
                  wx.setStorageSync('preAddr', addrName)
                  wx.setStorageSync('addrName', addrName)
                  wx.setStorageSync('cartChange', true)
                  wx.setStorageSync('loadShop', false)
                  wx.reLaunch({
                    url: '/pages/member/manageAddress/manageAddress',
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/member/manageAddress/manageAddress',
                  })
                }
              }
            })
          } else {
            wx.redirectTo({
              url: '/pages/member/manageAddress/manageAddress',
            })
          }
          wx.hideLoading()
        }
      })
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onLoad: function (opt) {
    new app.WeToast()
    header = wx.getStorageSync('header')
    adId = opt.adId
    if (adId) {
      n = opt.n
      m = opt.m
      d = opt.d
      addressId = wx.getStorageSync('addressId')
      if (parseInt(adId) == parseInt(addressId)) {
        toChangeStorage = true
      }
      var detailArr = d.split('@')
      if (detailArr.length > 1) {
        addrName = detailArr[0]
        addressDetail = detailArr[1]
        hasAddrName = true
      } else {
        addrName = opt.addrName
        addressDetail = d
        hasAddrName = false
      }
      this.setData({
        n: n,
        m: m,
        addressDetail: addressDetail,
        addrName: addrName
      })
    } else {
      n = ''
      m = ''
      addressDetail = ''
      addrName = ''
    }
  }
})
