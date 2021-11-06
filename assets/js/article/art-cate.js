$(function(){
    var layer = layui.layer;
    var form = layui.form;
    // 初始化文章列表
    initArticleList();

    function initArticleList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status === 1){
                    return layui.layer.msg('获取文章列表失败！')
                }
                //console.log(res);
                // 使用模板引擎初始化
                var htmlstr = template('tpl_table',res);
                $('tbody').html(htmlstr);
            }
        })
    }

    var indexAdd = null;
    // 给添加按钮绑定事件
    $('#btnAddArticleCate').on('click',function(){
       indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#layerOutAdd').html()
          });   
    })

    // 通过代理的形式给表单绑定submit事件
    $('body').on('submit','#formAdd',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('新增文章分类失败！');
                }
                initArticleList();
                layer.msg('新增文章分类成功！')
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    //通过代理给修改按钮绑定事件
    var indexEdit = null;
     $('tbody').on('click','.btnAticleEdit',function(){
        //  设置弹出层
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#layerOutEdit').html()
          });  
          
        // 填充表单数据
        // 根据 Id 获取文章分类数据
        var id = $(this).attr('data-id');
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
               form.val('formEditData',res.data);
            }
        })

        //使用代理方法实现修改表单绑定事件行为 
        $('body').on('submit','#formEdit',function(e){
            e.preventDefault();
            $.ajax({
                method:'POST',
                url:'/my/article/updatecate',
                data:$(this).serialize(),
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('文章分类更新失败！');
                    }
                    layer.msg('文章分类更新成功！');
                    layer.close(indexEdit);
                    initArticleList();
                }
            })
        })
     })

     //通过代理给删除按钮绑定事件
     $('body').on('click','.btnAticleDel',function(){
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 获取id
            var id = $(this).attr('data-id');
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    console.log(res);
                    if(res.status !==0){
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    initArticleList();
                    layer.close(index);
                }
            })    
          });
     })
})