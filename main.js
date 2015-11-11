$(function(){
    Vue.use(Vue_dnd);
    Vue.config.debug = true;
    var db = {
        set:function(a,n){
            var data = this.get()||{};
            data[n] = a;
            window.localStorage.setItem('data',JSON.stringify(data));
        },
        get:function(n){
            var data = window.localStorage.getItem('data');
            if(!data)return null;
            var all = JSON.parse(data);
            return n?all[n]:all;
        }
    }
    function regModule($el,type){
        var name = $el.attr('name')||"";
        var html = $el.html();
        Vue.partial((type||"")+"-"+name,html);
    }
    function getJsonModule(type){
        return $.extend(true,{},jsonModuleObj[type]);
    }
    function getMainHtml(){
        return $('._display').html().replace(/\ {4}/g,"").replace(/\n{1,5}/g,"\n")
    }
    function getTemplate(){
        var _ = {};
        $("#template>div").each(function(){
            _[$(this).attr('name')] = $(this).html();
        })
        return _;
    }
    function buildTemplate(type,mainHtml){
        var template = templateHtmlArr[type];
        return template.replace(/{{main}}/,mainHtml);
    }
    function onListChange(){
        if(timeout){
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(function(){
            db.set(vm.$data.list,1);
            vm.$data.html = buildTemplate(vm.$data.templateCurrent,getMainHtml());
        },10);
    }
    $('#panel_module>.module').each(function(){
        regModule( $(this), 'panel' );
    });
    $('#display_module>.module').each(function(){
        regModule( $(this), 'display' );
    });
    var jsonModuleObj = {};
    JSON_MODULE.forEach(function(m){
        jsonModuleObj[m.type] = m;
    });
    var templateHtmlArr = getTemplate();
    var templateNameArr = $('#template [name]').map(function(){return $(this).attr('name')}).get();
    var timeout;
    var vm = new Vue({
        el:'#vue',
        data:{
            list:db.get(1)||[],
            html:"",
            tab:0,
            JSON_MODULE:JSON_MODULE,
            template:templateNameArr,
            templateCurrent:templateNameArr[0],
            fontsize:[12,14,16,18,20,22,24,26,30,34,38,42],
            padding:[12,14,16,18,20,24,28]
        },
        methods:{
            sort: function(list, id, tag, data) {
                var tmp = list[data.index];
                list.splice(data.index, 1);
                list.splice(id, 0, tmp);
            },
            json:function(o){
                return JSON.stringify(o,null, 2);
            },
            save:function(i){
                !i&&alert('选一下存哪');
                i&&db.set(vm.$data.list,i);
            },
            restore:function(i){
                !i&&alert('选一下取谁');
                i&&(vm.$data.list = db.get(i)||[])
            },
            add:function(type){
                jsonModuleObj[type] && vm.$data.list.push(getJsonModule(type));
            },
            del:function(i){
                vm.$data.list.splice(i,1);
            },
            replace:function(all,find,to){
                return all.replace(find,to);
            },
            clearAll:function(){
                vm.$data.list = [];
            },
            getStyle:function(o){
                if(!o)return "";
                var _ = "";
                $.each(o,function(k,v){
                    switch(typeof v){
                        case 'boolean':
                            if(v){
                                _ += k;
                            }
                            break;
                        case 'number':
                        case 'string':
                            if(v){
                                _ += k.replace(/\$\$v\$\$/g,v);
                            }
                            break;
                        default:

                    }
                })
                return _;
            },
            passage:function(item){
                function getLink(href,text,color){
                    return "<a href='"+href+"' target='_blank' style='color:"+color+"'  >"+(text||href)+"</a>";
                }
                var str = getLink(item.linkhref,item.linktext,item.linkcolor);
                return item.value.replace(/{a}/g,str).replace(/\n/g,"<br/>");
            },
            chooseTemplate:function(i){
                vm.$data.templateCurrent = i;
                onListChange();
            }
        }
    })
    vm.$watch(function(){
        return JSON.stringify(vm.$data.list);
    },onListChange);
    onListChange();
})