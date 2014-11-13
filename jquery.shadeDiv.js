/**
 * 字符串以s开始
 * @param s
 * @returns {Boolean}
 */
String.prototype.startWith = function(s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length) 
    	return false;
    if (this.substr(0, s.length) == s) 
    	return true;
    else 
    	return false;
};

/**
 * 字符串以s结束
 * @param s
 * @returns {Boolean}
 */
String.prototype.endWith = function(s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length) 
    	return false;
    if (this.substring(this.length - s.length) == s) 
    	return true;
    else 
    	return false;
};

/*遮罩层*/
shadeDiv = $.extend({
	init:function (data){
		/*初始化data*/
		var config = {
			box : document,
			msg : 'waiting......',
			size : {
				width : $(document).width() + "px",
				height : $(document).height() + "px"
			},
			secTohide : "none"
		};
		data = $.extend(config, data);		
		/*背景串*/
		var plugin_background_str = '<div id="plugin_background" class="plugin_background" style="display: none; "></div>';
		/*文字串*/
		var plugin_wait_str = '<div id="plugin_wait" class="plugin_wait" style="display: none; ">' + data.msg + '</div>';		
		/*计算长宽*/
		if(data.size.width.toString().endWith("%")) {
			if(parseFloat(data.size.width) > 100) {
				data.size.width = $(data.box).width();
			} else {
				data.size.width = $(data.box).width()*parseFloat(data.size.width)/100;
			}
		} else {
			data.size.width = parseFloat(data.size.width.toString());
		}
		if(data.size.height.toString().endWith("%")) {
			if(parseFloat(data.size.height) > 100) {
				data.size.height = $(data.box).height();
			} else {
				data.size.height = $(data.box).height()*parseFloat(data.size.height)/100;
			}
		} else {
			data.size.height = parseFloat(data.size.height.toString());
		}
		
		/*初始化遮罩层*/
		if(document == data.box) {
			data.parent_container = $("<div id='shadeDiv' style='width:"+data.size.width+"px;height:"+data.size.height+"px;position:absolute;display: none;'></div>").appendTo(document.body);
		} else {
			if($(data.box).size()>0) {
				$(data.box).each(function(index,domEl) {
					data.size.height = $(domEl).height();
					data.size.width = $(domEl).width();
					data.parent_container = $("<div id='shadeDiv' style='width:"+data.size.width+"px;height:"+data.size.height+"px;position:absolute;display: none;'></div>").appendTo($(domEl));
				});
			}
		}
		
		/*计算遮罩层位置 document的话按照css文件*/
		if(document != data.box) {
			if($(data.box).size()>0) {
				var shadeDivEl;
				var plugin_wait_el;
				$(data.box).each(function(index,domEl) {
					shadeDivEl = $(domEl).find("[id=shadeDiv]");//遮罩层
					shadeDivEl.append(plugin_background_str);
					shadeDivEl.append(plugin_wait_str);
					plugin_wait_el = shadeDivEl.find("[id='plugin_wait']");//遮罩文字
					shadeDivEl.find('#plugin_background').css('height',shadeDivEl.height());
					shadeDivEl.css({
						"left":parseFloat($(domEl).position().left)+parseFloat($(domEl).css("margin-left")),
						"top":parseFloat($(domEl).position().top)+parseFloat($(domEl).css("margin-top"))
					});
					var marginTopEl = shadeDivEl.height()/2-(plugin_wait_el.height()+20)/2;
					plugin_wait_el.css({
						"position":'absolute',
						"margin-top":marginTopEl+"px"
					});
				});
			}
		} else {
			$(data.parent_container).append(plugin_background_str);
			$(data.parent_container).append(plugin_wait_str);
			$('#plugin_background').css('height',$(data.parent_container).height());
		}
		
		var waiting = $("#shadeDiv,#plugin_background,#plugin_wait");
		/*显示*/
		waiting.show();
		
		/*移除*/
		if("none" != data.secTohide && data.secTohide > 0) {
			setTimeout('shadeDiv.hide()',data.secTohide*1000);
		}
	},
	show : function() {
		$("#shadeDiv,#plugin_background,#plugin_wait").show();
	},
	hide : function() {
		$("#shadeDiv,#plugin_background,#plugin_wait").hide();
		$("#shadeDiv,#plugin_background,#plugin_wait").remove();
	}
});

