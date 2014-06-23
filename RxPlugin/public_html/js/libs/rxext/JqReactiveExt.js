/* 
 * @Author wanght
 * @Mail whtoo@qq.com
 * @Lisense Mit
 * @Date 2014-06-23
 * @Dependency jQuery 1.7.0+
 */
(function($){
    var topics = {};
    $.Topic = function(id) {
        var callbacks,
                topic = id && topics[ id ];
        if (!topic) {
            callbacks = jQuery.Callbacks();
            topic = {
                publish: callbacks.fire, 
                subscribe: callbacks.add, 
                unsubscribe: callbacks.remove
            };
            if (id) {
                topics[ id ] = topic;
            }
        }
        return topic;
    };
    $.Topic.retTopics = function(){
        return topics;
    };
    $.printObj = function(name,val){
        if(console && console.log){
            console.log('print name at '+name+" val "+val);  
        }
    };
    
})(jQuery);

(function($) {
    $.TopicSeq = 101;
 
    $.fn.connectRx = function(options) {
        var me = $(this);//指向调用此扩展方法的jquery对象化的select元素
        var opts = jQuery.extend({}, {}, options);
        
        //{'sourceKey':parentId,'name':selfName,"changeVal":selectedVal}
        $.Topic(opts.target).subscribe(opts.func);
        return me;
    };

    $.fn.connectRx.defaults = {
        target: '',
        func: function(data) {
            console.log("connectRx options "+data);
        }
    };


    $.fn.selectBuild = function(options){
        var me = $(this);//指向调用此扩展方法的jquery对象化的select元素
        var ds = options.dataSource || {};
        var selectedVal = options.selectedVal || me.find('option:selected').val() || '';
        me.empty();
        for (var item in ds) {
            var optJq = $('<option></option>');
            var val = ds[item];
            optJq.val(val);
            optJq.html(item);
            me.append(optJq);
        }
        me.find("option[value='" + selectedVal + "']").attr('selected', true);
        return me;
    };
    
    $.fn.clearRXBinder = function(){
        var me = $(this);//指向调用此扩展方法的jquery对象化的select元素
        var selfName = me.attr('name') || 'error';
        me.unbind('change');
        delete $.Topic.retTopics()[selfName];
    };
    
    $.fn.reactiveSelect = function(options) {
        
        var me = $(this);//指向调用此扩展方法的jquery对象化的select元素
        var selfName = me.attr('name') || 'select' + parseInt(Math.random()  * 100 + Math.random() * 10);

        var opts = jQuery.extend({}, $.fn.reactiveSelect.defaults, options);
        var parentId = opts.hashKey || '';
        
        function init() {
            if(me.is('select')){
                console.log(me);
            }
             me.bind('change', function() {
               var selectedVal = me.find('option:selected').val();
                //{'sourceKey':parentId,'name':selfName,"changeVal":selectedVal}
                var data = {'sourceKey': parentId, 'name': selfName, "changeVal": selectedVal};
                 $.Topic.retTopics()[data.name].publish(data);
               
            });
             return me;
        }
       
      
      
      return  init();
    };

    $.fn.reactiveSelect.defaults = {
     
        haskKey: '',
        name: ''
    };

    $.fn.reactiveInput = function(options) {
        var opts = jQuery.extend({},$.fn.reactiveInput.defaults,options);
        var me = $(this);
           
        function init(){
            
            return me;
        };
        
      return  init();
    };
    $.fn.reactiveInput.defaults = {
        dataSource: {}, //数据源
        update: false, //是否立即通过dataSource刷新select
        haskKey: '',
        name: ''
    };
    $.fn.reactiveCheckBox = function(options) {
        var opts = jQuery.extend({}, $.fn.reactiveCheckBox.defaults, options);
        var me = $(this);//指向调用此扩展方法的jquery对象化的input元素
        var reactiveCheckBox = "reactiveCheckBox";
        var publicInterface = $.fn.reactiveCheckBox = $.fn[reactiveCheckBox];
        var parentId = opts.hashKey || '';
        function init(){
            me.attr('checked',opts.isChecked);
            if ($.browser.msie) {
                $('input:checkbox').click(function() {
                    this.blur();
                    this.focus();
                });
            };
            
            me.change(function() {
                var data = {};
                
                if(me.is(":checked")){
                   data = {'sourceKey':parentId,'name':selfName,"changeVal":1};
                }
                else{
                   data = {'sourceKey':parentId,'name':selfName,"changeVal":0};    
                }
                
                $.Topic[data.name].publish(data);
            }); 
            
            return me;
        }
        
        publicInterface.clearBind = function(){
            me.unbind('click');
            me.unbind('change');
        };
        
       return  init();
    };

    $.fn.reactiveCheckBox.defaults = {
        isChecked: false,
        hashKey: '',
        name: ''
    };

})(jQuery);
