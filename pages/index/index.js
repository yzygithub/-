//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    shelfLocation: '苏州睿途网络科技有限公司货架A',
    isScaned: true,//是否扫描便利架码 false:未扫码，显示提示。
    // cartShow: false,//底部购物车是否显示 默认false
    showCartDetail: false,//购物车列表 默认false
    userCenterOpen: false,//用户中心打开 默认false
    userInfo: {},
    phoneNum:'',
    myIntegral:0,
    hasUserInfo: false,
    classifySeleted: '',
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    goodsList: [],
    goods: {},
    cart: {
      count: 0,
      totalPrice: 0,
      totalIntegral: 0,
      list: {}
    },
    cartId:[]
  },
  onLoad: function () {
    // console.log(app.globalData.baseUrl)
    console.log(app.globalData)
    // 登录
    let that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const jscode = res.code
        let url = app.globalData.baseUrl + '/index.php/api/user/smallLogin';
        wx.request({
          url: url,
          data: {jscode: jscode},
          success: function (res) {
            console.log(res.data)
            if (res.data.status == 4004) {
              // console.log(res.data.status)
              wx.redirectTo({
                url: '../bindPhone/bindPhone',
              })
            } else if (res.data.status == 1) {
              // console.log('smallLogin:')
              // console.log(res)
              app.globalData.token = res.data.result.token
              app.globalData.mobile = res.data.result.mobile
              app.globalData.myIntegral = res.data.result.pay_points
              app.globalData.phoneNum = res.data.result.mobile
              // console.log(app.globalData)
              const phoneNumMix = app.globalData.phoneNum.substr(0, 3) + '****' + app.globalData.phoneNum.substr(7);
              that.setData({
                myIntegral:app.globalData.myIntegral,
                phoneNum:phoneNumMix
              })
            }
            //获得商品信息
            wx.request({
              url: app.globalData.baseUrl + '/index.php/api/Index/getIndexGoods',
              data: {token: app.globalData.token},
              success: res => {
                if (res.data.status == 1) {
                  // console.log('set goods')
                  // console.log(res.data.result)
                  that.setData({
                    goods: res.data.result
                  })
                  app.globalData.goods = res.data.result
                }
              }
            })
          }
        })
        // console.log('login:')
        // console.log(res)
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获得分类信息
    wx.request({
      url: app.globalData.baseUrl + '/index.php/api/Index/getIndexPage',
      // data: {token:app.globalData.token},
      success: res => {
        this.setData({
          goodsList: res.data.result,
          classifySeleted: 'c-' + res.data.result[0].id
        })
      }
    })
  },

  tapAddCart: function (e) {
    // console.log(e)
    this.addCart(e.currentTarget.dataset.id);
    // console.log('add')
  },
  tapReduceCart: function (e) {
    this.reduceCart(e.currentTarget.dataset.id);
  },
  addCart: function (id) {
    // console.log(id)
    var num = this.data.cart.list[id] || 0;
    this.data.cart.list[id] = num + 1;
    this.countCart();
    var price = this.data.goods[id].shop_price;
    var name = this.data.goods[id].goods_name;
    var img = this.data.goods[id].pic;
    var sortedList = [];
    var index;
    var num = this.data.cart.list[id] || 0;
    num = num + 1;
  },
  reduceCart: function (id) {
    var num = this.data.cart.list[id] || 0;
    if (num <= 1) {
      delete this.data.cart.list[id];
      // 如果数量为0，关闭列表,这个时候this.data.cart.count还没有更新，所以还是1
      // console.log(this.data.cart.count)
      if (this.data.cart.count == 1) {
        this.setData({
          showCartDetail: false
        });
      }
    } else {
      this.data.cart.list[id] = num - 1;
    }
    this.countCart();
  },
  countCart: function (index, lists) {
    var count = 0,
      totalPrice = 0,
      totalIntegral = 0;
    var goods;
    for (var id in this.data.cart.list) {
      goods = this.data.goods[id];
      count += this.data.cart.list[id];
      totalPrice += goods.shop_price * this.data.cart.list[id];
      totalIntegral += goods.integral * this.data.cart.list[id];
    }
    this.data.cart.count = count;
    this.data.cart.totalPrice = totalPrice;
    this.data.cart.totalIntegral = totalIntegral;
    this.setData({
      cart: this.data.cart
    });
    // 存储订单页所需要的数据
    wx.setStorage({
      key: 'orderList',
      data: {
        count: this.data.cart.count,
        totalPrice: this.data.cart.totalPrice,
        totalIntegral: this.data.cart.totalIntegral,
        list: this.data.cart.list,
      }
    })
  },
  clearCart: function() {
    this.data.cart.list = {}
    this.data.cart.count = 0;
    this.data.cart.totalPrice = 0;
    this.data.cart.totalIntegral = 0;
    this.setData({
      cart: this.data.cart,
      showCartDetail: false
    })
    wx.showToast({
      title: '已清理购物车',
      icon: 'success',
      duration: 1000
    })
  },
  onGoodsScroll: function (e) {
    // console.log(e)
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
    var validHeight = 570;//这个值不同的手机是不一样的，但是效果差不多，就不设为动态的了。
    var scale = e.detail.scrollWidth / validHeight,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function (classify, i) {
      var _h = 60 + classify.goods.length * 200;
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = 'c-' + classify.id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },
  tapClassify: function (e) {
    // console.log(e);
    var id = e.target.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
  //显示购物车列表
  showModal: function () {
    if (this.data.showCartDetail) {
      this.hideMask()
    } else {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showCartDetail: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    }
  },
  //隐藏购物车mask
  hideMask: function () {
    // console.log('hide')
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showCartDetail: false
      })
    }.bind(this), 200)
  },
  //打开个人中心
  openCenter: function () {
    this.data.userCenterOpen ? this.setData({userCenterOpen: false}) : this.setData({userCenterOpen: true});
  },
  scanCode: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  preventScroll: function () {
  //  捕捉滚动事件，防止滚动穿透
  },
  submitCart: function () {
    console.log('submit cart')

    wx.navigateTo({
      url: '../confirmOrder/confirmOrder'
    })
  }
})
