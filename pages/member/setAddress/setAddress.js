/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//setAddress.js//获取应用实例
var app = getApp()
Page({
  data: {
    ipt_disabled: true,
    ipt_focus: false,
    hisAddress_list: [],
    ipt_mask_style: "",
    city_name: "宁阳县",
    search_address_style: "",
    city_name_style: "",
    search_style: "",
    goMap_style: "",
    noSet_style: "",
    hisAddress_style: "",
    city_list: ["宁阳县", "长清区", "乌鲁木齐", "泰安市", "潍坊市"],
    select_city_style: ""
  },
  goMap: function () {
    wx.chooseLocation({
      success: function (res) {
        var sLat = parseFloat(res.latitude) + 0.0063
        var sLon = parseFloat(res.longitude) + 0.0063
        var sPreAddr = res.name
        wx.showModal({
          title: '页面跳转提示',
          content: '您选择的地址是' + sPreAddr + '，确定查看该地址范围内的店铺，并跳转至首页？',
          confirmText: '去往首页',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index'
              })
              wx.setStorageSync('addressId', '')
              wx.setStorageSync('lat', sLat)
              wx.setStorageSync('lon', sLon)
              wx.setStorageSync('preAddr', sPreAddr)
              wx.setStorageSync('addrName', sPreAddr)
              wx.setStorageSync('cartChange', true)
              wx.setStorageSync('loadShop', false)
            }
          }
        })
      }
    })
  },
  showCity: function () {
    this.setData({
      ipt_disabled: false,
      ipt_focus: true,
      ipt_mask_style: "display:none;",
      search_address_style: "width:510rpx;",
      city_name_style: "display:block;",
      goMap_style: "display:none;",
      noSet_style: "display:none;",
      hisAddress_style: "display:none;"
    })
  },
  select_city: function () {
    this.setData({
      search_style: "display:none;",
      goMap_style: "display:none;",
      noSet_style: "display:none;",
      hisAddress_style: "display:none;",
      select_city_style: "display:block;"
    })
  },
  set_city: function (e) {
    var setCity = e.currentTarget.dataset.city
    this.setData({
      city_name: setCity,
      search_style: "display:block;",
      select_city_style: "display:none;"
    })
  },
  selectAddress: function (e) {
    var addrObj = e.currentTarget.dataset.obj
    var sLat = addrObj.lat
    var sLon = addrObj.lon
    var addressId = addrObj.adId
    var addrName = e.currentTarget.dataset.addrname
    if (addrName) {
      wx.setStorageSync('preAddr', addrName)
      wx.setStorageSync('addrName', addrName)
    } else {
      app.getPreAddr(sLat, sLon)
      wx.setStorageSync('addrName', '')
    }
    wx.setStorageSync('lat', sLat)
    wx.setStorageSync('lon', sLon)
    wx.setStorageSync('loadShop', false)
    wx.setStorageSync('cartChange', true)
    wx.setStorageSync('addressId', addressId)
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onLoad: function () {
    var that = this
    var header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/member/address/list.htm',
      header: header,
      success: function (res) {
        var userData = res.data.data
        for (var i in userData) {
          var addressDetail = userData[i].detailAddress
          if (addressDetail) {
            var detailArr = addressDetail.split('@')
            if (detailArr.length > 1) {
              userData[i].addrName = detailArr[0]
              userData[i].detailAddress = detailArr[1]
            }
          }
        }
        that.setData({
          hisAddress_list: userData
        })
      }
    })
    wx.hideLoading()
  }
})
