// pages/confirmOrder/confirmOrder.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    cart: {},
    goods_info:[],
    // loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    try {
      var value = wx.getStorageSync('orderList')
      if (value) {
        // console.log(value)
        self.setData({
          cart:value
        })
        for (let goodsId in self.data.cart.list) {
          // console.log('goodsItem:')
          // console.log(goodsId+':'+self.data.cart.list[goodsId])
          let goodsItem = {}
          goodsItem.goods_id = goodsId;
          goodsItem.goods_num = self.data.cart.list[goodsId]
          self.data.goods_info.push(goodsItem)
        }
        console.log(JSON.stringify(self.data.goods_info))
        console.log(self.data.goods_info)
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
    self.setData({
      goods: app.globalData.goods
    })
  },

  /**
   * 立即支付
   */
  payNow: function () {
    // this.setData({
    //   loading:true
    // })
    let self =this
    //提交订单
    const url = app.globalData.baseUrl + '/index.php/api/cart/postXOrder'
    wx.request({
      url:url,
      data:{
        // goods_info:JSON.stringify(this.data.goods_info),
        goods_info:this.data.goods_info,
        token:app.globalData.token
      },
      success:res=>{
        console.log(res)
        const orderId = res.data.result.order_id
        if (res.data.status == 1) {
          wx.request({
            url: app.globalData.baseUrl + '/index.php/api/Wxpay/small',
            data:{
              order_id:orderId,
              token:app.globalData.token
            },
            success:res=>{
              console.log(res)
              const timeStamp = res.data.timeStamp
              const nonceStr = res.data.nonceStr
              const wxPackage = res.data.package
              const signType = res.data.signType
              const paySign = res.data.paySign
              wx.requestPayment(
                {
                  'timeStamp': timeStamp,
                  'nonceStr': nonceStr,
                  'package': wxPackage,
                  'signType': signType,
                  'paySign': paySign,
                  'success':function(res){
                    console.log(res)
                    if (res.errMsg == 'requestPayment:ok') {
                      wx.showToast({
                        title: '支付成功',
                        icon:'success',
                        duration:1000,
                        success:function (res) {
                          setTimeout(function () {
                            wx.redirectTo({
                              url: '../index/index'
                            })
                          },1000)
                        }
                      })
                    }
                  },
                  'fail':function(res){
                    console.log(res)
                    if (res.errMsg == 'requestPayment:fail cancel') {
                      //取消支付，取消订单
                      wx.request({
                        url: app.globalData.baseUrl + '/index.php/api/order/delXOrder',
                        data:{
                          order_id: orderId,
                          token: app.globalData.token
                        },
                        success:function(res) {
                          if (res.data.status==1) {
                            wx.showToast({
                              title: '取消订单',
                              icon: 'none'
                            })
                          }
                        }
                      })
                    }
                  },
                  'complete':function(res){
                    // self.setData({
                    //   loading:true
                    // })
                  }
                })
            }
          })
        } else if (res.data.status==4004) {
          //积分不够
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('confirm order hide')
  }

})