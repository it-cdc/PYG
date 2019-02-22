$(function(){
    init();
    function init(){
        //获取本地存储的y用户信息  null或者正常的对象
        let userinfo = $.getUser();
        //判断有没有数据，有代表以及登录过
        if(!userinfo){
            // 未登录
            $.getPageUrl();
            //跳转到登录页面
            location.href="login.html";
            return;
        }else {
            //有数据，已经登录过
            $("body").fadeIn();
        }
    }
})