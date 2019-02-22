$(function () {
    //mui提示框的方法
    // mui.toast('登陆成功',{ duration:'long', type:'div' }) 
    init();

    function init() {
        loginTap();
    }

    // 给登录按钮绑定tap点击事件
    function loginTap() {
        $(".dl_btn").on("tap", function () {
            // console.log('11');
            //获取用户名与密码      属性选择器     //清除空格 trim()
            let userNub = $("input[type='text']").val().trim();
            // console.log(userNub);
            let userPwd = $("input[type='password']").val().trim();
            // console.log(userPwd);
            //判断用户名跟密码是否合法
            if (!$.checkPhone(userNub)) {
                // console.log(111)
                mui.toast("请输入正确的手机号码...");
                return;
            };
            // 只能输入6-20个字母、数字、下划线
            if (!$.isPasswd(userPwd)) {
                mui.toast("请输入正确的密码...");
                return;
            };
            // 验证通过 执行以下代码
            // 封装后台需要带回去的参数
            let userObj = {
                username: userNub,
                password: userPwd
            };

            // 发送ajax请求
            $.post("login", userObj, function (result) {
                console.log(result);
                // 判断是否登录成功
                if (result.meta.status === 200) {
                    console.log("登录成功...");
                    //登录成功 把请求的数据存储到本地存储中，先把对象格式转换成json格式的字符串
                    $.setUser(result.data);

                    mui.toast(result.meta.msg);
                    // 获取本地存中的已经存好的页面路径
                    // 获取 会话存储中的来源页面  null 或者 正常的路径
                    let pageurl =$.getPageUrl();
                    //null跳转到首页
                    if(!pageurl){
                        //跳转到首页
                        pageurl="index.html";
                    }else{

                    };
                    //登录成功开启的定时器跳转页面
                    setTimeout(function(){
                        location.href=pageurl;
                    },1000);
                } else {
                    console.log("登录失败...");
                    mui.toast(result.meta.msg);
                }
            })
        })
    }

})