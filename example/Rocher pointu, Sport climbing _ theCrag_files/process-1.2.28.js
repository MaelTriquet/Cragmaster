/* ------------------------------------------
www.thecrag.com behaviours V1 - 12/02/2008
Author - benbailey.com.au on behalf of Simon Dale
Works with the jQuery Javascript Library
------------------------------------------ */

// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires
if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}
$.each({

    // add the default values here
    "js.process.edit-to-preview": "Edit to preview",

  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************


/*
 * jquery.multisortable.js - v0.1.3
 * https://github.com/iamvery/jquery.multisortable
 *
 * Author: Ethan Atlakson, Jay Hayes
 * Last Revision 3/16/2012
 * multi-selectable, multi-sortable jQuery plugin
*/

(function($){
	
	$.fn.multiselectable = function(options) {
		if (!options) { options = {} }
		options = $.extend({}, $.fn.multiselectable.defaults, options)
		
		return this.each(function() {
			var list = $(this)
			
			if (!list.children().data('multiselectable')) {
				list.children().data('multiselectable', true)
				list.children().click(function(e) {
					var item = $(this),
						parent = item.parent(),
						myIndex = parent.children().index(item),
						prevIndex = parent.children().index(parent.find('.multiselectable-previous'))
					
					if (!e.ctrlKey && !e.metaKey)
						parent.find('.' + options.selectedClass).removeClass(options.selectedClass)
					else {
						if (item.not('.child').length) {
							if (item.hasClass(options.selectedClass))
								item.nextUntil(':not(.child)').removeClass(options.selectedClass)
							else
								item.nextUntil(':not(.child)').addClass(options.selectedClass)
						}
					}
					
					if (e.shiftKey && prevIndex >= 0) {
						parent.find('.multiselectable-previous').toggleClass(options.selectedClass)
						if (prevIndex < myIndex)
							item.prevUntil('.multiselectable-previous').toggleClass(options.selectedClass)
						else if (prevIndex > myIndex)
							item.nextUntil('.multiselectable-previous').toggleClass(options.selectedClass)
					}
					
					item.toggleClass(options.selectedClass)
					parent.find('.multiselectable-previous').removeClass('multiselectable-previous')
					item.addClass('multiselectable-previous')
					
					options.click(e, item)
				}).disableSelection()
			}
		})
	}
	
	$.fn.multiselectable.defaults = {
		click: function(event, elem){},
		selectedClass: 'selected'
	}
	
	//---
	
	$.fn.multisortable = function(options) {
		if (!options) { options = {} }
		settings = $.extend({}, $.fn.multisortable.defaults, options)
		
		function regroup(item, list) {
			if (list.find('.' + settings.selectedClass).length > 0) {
				var myIndex = item.data('i')
				
				var itemsBefore = list.find('.' + settings.selectedClass).filter(function() {
					return $(this).data('i') < myIndex
				}).css({
					position: '',
					width: ''
				})
				
				item.before(itemsBefore)
				
				var itemsAfter = list.find('.' + settings.selectedClass).filter(function() {
					return $(this).data('i') > myIndex
				}).css({
					position: '',
					width: ''
				})
				
				item.after(itemsAfter)
				
				setTimeout(function(){
					itemsAfter.add(itemsBefore);
				}, 0);
				
				item.addClass(settings.selectedClass);
				itemsAfter.addClass(settings.selectedClass);
				itemsBefore.addClass(settings.selectedClass);
			}
		}
		
		return this.each(function() {
			var list = $(this)
			
			//enable multi-selection
			list.multiselectable({selectedClass: settings.selectedClass, click: settings.click})
			
			//enable sorting
			options.cancel = settings.items+':not(.'+settings.selectedClass+')'
			options.placeholder = settings.placeholder
			options.start = function(event, ui) {
				if (ui.item.hasClass(settings.selectedClass)) {
					var parent = ui.item.parent()
					
					//assign indexes to all selected items
					parent.find('.' + settings.selectedClass).each(function(i) {
						$(this).data('i', i)
					})
					
					// adjust placeholder size to be size of items
					var height = parent.find('.' + settings.selectedClass).length * ui.item.outerHeight()
					ui.placeholder.height(height)
				}
				
				settings.start(event, ui)
			}
			
			options.stop = function(event, ui) {
				regroup(ui.item, ui.item.parent())
				settings.stop(event, ui)
			}
			
			options.sort = function(event, ui) {
				var parent = ui.item.parent(),
					myIndex = ui.item.data('i'),
					top = parseInt(ui.item.css('top').replace('px', '')),
					left = parseInt(ui.item.css('left').replace('px', ''))
				
				$.fn.reverse = Array.prototype.reverse
				var height = 0
				$('.' + settings.selectedClass, parent).filter(function() {
					return $(this).data('i') < myIndex
				}).reverse().each(function() {
					height += $(this).outerHeight()
					$(this).css({
						left: left,
						top: top - height,
						position: 'absolute',
						zIndex: 1000,
						width: ui.item.width()
					})
				})
				
				var height = ui.item.outerHeight()
				$('.' + settings.selectedClass, parent).filter(function() {
					return $(this).data('i') > myIndex
				}).each(function() {
					var item = $(this)
					item.css({
						left: left,
						top: top + height,
						position: 'absolute',
						zIndex: 1000,
						width: ui.item.width()
					})
					
					height += item.outerHeight()
				})
				
				settings.sort(event, ui)
			}
			
			options.receive = function(event, ui) {
				regroup(ui.item, ui.sender)
				settings.receive(event, ui)
			}
			
			list.sortable(options).disableSelection()
		})
	}
	
	$.fn.multisortable.defaults = {
		start: function(event, ui) { },
		stop: function(event, ui) { },
		sort: function(event, ui) { },
		receive: function(event, ui) { },
		click: function(event, elem) { },
		selectedClass: 'selected',
		placeholder: 'placeholder',
		items: 'li'
	}
	
}(jQuery));

/** End multisortable */

function initTextAreaMarkdown() {
	$('textarea.markdown').each(function(i,e){
		var $e = $(e);
                var initialised = $e.data('markdown-initialised');
                if (!initialised) {
                  $e.data('markdown-initialised',true);
		  var baseheight = $e[0].scrollHeight;
                  if ( baseheight < 25 )  {
		    baseheight = 25;
                  }
		  var height = baseheight + 10;
		  $e.addClass('previewed').css({'min-height': height}).wrap('<div class="markdown-preview">');
		  // create the right side div
		  $('<div class="markdown markedup">'+tc_translate.getText('js.process.edit-to-preview')+'</div>').height(baseheight).insertAfter($e);
		  // if left changes, throlled, fire off the api call to update the right
                }
	});
}


$(document).ready(function(){

	$('.abbrMarkdown').css({width: '100%', height: '3.2em'});

        initTextAreaMarkdown();

	$('body').on('keyup inserted.atwho', '.markdown', _.debounce(function(e){
		var ta = e.target.name;
		var $t = $(e.target);
		var val = $t.val();
		if (val == $t.data('last')){ return; } // may not have actually changed
		$t.data('last', val);
		$('body').trigger('crag.load.start');
		$.ajax({
			url: '/api/markup',
			contentType: 'application/json',
			data: JSON.stringify({data:{
				type:'html',
				token:['tlc','acronym','parentAcronym'],
				node: ta.split('-')[1],
				markdown:val}
			}),
			success: function(data, textStatus, jqXHR){
				$('body').trigger('crag.load.stop');  // put this at front because innerHeight failing
				var ht = data.data.markupHTML;
				var div = $t.next();
				div.html(ht);
                initLazyJS();
                div.css('height', '')
                div.css('min-height','0');
                $t.css('min-height','0');
                var h1 = div.height();
                var h2 = $t[0].scrollHeight;

                var h = Math.max(h1,h2);
				div.css('min-height',h+'px');
				$t.css('min-height',h+'px');
 				h2 = $t.height();
				if (h2>h) {
				 h = h2;
				}
				div.height(h);
				// div.innerHeight(h); // innerHeight is failing for some reason in ascent logging
			},
			type: 'POST'
		});
//		console.log(e);
	},300))



// Drag and drop resequencing

// If any fields with name D:S then turn it on
	var sortables = $('[name="D:S"]');
	if (sortables.length !== 0 ){

		// find the table
		var table = sortables.closest('tbody');


		// set every cells to it's actual width to stop it auto resizing as we move rows around
		table.find('td').each(function(){
			$(this).css('width', $(this).width() );
		});

		table.parent().find('tr:first').prepend('<th><i class="icon-random"></i></th>');
		table.find('tr').prepend('<td><img src="/static/cids/images/drag_grip-1.1.0.png" height="16" width="16" class="handle" /></td>');
		table.css('cursor', 'move');
		sortables
        .prop('readonly', 'readonly')
        .css({
            color: 'black',
            background: 'inherit',
            display: 'none'
        })
        .each(function(i,el){
            $e = $(this);
            $e.after('<span>' + $e.val() + '</span>');
        });

		// add drag handles
		table.multisortable({
			forcePlaceholderSize: true,
			start: function(){
				$('body').trigger('crag.edit.start');
			},
			stop: function(e,el){
				setOrder(table);
				$('body').trigger('crag.edit.stop');
			}
		});

		$('html').click(function(e){
			if( $(e.target).closest('table').length == 0){
				table.find('.selected').removeClass('selected');
			}
		});
	}

        function setOrder(element) {
		// handle the renumbering
		var order = 1;
		element.find('tr').each(function(){
			$(this).find('[name="D:S"]').attr('value',order++);
		});
		// handle the zebra lines
		element.find('tr').removeClass('alternate');
		element.find('tr:nth-child(even)').addClass('alternate');
        }

	$("#reverse-sequence").click(function () {
          var tbody = $(this).parent().parent().parent().parent().find('tbody');
          tbody.children().each(function(i,tr){
            tbody.prepend(tr);
          });
          setOrder(tbody);
        });

	$("#reset-sequence").click(function () {
          var tbody = $(this).parent().parent().parent().parent().find('tbody');
          var rows = tbody.find('tr');
          function sortByOrd(a,b){
            var a_val = $(a).find('td:nth-child(4)').text().toLowerCase() * 1;
            var b_val = $(b).find('td:nth-child(4)').text().toLowerCase() * 1;
            if (a_val>b_val){ return 1; }
            if (a_val<b_val){ return -1; } 
            return 0;
          }
          rows.sort(sortByOrd).appendTo(tbody);
          setOrder(tbody);
        });


	// hides the full record
	$("div#fullView").hide();

	// removes the href to avoid the page jumping. the href is needed for when JS is switched off	 
	$("div.viewSelector a").removeAttr("href");
	
	//click shows the quick view and hides the full view
	$("p.btnQuick").click(function () {
		$("div#quickView").show("medium");
		$("div#fullView").hide("medium");
	});

	//click shows the full view and hides the quick view    
	$("p.btnFull").click(function () {
		$("div#fullView").show("medium");
		$("div#quickView").hide("medium");
	});  

// removes the href to avoid the page jumping. the href is needed for when JS is switched off	 
$(".addRecipient span a").removeAttr("href");

// clones "to" field 
$(".addRecipient span").click(function(){
	$(".addRecipient").clone(true).removeClass("addRecipient").insertBefore(".addRecipient");
	var inp = $(".addRecipient input")
	inp.val("");
	$(".addRecipient span").remove();
});

// removes the href to avoid the page jumping. the href is needed for when JS is switched off	 
$(".uploadFile span a").removeAttr("href");

// clones a file upload field
$(".uploadFile span").click(function(){
	$(".uploadFile").clone(true).removeClass("uploadFile").insertBefore(".uploadFile");
    $(".uploadFile span").remove();
    $(".uploadFile input").val("");
});

// clearing form fields on focus
$.fn.clearDefaultValue = function() {
	return this.focus(function() {
		if( this.value == this.defaultValue ) {
			this.value = "";
		}
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};
$("textarea.clearDefault").clearDefaultValue();
$("input.clearDefault").clearDefaultValue();
$(".clearDefault input").clearDefaultValue();
$(".clearDefault textarea").clearDefaultValue();

$('#gray li div').hide();$('span.help').click(function() {$(this).next('div').slideToggle('fast')});


// this is a super complex case, when reparenting, merging, linking photos amd updating fav's
// if D:MiscNodes is present
// remove to line
// remote all navigation nodes
// replace misc nodes with a text field, we'll hide it later

// add this cool dyno chooser

// get current node with ancestors
// get all ancestor nodes + children


// This generally protects almost all forms from data being lost
// by adding a save warning. Both process.js and common.js do this
// so if they both load one is redundant, except common.js is opt
// in via a .trackunsaved and process.js is opt out via
// .donttrackunsaved on the form element

$('#content form:not(".donttrackunsaved")').delegate('input', 'change', function(){
	$('body').trigger('crag.edit.start');
});
$('#content form:not(".donttrackunsaved")').submit(function(){
	$('body').trigger('crag.edit.stop');
});

});


/*
 * This progressive enhancement makes the 'Select all children' checkbox work
 * client side instead of server side.
 */
$(function(){
    var $checkbox = $("[value='AllChildren']");

    if ($checkbox.length == 0) return;

    // First change it's value so it never gets submitted
    $checkbox.attr('name', 'notused');

    // If the master checkbox gets ticked, change all children
    $checkbox.change(function(){
        $("[name='D:ID']").attr('checked', $checkbox.is(':checked') );
    });

    // If any children change update the master
    $("[name='D:ID']").change(function(){
        var num = $("[name='D:ID']").length;
        var on = $("[name='D:ID']:checked").length;
        $checkbox.attr('checked', num == on );
        $checkbox[0].indeterminate = on > 0 && on < num;

    });

});


/*
 * General grade text box
 *   <div class="route-grade-grouper">
 *   ...
 *   <input class="route-grade-dependency route-grade-input-context">
 *   ...
 *   <input type="radio" class="route-grade-dependency route-grade-input-gear-style">
 *   <select class="route-grade-dependency route-grade-input-gear-style">
 *   ...
 *   <input class="route-grade-dependency route-grade-input-swatch">
 *   ...
 *   <input class="route-grade-dependency route-grade-input-text-grade"><span class="route-grade-output"></span>
 */
$(function(){
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
   };
  })();
  $(".route-grade-input-text-grade").keyup(function(){
    var elem = $(this);
    delay(function(){
      evaluateGradeChange(elem);
    }, 600 );
  });
  $(".route-grade-dependency").change(function(){
    var elem = $(this);
    evaluateGradeChange(elem);
  });
  function evaluateGradeChange(elem) {
    var gradeElems;
    if ( elem.hasClass("route-grade-input-text-grade") ) {
      gradeElems = elem;
    } else {
      gradeElems = elem.closest(".route-grade-grouper").find(".route-grade-input-text-grade");
    }
    gradeElems.each(function(){
      var gradeElem = $(this);
      var grp = gradeElem.closest(".route-grade-grouper");
      var cElem = grp.find(".route-grade-input-context");
      if ( !cElem.length ) {
        cElem = grp.parent().closest(".route-grade-grouper").find(".route-grade-input-context");
      }
      var context = cElem.val();
      var sElem = grp.find(".route-grade-input-gear-style:checked");
      if ( !sElem.length ) {
        sElem = grp.find("select.route-grade-input-gear-style");
      }
      var style = sElem.val();
      var outElem = gradeElem.next();
      if ( !outElem.hasClass("route-grade-output") ) {
        outElem = grp.find(".route-grade-output");
      }
      var swatch = '';
      var swatchElem = grp.find(".route-grade-input-swatch");
      if ( swatchElem.length ) {
        swatch = swatchElem.val();
      }
      if ( outElem.length ) {
       var grade = gradeElem.val();
       if ( grade.length )  {
         var obj={data:{text:gradeElem.val(),context:context,style:style}};
         var json=JSON.stringify(obj);
         postAPIWithPromise('/api/grade',json)
         .done(function(data) {
           if ( data && data.data && data.data.grade && data.data.grade.length ) {
             if ( swatch.length )   {
               outElem.html('<span class="swatch" style="background: ' + swatch + '" title="' + (data.data.systemText ? data.data.systemText : '') + '">' + data.data.gradeInContext + '</span>');
             } else {
               outElem.html('<span class="grade gb' + (data.data.gradeBand ? data.data.gradeBand : '0') + '" title="' + (data.data.systemText ? data.data.systemText : '') + '">' + data.data.gradeInContext + '</span>');
             }
           } else {
             outElem.html("");
           }
         })
         .fail(function() {
           outElem.html("");
         });
       } else {
         outElem.html("");
       }
      }
    });
  }
});




