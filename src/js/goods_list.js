$(function () {


    //定义接口参数
    let QueryObj = {
        //查询关键词
        query: "",
        // 分类ID
        cid: $.getUrl("cid"),
        // 页数索引
        pagenum: 1,
        // 每页长度
        pagesize: 10,
    };
    // 定义总页数
    let TotalPages = 1;

    init();

    function eventList(){
        //给下拉刷组件中的a标签绑定tap点击事件  进行跳转
        $(".goods_lst").on("tap","a",function(){
            location.href = this.href;
        })
    }

    // // 根据url上的key来获取对应的值
    // // list.html?cid=100
    // // getUrl("cid")=100
    // function getUrl(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     if (r != null) return decodeURI(r[2]);
    //     return null;
    // }

    function init() {
        // getSearc()
        mui.init({
            pullRefresh: {
                container: ".pyg_view",
                down: {
                    auto: true,
                    //  触发下拉刷新时自动触发
                    callback: function () {
                        // 重置页码
                        QueryObj.pagenum = 1;

                        getSearc(function (arr) {
                            let html = template("searchTpl", {
                                arr: arr
                            });
                            $(".goods_lst").html(html);
                            // 结束下拉刷新
                            mui('.pyg_view').pullRefresh().endPulldownToRefresh();
                            // 重置 组件
                            mui('.pyg_view').pullRefresh().refresh(true);
                        })

                    }
                },
                up: {
                    //  触发上拉刷新时自动触发
                    callback: function () {
                        // 判断有没有下一页数据
                        if (QueryObj.pagenum >= TotalPages) {
                            //没有数据
                            console.log("没有数据了...");
                            // 传入true mui组件自己把提示信息 变成 没有更多数据了...
                            // 宣布了上拉加载的组件 已经停用了  不会再有上拉的效果和行为了
                            mui(".pyg_view")
                                .pullRefresh()
                                .endPullupToRefresh(true);
                        } else {
                            // 存在下一页数据
                            QueryObj.pagenum++;
                            getSearc(function (arr) {
                                let html = template("searchTpl", {
                                    arr: arr
                                });
                                $(".goods_lst").append(html);
                                // 结束上拉刷新
                                mui('.pyg_view').pullRefresh().endPullupToRefresh(false);
                            })
                        }
                    }
                }
            }
        });
        eventList();
    }

    //获取商品列表数据
    function getSearc(fn) {
        $.get("goods/search", QueryObj, function (result) {
            console.log(result);
            if (result.meta.status === 200) {
                //请求成功
                //   判断数据是否存在
                if (result.data.goods) {
                    // 计算总页数 总的页码公式 = Math.ceil( 总条数(已知) / 页容量（已知）)
                    TotalPages = Math.ceil(result.data.total / QueryObj.pagesize);
                    console.log(TotalPages);
                    let arr = result.data.goods;
                    fn(arr)
                }
            }
        })
    }
})