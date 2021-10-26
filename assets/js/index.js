$(function(){
    // 获取用户信息
    getUserInfo();

    // 给退出链接绑定事件
    $('#logOut').on('click',function(){
        console.log(1);
        layui.layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, 
        function(index){
            //do something
            // 清除本地存储的token
            localStorage.removeItem('token');
            // 返回登录页面
            location.href = 'login.html';
            // 关闭询问框
            layer.close(index);
          });
    })
})

function getUserInfo(){
    $.ajax({
        methods:'GET',
        url:'/my/userinfo',
        // // 请求头配置对象
        // headers:{
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success:function(res){
            //console.log(res);
            // 渲染用户头像
            if(res.status === 0){
                renderAvatar(res.data);
            }
        }
    })
}

function renderAvatar(user){
    // 渲染文字部分
    // 获取用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;'+ name);

    // 渲染头像
    // 如果有图片头像则先渲染图片头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text-avator').hide();
    }else{
        $('.text-avator').html(name[0].toUpperCase()).show();
        $('.layui-nav-img').hide();
    }
}