/* 
 * @Author wanght
 * @Mail whtoo@qq.com
 * @Lisense Mit
 * @Date 2014-08-26
 * @Dependency JqReactiveExt 0.1.0
 * @Version 0.1.0
 */
 (function(root) {
                var rx = function() {
                    var self = this;
                    this.opts = {name:'name',val:'val'};
                    /**
                     * dataBinder must match
                     * [
                     *   {'name':'',//显示名称
                     *   'val':'',//option的value
                     *   'childs':[{
                     *      'name':'',
                     *      'val':'',
                     *      'childs':[
                     *          ..
                     *      ]}..
                     *   ]}...
                     * ]
                     * */
                    this.build = function(domSelectors, dataBinder,mapper) {
                        self.opts = mapper || self.opts;
                        if (domSelectors === undefined) {
                            var e = new Error();
                            e.message = "构造参数domSelectors不可为空";
                            throw e;
                        }
                        else if (dataBinder === undefined) {
                            var e = new Error();
                            e.message = "构造参数dataBinder不可为空";
                            throw e;
                        }

                        var len = domSelectors.length;
                      
                        var $dom0 = $('#' + domSelectors[0].domId);
                        self.buildWithSelectDom($dom0,dataBinder);
                        for (var idx = 0; idx < len; idx++) {
                        var cur = idx;
                       
                        
                        (function(curPtr){  
                            
                            var curIdx = curPtr;
                            var curMeta = domSelectors[curIdx];
                            var curDomId = curMeta.domId;
                            var curDomName = curMeta.domName;
                            var curMark = curDomName;
                            var prev = curIdx > 0 ? (curIdx - 1) : 0;
                           
                            var prevMeta = domSelectors[prev];
                            var prevDomName = prevMeta.domName;
                            var prevMark = prevDomName;
                            var $domCur = $('#' + curDomId);
                            
                            $domCur.reactiveSelect().connectRx(
                                    {targets: [curMark], func: function(data) {

                                    self.selectedCtx = self.selectedCtx.slice(0,curPtr) || [];
                                     var selectedVal = data[curMark];
                                     var selectedNode = undefined;
                                     if(curIdx > 0){
                                      selectedNode = _.find(self.selectedCtx[prev].childs,function(item){
						return (item[self.opts.val] === selectedVal);
                                      });
                                    }
                                    else if(curIdx === 0){
                                         selectedNode = _.find(dataBinder,function(item){
						return (item[self.opts.val] === selectedVal);
                                      });
                                        
                                    }
                                        
                                     if(selectedNode !== undefined){
                                         self.selectedCtx.push(selectedNode);       
                                     }
                            }});
                            
                            if (curIdx > 0) {
                                //若不是第一个，都向前观察自己的前一个
                                //若前一个发生变化，就修改自己
                                $domCur.connectRx(
                                        {targets: [prevMark], func: function(data) {
                                         var changeData = data[prevMark];
                                         self.buildWithSelectDom($domCur, self.selectedCtx[prev].childs);
                                            
                                 }});
                            }
                        })(cur);
                            
                        }
                      
                    };

                    this.buildWithSelectDom = function(domJq, dataSource, selectedVal) {
                        domJq.empty();
                        var len = dataSource.length;
                        var cacIdx = 0;
                        var seekVal = "";
                        for (var idx = 0; idx < len; idx++) {
                            var item = dataSource[idx];
                            
                            var $option = $("<option></option>");
                            $option.val(item[self.opts.val]);
                            $option.html(item[self.opts.name]);
                            cacIdx++;

                            if (selectedVal === undefined && cacIdx === 1) {
                                self.selectedCtx.push(item);
                                seekVal = item.val;
                            }

                            else if (selectedVal !== undefined) {
                                if (item.val === selectedVal) {
                                    self.selectedCtx.push(item);
                                    seekVal = item.val;
                                }
                            }

                            domJq.append($option);
                        }

                        if (cacIdx === 0) {
                            var $option = $("<option></option>");
                            $option.val("");
                            $option.html("");
                            seekVal = "";
                            $option.attr('selected', true);
                            domJq.append($option);
                        }

                        domJq.find("[value='" + seekVal + "']").attr('selected', true);
                        function lazyTrigger(){
                            domJq.trigger('change');
                        }
                        setTimeout(lazyTrigger,50);
                        
                    };


                    this.selectedCtx = this.selectedCtx || [];
                };
                
                root.rxselectBuilder = root.rxselectBuilder || new rx();
            })(window);

            var Binder = function(name, val, childs) {
                this.vName = name || '';
                this.pid = val || '';
                this.childs = childs || [];

                this.add = function(binder) {
                    this.childs.push(binder);
                };
            };

