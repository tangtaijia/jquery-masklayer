/*
 *   Mask layer - jQuery plugin for shade window or element
 *
 *   Copyright (c) 2014 Allen Tang
 *
 * 	 Includes jquery.ui.position.js
 * 	 https://code.google.com/p/jquery-ui/
 *   Apache License
 *   Version 2.0, January 2004
 *   http://www.apache.org/licenses/
 *
 * Revision: $Id: jquery.masklayer.js 1.1 2014-11-15 23:15:10 $
 *
 */
(function($) {
	/*遮罩层*/
	$.extend({
		masklayer : {
			settings: {
				shade_content_fonts_class : 'shade_content_fonts',
			} ,
			init:function (data){
				var target = this;
				/*初始化data*/
				var config = {
					box : document,
					msg : 'waiting...',
					size : {
						width : $(document).width() + "px",
						height : $(document).height() + "px"
					},
					sec2hide : 0 ,
					self : false
				};
				data = $.extend(config, data);
				// guarantee data size`s width and height both to have values
				data.size.width = data.size.width ? data.size.width : $(config.box).width();
				data.size.height = data.size.height ? data.size.height : $(config.box).height();
				/*背景串*/
				var shade_content_background_str = '<div class="shade_content_background" class="shade_content_background" style="display: none; "></div>';
				/*文字串*/
				var shade_content_fonts_str = '';
				var shade_img = '';
				if(data.self) {
					shade_img = '<img src="tiny-loader.gif" />';
				} else {
					shade_content_fonts_str = '<div class="' + target.settings.shade_content_fonts_class + '" style="display: none; ">' + data.msg + '</div>';		
				}			

				/*计算长宽*/
				if(/%$/.test(data.size.width.toString())) {
					if(parseFloat(data.size.width) > 100) {
						data.size.width = $(data.box).width();
					} else {
						data.size.width = $(data.box).width()*parseFloat(data.size.width)/100;
					}
				} else {
					data.size.width = parseFloat(data.size.width.toString());
				}
				if(/%$/.test(data.size.width.toString())) {
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
					data.parent_container = $("<div class='shadeDiv' style='width:"+data.size.width+"px;height:"+data.size.height+"px;position:absolute;display: none;'></div>").appendTo(document.body);
					$(data.parent_container).append(shade_content_background_str);
					if(data.self) {
						$(data.parent_container).append(shade_img);
					} else {
						$(data.parent_container).append(shade_content_fonts_str);
					}
					
					/*计算遮罩层位置 document的话按照css文件*/
					$('.shade_content_background').css('height',$(data.parent_container).height());
				} else {
					if($(data.box).length>0) {
						var shadeDivEl;
						var shade_content_fonts_el;
						var shade_img_el;
						$(data.box).each(function(index,domEl) {
							if(data.size.height >= $(domEl).height()) 
								data.size.height = $(domEl).height();
							if(data.size.width >= $(domEl).width()) 
								data.size.width = $(domEl).width();
							data.parent_container = $("<div class='shadeDiv' style='width:"+data.size.width+"px;height:"+data.size.height+"px;position:absolute;display: none;'></div>").appendTo($(domEl));
							/*计算遮罩层位置 document的话按照css文件*/
							shadeDivEl = $(domEl).find(".shadeDiv");//遮罩层
							shadeDivEl.append(shade_content_background_str);
							shadeDivEl.find('.shade_content_background').css('height',shadeDivEl.height());
							shadeDivEl.css({
								"left":parseFloat($(domEl).position().left)+parseFloat($(domEl).css("margin-left")),
								"top":parseFloat($(domEl).position().top)+parseFloat($(domEl).css("margin-top"))
							});
							if(data.self) {								
								shadeDivEl.append(shade_img);
								shade_img_el = shadeDivEl.find("img");
								shade_img_el.position({
								    my:        "center top",
								    at:        "left bottom",
								    of:        shadeDivEl, 
								    collision: "fit"
								});
							} else {					
								shadeDivEl.append(shade_content_fonts_str);
								shade_content_fonts_el = shadeDivEl.find("." + target.settings.shade_content_fonts_class);//遮罩文字
								
								var marginTopEl = shadeDivEl.height()/2-(shade_content_fonts_el.height()+20)/2;
								shade_content_fonts_el.css({
									"position":'relative',
									"margin-top":marginTopEl+"px"
								});
							}
							
						});
					}
				}
				
				/*显示*/
				target.show();
				
				/*移除*/
				if(data.sec2hide > 0) {
					setTimeout(function() {target.remove();},data.sec2hide*1000);
				}
			},
			show : function() {
				if($(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).length) {
					$(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).show();
				}
			},
			hide : function() {
				if($(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).length) {
					$(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).hide();
				}
			},
			remove : function() {
				if($(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).length) {
					$(".shadeDiv,.shade_content_background,." + this.settings.shade_content_fonts_class ).remove();
				}
			}
		}
	});

	$.fn.masklayer = function( opts={} ){
		opts.box = this[0];
		opts.self = true;
  		$.masklayer.init(opts);
  	};

	//////////////////////////////////////////////
	// the codes below are jquery.ui.position.js//
	//////////////////////////////////////////////
  	$.ui = $.ui || {};

	var horizontalPositions = /left|center|right/,
        horizontalDefault = "center",
        verticalPositions = /top|center|bottom/,
        verticalDefault = "center",
        _position = $.fn.position,
        _offset = $.fn.offset;

	$.fn.position = function( options ) {
        if ( !options || !options.of ) {
            return _position.apply( this, arguments );
        }

        // make a copy, we don't want to modify arguments
        options = $.extend( {}, options );

        var target = $( options.of ),
            collision = ( options.collision || "flip" ).split( " " ),
            offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
            targetWidth,
            targetHeight,
            basePosition;

        if ( options.of.nodeType === 9 ) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: 0, left: 0 };
        } else if ( options.of.scrollTo && options.of.document ) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
        } else if ( options.of.preventDefault ) {
            // force left top to allow flipping
            options.at = "left top";
            targetWidth = targetHeight = 0;
            basePosition = { top: options.of.pageY, left: options.of.pageX };
        } else {
            targetWidth = target.outerWidth();
            targetHeight = target.outerHeight();
            basePosition = target.offset();
        }

        // force my and at to have valid horizontal and veritcal positions
        // if a value is missing or invalid, it will be converted to center 
        $.each( [ "my", "at" ], function() {
                var pos = ( options[this] || "" ).split( " " );
            if ( pos.length === 1) {
                pos = horizontalPositions.test( pos[0] ) ?
                    pos.concat( [verticalDefault] ) :
                    verticalPositions.test( pos[0] ) ?
                        [ horizontalDefault ].concat( pos ) :
                        [ horizontalDefault, verticalDefault ];
            }
            pos[ 0 ] = horizontalPositions.test( pos[0] ) ? pos[ 0 ] : horizontalDefault;
            pos[ 1 ] = verticalPositions.test( pos[1] ) ? pos[ 1 ] : verticalDefault;
            options[ this ] = pos;
        });

        // normalize collision option
        if ( collision.length === 1 ) {
            collision[ 1 ] = collision[ 0 ];
        }

        // normalize offset option
        offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
        if ( offset.length === 1 ) {
            offset[ 1 ] = offset[ 0 ];
        }
        offset[ 1 ] = parseInt( offset[1], 10 ) || 0;

        if ( options.at[0] === "right" ) {
            basePosition.left += targetWidth;
        } else if (options.at[0] === horizontalDefault ) {
            basePosition.left += targetWidth / 2;
        }

        if ( options.at[1] === "bottom" ) {
            basePosition.top += targetHeight;
        } else if ( options.at[1] === verticalDefault ) {
            basePosition.top += targetHeight / 2;
        }

        basePosition.left += offset[ 0 ];
        basePosition.top += offset[ 1 ];

        return this.each(function() {
            var elem = $( this ),
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                position = $.extend( {}, basePosition );

            if ( options.my[0] === "right" ) {
                position.left -= elemWidth;
            } else if ( options.my[0] === horizontalDefault ) {
                position.left -= elemWidth / 2;
            }

            if ( options.my[1] === "bottom" ) {
                position.top -= elemHeight;
            } else if ( options.my[1] === verticalDefault ) {
                position.top -= elemHeight / 2;
            }

            $.each( [ "left", "top" ], function( i, dir ) {
                if ( $.ui.position[ collision[i] ] ) {
                    $.ui.position[ collision[i] ][ dir ]( position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        offset: offset,
                        my: options.my,
                        at: options.at
                    });
                }
            });

            if ( $.fn.bgiframe ) {
                elem.bgiframe();
            }
            elem.offset( $.extend( position, { using: options.using } ) );
        });
	};

	$.ui.position = {
        fit: {
            left: function( position, data ) {
                var win = $( window ),
                over = position.left + data.elemWidth - win.width() - win.scrollLeft();
                position.left = over > 0 ? position.left - over : Math.max( 0, position.left );
            },
            top: function( position, data ) {
                var win = $( window ),
                over = position.top + data.elemHeight - win.height() - win.scrollTop();
                position.top = over > 0 ? position.top - over : Math.max( 0, position.top );
            }
        },

        flip: {
            left: function( position, data ) {
                if ( data.at[0] === "center" ) {
                    return;
                }
                var win = $( window ),
                over = position.left + data.elemWidth - win.width() - win.scrollLeft(),
                myOffset = data.my[ 0 ] === "left" ?-data.elemWidth :
                                        data.my[ 0 ] === "right" ?
                                        data.elemWidth : 0,
        		offset = -2 * data.offset[ 0 ];
                position.left += position.left < 0 ?
                myOffset + data.targetWidth + offset : over > 0 ?
                                    		myOffset - data.targetWidth + offset : 0;
            },
            top: function( position, data ) {
                if ( data.at[1] === "center" ) {
                    return;
                }
                var win = $( window ),
                over = position.top + data.elemHeight - win.height() - win.scrollTop(),
                    					myOffset = data.my[ 1 ] === "top" ? -data.elemHeight :
                                        data.my[ 1 ] === "bottom" ? data.elemHeight : 0,
                atOffset = data.at[ 1 ] === "top" ? data.targetHeight : -data.targetHeight,
                offset = -2 * data.offset[ 1 ];
                position.top += position.top < 0 ? myOffset + data.targetHeight + offset :
                                over > 0 ? myOffset + atOffset + offset : 0;
            }
        }
	};

	// offset setter from jQuery 1.4
	if ( !$.offset.setOffset ) {
	    $.offset.setOffset = function( elem, options ) {
	        // set position first, in-case top/left are set even on static elem
	        if ( /static/.test( $.curCSS( elem, "position" ) ) ) {
	            elem.style.position = "relative";
	        }
	        var curElem   = $( elem ),
	            curOffset = curElem.offset(),
	            curTop    = parseInt( $.curCSS( elem, "top",  true ), 10 ) || 0,
	            curLeft   = parseInt( $.curCSS( elem, "left", true ), 10)  || 0,
	            props     = {
	                        	top:  (options.top  - curOffset.top)  + curTop,
	                        	left: (options.left - curOffset.left) + curLeft
	                        };
	                
	            if ( 'using' in options ) {
	                options.using.call( elem, props );
	            } else {
	                curElem.css( props );
	            }
	        };

	        $.fn.offset = function( options ) {
	            var elem = this[ 0 ];
	            if ( !elem || !elem.ownerDocument ) { return null; }
	            if ( options ) { 
	                return this.each(function() {
	                    $.offset.setOffset( this, options );
	                });
	            }
	        	return _offset.call( this );
	        };
	}
})(jQuery);