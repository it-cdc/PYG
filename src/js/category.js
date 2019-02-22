$(function () {
    //定义全局变量 存放发送请求后的要渲染的数据 resul.data
    let Datas = null;
    let LeftScroll = null;

    init();

    function init() {
        //调用渲染页面函数
        renderMain();
        //调用tap绑定事件函数
        eventList();
    }

    // 把页面所有的绑定事件的代码都放到这个方法中
    function eventList() {
        //绑定左侧菜单的点击事件，用事件委托。因为页面是数据请求回来后渲染的
        $(".pyg_left_ul").on("tap", "li", function () {
            //激活选中 添加类名：active 排他思想
            $(this).addClass("active").siblings().removeClass("active");
            // 使用zepto内置的方法来获取 dom元素的索引
            let index = $(this).index();
            //根据被点击的li索引来渲染右侧的内容
            renderRight(index);
            // 左侧被点击的菜单 往上滚动置顶
            LeftScroll.scrollToElement(this);
        })
    }

    //渲染页面
    function renderMain() {
        // 获取本地存储中的 数据 null 要么 字符串
        let localObj = $.getCates();
        // 判断缓存是否存在
        if (!localObj) {
            //不存在
            console.log("缓存不存在");
            getCategories();
        } else {
            // 存在
            // let localObj = JSON.parse(localObj);
            // 判断数据是否过期 过期时间 10s 1s=1000ms(毫秒)
            if (Date.now() - localObj.time > 1000 * 10) {
                //数据过期了
                console.log("数据过期了");
                //调用请求数据函数
                getCategories();
            } else {
                //没有过期
                console.log("使用旧的数据");
                // 获取旧的数据
                Datas = localObj.data;
                //调用渲染左侧函数
                renderLeft();
                //调用渲染右侧列表函数
                renderRight(0);
            }
        }
    }

    //发送请求获取分类页面数据
    function getCategories() {
        $.get("categories", function (result) {
            console.log(result);
            // 判断请求是否成功
            if (result.meta.status === 200) {
                // 获取数据
                Datas = result.data;
                // 把数据存入本地存储中
                let localObj = {
                    data: Datas,
                    time: Date.now()
                };
                //// 存入 分类数据 
                $.setCates(localObj);
                // console.log()
                //调用渲染左侧页面函数
                renderLeft();
                //调用渲染右侧页面函数
                renderRight(0);
            }
        })
    }

    //渲染左侧数据
    function renderLeft() {
        let leftArr = Datas;
        let leftHtml = template("categoriesTpl", {
            arr: leftArr
        });
        //渲染左侧列表
        $(".pyg_left_ul").html(leftHtml);
        // 初始化左侧滚动条
        LeftScroll = new IScroll('.pyg_left');
    }
    //渲染右侧数据
    function renderRight(index) {
        // console.log('111');
        
        //渲染右侧列表
        let rightArr = Datas[index].children;
        //  console.log(str);
        let rightHtml = template("categoriesTPL_right", {
            arr: rightArr
        });
        // console.log('22');
        
        //渲染右侧图片数据路径需要添加api前缀 http://api.pyg.ak48.xyz/
        $(".pyg_right").html(rightHtml);
        // 初始化右侧滚动条
        //必须要等待 图片都加载完毕了 再进行 滚动条的初始化
        //获取图片数组的长度
        let imgLength = $(".pyg_right img").length;
        //  console.log(imgLength)
        $(".pyg_right img").on("load", function () {
            imgLength--;
            if (imgLength == 0) {
                // 最后一张图片才初始化
                let rightIscroll = new IScroll('.pyg_right');
            }
        })
    }
})