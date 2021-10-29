// 定义验证规则
$(function(){
    // 获取layui的表单元素
    var form = layui.form;
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '用户昵称长度为 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserinfo();

    // 获取用户基本信息
    function initUserinfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('获取用户信息失败');
                }
                // console.log(res);
                // 调用表单的val()方法快速赋值
                form.val("userInfo-form",res.data);
            }
        })
    }

    // 给重置按钮绑定事件
    $('#btnReset').on('click',function(e){
        // 取消重置按钮的默认重置行为
        e.preventDefault();
        getUserinfo();
    })

    // 获取表单提交行为
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('用户信息更新失败！');
                }
                layui.layer.msg('用户信息更新成功！')
                // 调用父页面的getUserInfo()重新渲染用户名和头像
                window.parent.getUserinfo();

            }
        })
    })
})