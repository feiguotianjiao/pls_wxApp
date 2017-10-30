/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//shopCart下的common.js
function changePos(that, isShow, itemCount, wHeight) {
  var maxHeight = wHeight - 396;
  var showCount = parseInt(maxHeight / 144);
  if (isShow) {
    that.setData({
      cartTip_top: '',
      cartContent_top: '',
      cartItems_style: '',
      cartMes_left: '',
      mask_style: '',
      isShow: false
    })
  } else {
    if (itemCount > showCount) {
      var cartTip_top = maxHeight + 196;
      var cartContent_top = maxHeight + 80;
      that.setData({
        cartTip_top: 'top:-' + cartTip_top + 'rpx',
        cartContent_top: 'top:-' + cartContent_top + 'rpx',
        cartItems_style: 'height:' + maxHeight + 'rpx;overflow:auto;',
        cartMes_left: 'left:20rpx;',
        mask_style: 'display:block',
        isShow: true
      })
    } else {
      var itemHeght = itemCount * 144
      var cartTip_top = itemHeght + 196
      var cartContent_top = itemHeght + 80
      that.setData({
        cartTip_top: 'top:-' + cartTip_top + 'rpx',
        cartContent_top: 'top:-' + cartContent_top + 'rpx',
        cartItems_style: 'height:' + itemHeght + 'rpx;overflow:hidden;',
        cartMes_left: 'left:20rpx;',
        mask_style: 'display:block',
        isShow: true
      })
    }
  }
}
function cartInit(that, shopId) {
  var cartList = wx.getStorageSync('cartList')
  var shopCartList = ''
  if (cartList) {
    var hasShop = false
    for (var i in cartList) {
      if (cartList[i].shopId == shopId) {
        shopCartList = cartList[i]
        var pdList = shopCartList.pdlist
        var totalNum = 0
        var totalSelNum = 0
        var totalPri = 0
        var itemCount = pdList.length
        for (var j in pdList) {
          totalNum += parseInt(pdList[j].num)
          if (pdList[j].isSel == 1) {
            var thisSelNum = parseInt(pdList[j].num)
            totalSelNum += thisSelNum
            totalPri += parseFloat(pdList[j].price) * thisSelNum
          }
        }
        totalPri = totalPri.toFixed(2)
        that.setData({
          shopCartList: shopCartList,
          totalNum: totalNum,
          totalSelNum: totalSelNum,
          totalPri: totalPri,
          itemCount: itemCount
        })
        hasShop = true
      }
    }
    if (!hasShop) {
      that.setData({
        shopCartList: shopCartList,
        itemCount: 0
      })
    }
  } else {
    that.setData({
      shopCartList: shopCartList,
      itemCount: 0
    })
  }
}
function changeStatus(shopId, statusName, pdId) {
  var cartList = wx.getStorageSync('cartList')
  for (var i in cartList) {
    if (cartList[i].shopId == shopId) {
      if (statusName == 'clearCart') {
        cartList.splice(i, 1)
        wx.setStorageSync('cartList', cartList)
      } else {
        var pdList = cartList[i].pdlist
        for (var j in pdList) {
          if (statusName == 'changeAllSel') {
            pdList[j].isSel = 1
          } else if (statusName == 'cancelAllSel') {
            pdList[j].isSel = 0
          } else {
            if (pdList[j].pdId == pdId) {
              if (statusName == 'changeSel') {
                pdList[j].isSel = 1
              } else if (statusName == 'cancelSel') {
                pdList[j].isSel = 0
              } else if (statusName == 'addCount') {
                pdList[j].num += 1
              } else if (statusName == 'reduceCount') {
                if (pdList[j].num > 1) {
                  pdList[j].num -= 1
                } else {
                  pdList.splice(j, 1)
                }
              }
            }
          }
        }
        if (pdList.length > 0) {
          cartList[i].pdlist = pdList
        } else {
          cartList.splice(i, 1)
        }
        wx.setStorageSync('cartList', cartList)
      }
    }
  }
}
module.exports.changePos = changePos
module.exports.cartInit = cartInit
module.exports.changeStatus = changeStatus
