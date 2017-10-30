/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//detail.js
let shopCart = require('../../common/shopCart/common.js');
var app = getApp();
var sysDpr = app.getSysDpr();
var isTopset = false;
var wHeight;
var shopId, pdId
Page({
  data: {
    toTop_style: 'display:none',
    topNum: 0,
    isShow: false
  },
  previewImg: function (e) {
    var urls = this.data.swiperImg
    var current = e.currentTarget.dataset.url
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  //页面滑动时对分类按钮的控制
  pageScroll: function (e) {
    var toTop = e.detail.scrollTop * sysDpr
    if (toTop > 206) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < 206) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function (e) {
    this.setData({
      topNum: 0
    })
  },
  addCart: function () {
    var that = this
    app.addCartData(that, shopId, pdId)
  },
  toWriteOrder: function () {
    app.toWriteOrder(shopId)
  },
  clearCart: function (e) {
    var that = this
    wx.showModal({
      title: '购物车提示',
      content: '确定删除购物车中的所有商品？',
      confirmText: '确定删除',
      success: function (res) {
        if (res.confirm) {
          var statusName = 'clearCart'
          var pdId = 0
          that.setData({
            cartTip_top: '',
            cartContent_top: '',
            cartItems_style: '',
            cartMes_left: '',
            mask_style: '',
            isShow: false
          })
          shopCart.changeStatus(shopId, statusName, pdId)
          shopCart.cartInit(that, shopId)
        }
      }
    })
  },
  cancelAllSel: function (event) {
    var that = this
    var statusName = 'cancelAllSel'
    var pdId = 0
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  changeAllSel: function (event) {
    var that = this
    var statusName = 'changeAllSel'
    var pdId = 0
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  cancelSel: function (event) {
    var that = this
    var statusName = 'cancelSel'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  changeSel: function (event) {
    var that = this
    var statusName = 'changeSel'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  addCount: function (event) {
    var that = this
    var statusName = 'addCount'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
  },
  reduceCount: function (event) {
    var that = this
    var statusName = 'reduceCount'
    var pdId = event.currentTarget.dataset.pdid
    shopCart.changeStatus(shopId, statusName, pdId)
    shopCart.cartInit(that, shopId)
    var itemCount = that.data.itemCount
    if (itemCount > 0) {
      var isShow = false
      shopCart.changePos(that, isShow, itemCount, wHeight)
    }else{
      var isShow = true
      shopCart.changePos(that, isShow, itemCount, wHeight)
    }
  },
  showSwich: function () {
    var that = this
    var isShow = that.data.isShow
    var itemCount = that.data.itemCount
    shopCart.changePos(that, isShow, itemCount, wHeight)
  },
  onLoad: function (opt) {
    shopId = opt.shopId
    pdId = opt.pdId
    var that = this
    shopCart.cartInit(that, shopId)
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/product/detail.htm',
      data: {
        shopId: shopId,
        pdId: pdId
      },
      success: function (res) {
        var useData = res.data.data
        var swiperImg = useData.imageList
        var pdName = useData.pdName
        var cost = useData.cost
        var price = useData.price
        var isSelling = useData.isSelling
        var catePdList = useData.catePdList
        wx.setNavigationBarTitle({
          title: pdName
        })
        that.setData({
          swiperImg: swiperImg,
          pdName: pdName,
          shopId: shopId,
          pdId: pdId,
          cost: cost,
          price: price,
          isSelling: isSelling,
          catePdList: catePdList
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
    wx.getSystemInfo({
      success: function (res) {
        wHeight = res.windowHeight * sysDpr;
      }
    })
  }
})
