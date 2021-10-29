$(function () {
    // 获取form
    var form = layui.form;
    // 使用form的verify制定验证规则
    form.verify({
        psw: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        same: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码必须不一致！'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码不一致！'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败!');
                }
                layui.layer.msg('密码更新成功！')
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })

})