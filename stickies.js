/*
 * jQuery Stickies v.0.1 plugin
 * Copyright (c) 2014 Vasilij Olhov
 * Dual licensed under the MIT and GPL licenses
*/

$.fn.stickies = function(params) {

    // default settings
    var options = $.extend({
                              url_get    : './',
                              url_add    : './add',
                              url_edit   : './edit',
                              url_remove : './remove',
                              params: {},
                              height: 300
                           },
                           params );

    var DragObject = {};



    // AJAX: execute request
    _getStickies = function() { _doRequest( "get", {} ); }
    _addSticky = function( data ) { _doRequest( "add", data ); };
    _editSticky = function( data ) { _doRequest( "edit", data ); };
    _removeSticky = function( data ) { _doRequest( "remove", data ); };

    _doRequest = function(request, data ) {
        data = $.extend(data, options.params);
        $.ajax({
                 type:        ((request=="get") ? "GET" : "POST"),
                 url:         options['url_'+request],
                 dataType:    "json",
                 data:        data,
                 success:     function(json) {                  				  if (json.success) {
                                      RequestHandler[request].call( $(document), json.data );
                                  }
                 },
                 error :	  function() {}
        });
    };


    // AJAX: handle responses from server
    var RequestHandler = {
        get: function( data ) {
                for(var i=0; i<data.length; i++) {
                    $('html > body').append( _buildSticky( data[i] ) );
                }
        },
        add: function( data ) { $('html > body').append( _buildSticky( data ) ); },
        edit: function( data ) { /* visually do nothitng */ },
        remove: function( data ) {  /* visually do nothitng */ }
    };


    // BUILD
    _setStickyCreationPanel = function() {		var one = '<div class="stickies-creation-panel" style="z-index:'+parseInt(options.height-1)+'"><div class="x-create"></div></div>';
    	$('html > body').append(one);    }

    _buildSticky = function( o ) {
    	var res = '<div class="stickies-container" style="left:'+o.pos_x+'px; top:'+o.pos_y+'px;" id="x-sticky-'+o.id+'">'+
        		    '<div class="stickies-remove-icon"></div>'+
        		    '<textarea>'+o.text+'</textarea>'+
        		  '</div>';
    	return res;
    }



    // ACTIONS
    $('div.stickies-container')
        .live('mousedown', function(event) {        	$('div.stickies-container').css('z-index', options.height);
        	$(this).css('z-index', parseInt(options.height+1) );

        	if ( !($(event.target).is($(this)))) { return; } // disable this event for textarea and icons
            var stickyPosition = $(this).offset();
            DragObject = {
            				id: $(this).attr('id'),
                            offset_x: (event.pageX - stickyPosition.left),
                            offset_y: (event.pageY - stickyPosition.top)
            };
        })
        .live('mouseup', function(event) {
        	if ( !($(event.target).is($(this)))) { return; } // disable this event for textarea and icons
        	if ( !($.isEmptyObject(DragObject)) ) { // handle new position        		var stickyPosition = $(this).offset();
        		_editSticky({
        					  id: DragObject.id.replace(/x\-sticky\-/,''),
        					  pos_x: stickyPosition.left,
        					  pos_y: stickyPosition.top
        		});        	};
        	DragObject = {};
        })
        .live('mouseenter', function(event) { // show icons
        	$(this).find('div.stickies-remove-icon').first().show();
        })
        .live('mouseleave', function(event) { // hide icons
            $(this).find('div.stickies-remove-icon').first().hide();
        });


    // ACTION: text in sticker is changed
    $('div.stickies-container textarea')
    	.live('change', function(event) {
      		_editSticky({
        					id: 	$(this).parent('div.stickies-container').attr('id').replace(/x\-sticky\-/,''),
        					text: 	$(this).val()
       		});
    });

    // ACTION: remove sticky
    $('div.stickies-container div.stickies-remove-icon')
    	.live('click', function(event) {
      		var obj = $(this).parent('div.stickies-container');
      		_removeSticky( {id:obj.attr('id').replace(/x\-sticky\-/,'')} );
     		obj.remove();
    });


    // ACTION: drag
    $(document).live('mousemove', function(event) {
    	// show creation panel if mouse is in right side
    	if ( (event.pageX+36) > $(window).width() ) {    		var cp = $('div.stickies-creation-panel');
    		if ( !(cp.is(':visible')) ) {    			cp.fadeIn(250);    		}
    	}

    	if ( $.isEmptyObject(DragObject) ) return this;

    	var obj = $('div#'+DragObject.id+'.stickies-container');
    	obj.css('left', parseInt( event.pageX - DragObject.offset_x ) )
    	   .css('top', parseInt( event.pageY - DragObject.offset_y ) );
    });

	// hide sticky panel, when mouse out
	$('div.stickies-creation-panel')
		.live('mouseleave', function() {			$(this).fadeOut(100);	});

	$('div.stickies-creation-panel div.x-create')
		.live('click', function() {
      		var pos = $(this).parent('div.stickies-creation-panel').offset()
      		_addSticky({
        				  pos_x: parseInt(pos.left - 180),
        				  pos_y: 5
       		});
	});

    // INITIALIZATION
    _setStickyCreationPanel();
    _getStickies();

    return this;

};