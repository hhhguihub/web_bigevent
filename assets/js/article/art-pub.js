$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initSelect();
    // 初始化富文本编辑器
    initEditor()

    // 初始化下拉选择框
    function initSelect() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                //console.log(res);
                var htmlStr = template('tql_select', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给封面按钮绑定隐藏文件点击事件
    $('#chooseImgBtn').on('click', function () {
        $('#coverFile').click();
    })

    // 监听file的change事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 设置文章默认状态为发布
    var state = '已发布';
    $('#btn_save').on('click', function () {
        state = '草稿';
    })

    // 阻止表单的默认提交行为并创建formdata类型数据
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单快速创建一个formdata对象
        var fd = new FormData($(this)[0]);
        // 将文章的发布状态存到fd中
        fd.append('state', state);
        // 将裁剪的图片输出为文件并添加到fd中
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
               fd.append('cover_img',blob);
            })
            // fd.forEach((v,k)=>{
            //     console.log(k,v);
            // })
        // 调用方法发起AJAX请求
            sendArticle(fd);
    })

    function sendArticle(fd){
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = 'art-list.html'
            }
        })
    }
})