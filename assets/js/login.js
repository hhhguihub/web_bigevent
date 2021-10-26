// 实现注册登录表单切换
$('#login_a').on('click', function () {
    $('.login_box').hide();
    $('.reg_box').show();
})
$('#reg_a').on('click', function () {
    $('.login_box').show();
    $('.reg_box').hide();
})

// 制定自定义验证规则
var form = layui.form;
var layer = layui.layer;
// 通过form.verify制定自定义规则
form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不含空格'],
    // 定义两次密码框是否相同的验证
    repwd: function (value) {
        var pwd = $('.reg_box [name=password]').val();
        if (value !== pwd) {
            return "两次密码不一致！"
        }
    }
})

// 监听注册区域的表单事件
$('#reg_form').on('submit', function (e) {
    e.preventDefault();
    var data = {
        username: $('#reg_form [name=username]').val(),
        password: $('#reg_form [name=password]').val()
    };
    $.post('/api/reguser', data, function (res) {
        if (res.status !== 0) {
            return layer.msg(res.message);
        }
        layer.msg('注册成功！！！');

        // 模拟人的点击登录事件
        $('#reg_a').click();
    })
})

// 监听登录表单的表单事件
$('#login_form').submit(function(e){
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
        url:'/api/login',
        method:'POST',
        data:$(this).serialize(),
        success:function(res){
            // console.log(res);
            if(res.status!==0){
                return layer.msg(res.message)
            }
            layer.msg('登录成功！')
            // 将登录成功得到的token保存到localstorage中
            localStorage.setItem('token',res.token);
            // 跳转到index.html页面
            location.href = 'index.html';
        }
        
    })
})