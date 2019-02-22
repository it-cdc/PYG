$(function () {
  init();
  function init() {
    getSwiperdat();
    getCatiems();
    getGoodslist();
  }
  
  //获取首页轮播图图片
  function getSwiperdat() {
    //发送ajax请求拿取数据
    $.ajax({
      url: "home/swiperdata",
      success: function (result) {
        // 判断请求是否成功
        if (result.meta.status === 200) {
          // 获取请求回来的数据
          let arr = result.data;
          //通过template模板渲染数据
          let html = template("swiperdatTpl", {
            arr: arr
          });
          //把数据渲染到页面
          $(".pyg_swiper").html(html);

          //获得slider插件对象  轮播图自动轮播js代码
          var gallery = mui('.mui-slider');
          gallery.slider({
            interval: 500 //自动轮播周期，若为0则不自动播放，默认为0；
          });
        }
      }
    });
  }

  // 首页导航
  function getCatiems() {
    $.get("home/catitems", function (result) {
      // console.log(result);
      if (result.meta.status === 200) {
        let str = result.data;
        let html = template("catitemsTpl", {
          str: str
        });
        $(".pyg_nav").html(html);
      }
    })
  }

  //商品信息
  function getGoodslist() {
    $.get("home/goodslist", function (result) {
      console.log(result);
      if (result.meta.status === 200) {
        let arr = result.data;
        let html = template("goodslistTpl", {
          arr: arr
        });
        $(".pyg_good_list").html(html);
      }
    })
  }
})