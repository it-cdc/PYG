$(function () {

    //定义一个全局变量 该商品的详细信息
    let GlobalGoodsInfo = null;

    init();

    function init() {
        getDetail();
        eventList();
    }

    function eventList() {
        //绑定 加入购物车 点击事件
        $(".pyg_cart_btn").on("tap", function () {
            console.log("tap事件触发");
            //获取本地永久存储中的用户数据  null || 字符串
            let userinfo = $.getUser();
            // 判断用户数据是否为空  有数据证明已登录
            if (userinfo) {
                //构造接口要的参数对象
                let addParam = {
                    cat_id: GlobalGoodsInfo.cat_id,
                    goods_id: GlobalGoodsInfo.goods_id,
                    goods_name: GlobalGoodsInfo.goods_name,
                    goods_number: GlobalGoodsInfo.goods_number,
                    goods_price: GlobalGoodsInfo.goods_price,
                    goods_small_logo: GlobalGoodsInfo.goods_small_logo,
                    goods_weight: GlobalGoodsInfo.goods_weight
                };
                // $.ajax 可以自定义的传入一些 信息 到 请求头中 （使用$.post 没法设置请求头）
                // 获取本地存储中的token 字段
                // let token = JSON.parse(userinfo).token;
                console.log('已经登录');
                //#region  旧的ajax代码
                // $.ajax({
                //     type: "post",
                //     url: "my/cart/add",
                //     data: {
                //         info: JSON.stringify(addParam)
                //     },
                //     // dataType: "dataType",
                //     // 设置请求头
                //     headers: {
                //         Authorization: token
                //     },
                //     success: function (result) {
                //         // console.log(result);
                //         if (result.meta.status === 200) {
                //             // mui.prompt('text','deftext','title',['true','false'],null,'div')
                //             mui.confirm("是否跳转到购物车页面", "添加成功", ["yes", "no"], function (btnType) {
                //                 if (btnType.index == 0) {
                //                     //跳转到购物车页面
                //                     location.href = "cart.html";
                //                 } else if (btnType.index == 1) {
                //                     //不要跳转
                //                     console.log("不要跳转...")
                //                 }
                //             })
                //         }
                //     }
                // });
                 //#endregion
                //新的ajax代码
                 $.post("my/cart/add",{info: JSON.stringify(addParam)},function(result){
                    if (result.meta.status === 200) {
                        // mui.prompt('text','deftext','title',['true','false'],null,'div')
                        mui.confirm("是否跳转到购物车页面？", "温馨提示", ["yes", "no"], function (btnType) {
                            if (btnType.index == 0) {
                                //跳转到购物车页面
                                location.href = "cart.html";
                            } else if (btnType.index == 1) {
                                //不要跳转
                                console.log("不要跳转...")
                            }
                        })
                    }
                });
            } else {
                //未登录
                console.log('未登录');
                mui.toast("请先登录...");
                //设置当前页面路径
                $.setPageUrl();
                setTimeout(() => {
                    location.href = "login.html";
                }, 1000);
            }
        })
    };


    // 获取商品的详情数据
    function getDetail() {
        let paramsObj = {
            goods_id: $.getUrl("goods_id")
        }
        $.get("goods/detail", paramsObj, function (result) {
            console.log(result);

            if (result.meta.status === 200) {
                //给全局变量赋值
                GlobalGoodsInfo = result.data;
                //获取数据，渲染数据
                let data = result.data;
                let html = template("mainTpl", data);

                $(".pyg_view").html(html);
                //轮播图的初始化
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 500 //自动轮播周期，若为0则不自动播放，默认为0；
                });
            }
        })
    };

})