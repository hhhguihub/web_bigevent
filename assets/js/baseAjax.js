$.ajaxPrefilter(function(options){
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // console.log(options.url.search(/my/));
    // 为需要权限的链接设置请求头
    if(options.url.search(/my/)!==-1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete函数
    options.complete = function(res){   
            // console.log(res.responseJSON);
            // 请求用户信息失败则强制返回登录页面
            if(res.responseJSON.status === 1&&res.responseJSON.message === '身份认证失败！'){
                // 清除token
                localStorage.removeItem('token');
                // 返回登录页面
                location.href = 'login.html';
            }
    }
})