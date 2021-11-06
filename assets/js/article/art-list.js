$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个查询参数对象q，将来请求数据时，将q发送到服务器
    var q = {
        pagenum: 1, //页码值，默认为1
        pagesize: 2, //每页显示多少条数据，默认为2
        cate_id: '', //文章分类的id
        status: '' //文章的状态
    }

    // 定义时间美化过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '-' + ' ' + hh + ':'
                + mm + ':' + ss;

    }

    // 定义补零函数
    function padZero(n){
        return n>9?n:'0'+n;
    }

    initArticleTable();

    // 初始化表格数据
    function initArticleTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
               //console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取文章列表数据失败！');
                }               
                // 用模板引擎渲染数据
                var htmlStr = template('tql_table',res);
                $('tbody').html(htmlStr);
                // 调用渲染分类的方法
                renderPage(res.total);
            }
        })
    }

    initCate();

    // 初始化文章分类可选项
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取文章分类失败！');
                }
                var htmlStr = template('tql_cate',res);
               //console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 给筛选表单的submit绑定事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        // 获取表单中的筛选数据
        var cate_id = $('[name=cate_id]').val();
        var status = $('[name=status]').val();
        // 把表单的筛选数据赋值给q
        q.cate_id = cate_id;
        q.status = status;
        // 重新初始化文章列表
       // console.log(q);
        initArticleTable();
    })

    // 定义渲染分页的方法
    function renderPage(total){
      //  console.log(total);
    //   调用laypage.render方法来渲染分页结构
      laypage.render({
        elem: 'pageBox', //注意，这里的是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit: q.pagesize,
        curr: q.pagenum,
        layout:['count','limit','prev','page','next','skip'],
        limits:[2,3,5,10],
        //1. 当分页发生切换时，会调用jump回调,first == undefined
        //2. 当调用render方法时，也会调用jump回调,first==true
        jump:function(obj,first){
            // 将最新的当前页码赋值给q.pagenum
            console.log(obj.curr);
            q.pagenum = obj.curr;
            q.pagesize = obj.pagesize;
            if(!first){
                initArticleTable();
            }
            
        }
      });
    }

    // 通过代理方式为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn_delete',function(){
        var id = $(this).attr('data-id');
        // 获取页面的按钮个数
        var btns = $('.btn_delete');
        var len = btns.length;
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('文章删除失败！');
                    }
                    layer.msg('文章删除成功！');
                    if(len ===1){
                        // 注意页码值最小为1
                        q.pagenum = q.pagenum === 1?1:q.pagenum - 1;
                    }
                    initArticleTable();
                }
            })
            layer.close(index);
          });
    })
})