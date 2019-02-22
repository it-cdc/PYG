$(function () {

    // 公共的基础的url
    const BaseUrl = "http://api.pyg.ak48.xyz";

    if (window.template) {
        
        template.defaults.imports.BaseUrl = BaseUrl;
    };
    // 定义一个 zepto 发送请求的 前 拦截器
    // ajax发送请求前运行
    $.ajaxSettings.beforeSend = function (xhr, ajaxObj) {
        //发送请求前的拦截
        ajaxObj.url = BaseUrl + "/api/public/v1/" + ajaxObj.url;
        // 添加正在等待图标类名
        $("body").addClass("loadding");

        if (ajaxObj.url.indexOf("/my/") != -1) {
            // 存在这个字段 私有路径 必须要带上token 存放在请求头中。。
            console.log("当前接口是私有路径", ajaxObj.url);
            // 调用ajax原生的方法 设置请求头参数
            xhr.setRequestHeader("Authorization", $.getUser().token);
        } else {
            // 公开路径 不用去管请求头的token
            console.log("当前接口是公开路径", ajaxObj.url);
        }
    };

    // 发送请求后的拦截
    // 发送 数据回来之后 会被调用的拦截器
    // 删除正在等待图标类名
    $.ajaxSettings.complete = function () {
        $("body").removeClass("loadding");
    };

    // 扩展zepto 
    // 给$ 对象 扩展一个 对象 
    // 直接 $.getUrl 
    $.extend($, {
        getUrl: function (name) {
            // 根据url上的key来获取对应的值
            // list.html?cid=100
            // getUrl("cid")=100
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        //封装验证电话号码的正则
        checkPhone: function (phone) {
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        },
        
        //校验密码：只能输入6-20个字母、数字、下划线  
        isPasswd(pwd) {
            var patrn = /^(\w){6,20}$/;
            if (!patrn.exec(pwd)) return false
            return true
        },
        
        // 存入 分类数据 
        setCates: function (localObj) {
            localStorage.setItem("localData", JSON.stringify(localObj));
        },

        // 获取本地存储中的分类数据 要么是一个对象 要么就是 null 
        getCates: function () {
            // return localStorage.getItem("localData");
            let localStr = localStorage.getItem("localData");
            if (localStr) {
                let localObj = JSON.parse(localStr);
                return localObj;
            } else {
                return null
            };
        },

        // 获取 本地存储中的用户信息 返回值 要么null 或者 对象
        getUser: function () {
            let userStr = localStorage.getItem("pyg_userinfo");
            if (userStr) {
                return JSON.parse(userStr);
            } else {
                return null;
            }
        },

        // 设置用户信息 存入到本地存储中
        setUser: function (data) {
            localStorage.setItem("pyg_userinfo", JSON.stringify(data));
        },

        // 设置当前的页面路径
        setPageUrl: function () {
            sessionStorage.setItem("pageurl", location.href);
        },

        // 获取本地存中的已经存好的页面路径
        getPageUrl: function () {
            return sessionStorage.getItem("pageurl");
        }
    })
});