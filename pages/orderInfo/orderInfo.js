//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.id
      // orderId: '2'
    })
    let self = this
    const url = app.globalData.baseUrl + '/index.php/api/order/orderXdetail'
    // const url = 'https://api.shop.ruitukeji.cn/index.php/api/order/orderXdetail'
    wx.request({
      url:url,
      data:{
        token: app.globalData.token,
        // token: '69f7c7565012b4f746c2b7e4ac0ac743',
        order_id: self.data.orderId
      },
      success:res=>{
        console.log(res)
        if (res.data.status == 1) {
          self.setData({
            orderInfo:res.data.result
          })
        }
      }
    })
  },

})