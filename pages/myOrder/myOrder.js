//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    const url = app.globalData.baseUrl + '/index.php/api/order/myXOrderList'
    wx.request({
      url:url,
      data:{
        token:app.globalData.token
      },
      success:res=>{
        console.log(res)
        self.setData({
          orderList:res.data.result
        })
      }
    })
  },
})