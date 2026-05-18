/**

 ############
#            #   _   _           ____                 
#       __   #  | |_| |__   ___ / ___|_ __ __ _  __ _ 
#     _/..\  #  | __| '_ \ / _ \ |   | '__/ _` |/ _` |
#___-/.....\ #  | |_| | | |  __/ |___| | | (_| | (_| |
#...........-#   \__|_| |_|\___|\____|_|  \__,_|\__, |
#............#                                  |___/ 
 ############


This is for ALL js which is common to the whole site, like tooltip hovers, headline fixed behaviours

If behaviour is specific to just the area or list templates then it should be in a seperate script

*/


// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires
if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}
$.each({

    // add the default values here
    "system.saving": "Saving",
    "system.saved": "Saved",
    "system.loading": "Loading",
    "js.common.show-more": "show more",
    "js.common.hide": "hide",
    "js.common.hide.label": "hide {labe}",
    "process.button.log-ascent": "Log ascent(s)",
    "process.button.log-ascent.one": "Log ascent",
    "process.button.log-ascent.many": "Log {count} ascents",
    "dbconfig.route-gear-style.aid" : "aid",
    "dbconfig.route-gear-style.alpine" : "alpine",
    "dbconfig.route-gear-style.boulder" : "boulder",
    "dbconfig.route-gear-style.dws" : "deep water solo",
    "dbconfig.route-gear-style.ice" : "ice",
    "dbconfig.route-gear-style.mixed" : "mixed trad",
    "dbconfig.route-gear-style.sport" : "sport",
    "dbconfig.route-gear-style.top-rope" : "top rope",
    "dbconfig.route-gear-style.trad" : "trad",
    "dbconfig.route-gear-style.traverse" : "traverse",
    "dbconfig.route-gear-style.unknown" : "unknown",
    "dbconfig.route-gear-style.via-ferrata" : "via ferrata",

  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************


thecrag = thecrag || {};


function getClusterRadius(count) {
    // Update the scale of the whole donut
    var radius = Math.log(count+1)/Math.log(10); // From 0 - 6
    radius *= .25;
    radius += .5;
    radius *= 40;
    return radius;
}
/*
 * styles - array of style objects
 * size   - if not specified the svg will be 80x80 and the donut
 *          will be sized within this. If specified is will force
 *          the donut to that size and adapt accordingly...
 */
function renderStyleDonut(stylesorig, size) {

    var styles = stylesorig;
    var arr = [];
    if (!Array.isArray(styles)){
        for (var s in styles) {
            arr.push({
                label: s,
                total: styles[s]
            });
        }
        styles = arr;
    }


    styles.sort(function(a,b) {
        return b.total - a.total;
    });
    var total = 0;
    for (var style in styles){
        total += styles[style].total;
    }

    var scale = 1;

    if (size) {
        size = Math.round(size);
        scale = size * .027;
    } else {
        size = 80;
        scale = getClusterRadius(total);
    }
    var half = size / 2;

    var html = '';
    html += '<svg viewBox="-'+half+' -'+half+' '+size+' '+size+'" width="'+size+'" height="'+size+'" class="style-donut" title="">';
    html += '<g class="scale" style="transform: scale('+scale+')">';
    html += '<g style="transform: rotate(-90deg);">';
    html += '<circle cx="0" cy="0" r="15.91" class="outline"></circle>';

    var label = total*1;
    if (label > 5000){
        label = (label/1000).toFixed(0) + 'k';
    } else if (label > 900){
        label = (label/1000).toFixed(1) + 'k';
    } else {
        label = label.toString();
    }

    var chars = label.length;
    var lsize = 8;
    var offset = 1;
    if (chars == 1) { lsize = 22; offset = 7;   }
    if (chars == 2) { lsize = 17; offset = 5;   }
    if (chars == 3) { lsize = 13; offset = 4;   }
    if (chars == 4) { lsize = 10; offset = 3;   }
    if (chars == 5) { lsize = 8;  offset = 2.5; }

    var start = 0;
    var gap = 1;
    for (var s in styles){
        var style = styles[s];
        var clazz = style.label.replace(/ /,'').replace(/-/,'');
        var len = style.total * 100 / total;
        var dasharray = '0,'+(start+gap).toFixed(1)+','+(len-gap).toFixed(1)+',100';
        var opacity = len > gap ? 1 : 0;
        if (opacity) {
            html += '<circle cx="0" cy="0" r="15.91" class="'+clazz+'" stroke-dasharray="'+dasharray+'" />'
            start += len;
        }
    }


    html += '<circle cx="0" cy="0" r="12.91" class="label"></circle>';
    html += '</g>';
    html += '<text y="'+offset+'" style="font-size: '+lsize+'px">'+label+'</text>';
    html += '</g>';
    html += '</svg>';
    return html;
}


// from underscore.js
  var _ = {};

  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  _.uniq = function(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  };

/*
 * The bread crumb manager
 */
function Crumbs($el) {

    this.$el = $el;
    var that = this;

    if ($el.length) {
    	$(window).on('resize', _.throttle(function(el, obj) {
            that.resize();
        }, 100));
        this.resize();
    } else {
        window.console && console.warn("Crumbs has no items!");
    }
}

Crumbs.prototype = {

    /*
     * How much space the crumb trail wants?
     *
     * How much it wants depends on it's current display state so
     * this will change as nodes are shrunk and hidden.
     */
    wants: function() {
        // var w = this.$el[0].scrollWidth;
        var w = this.$el.find('.crumbs__all')[0].scrollWidth;
        return w;
    },

    /*
     * How many pixels do we have to fit stuff into?
     */
    has: function() {
        var w = this.$el[0].clientWidth - 5; // 5px buffer for good luck
        return w;
    },

    /*
     * Returns how much room there is.
     * If there is no room it is negative
     */
    room: function() {
        var room = this.has() - this.wants();
        return room;
    },

    /*
     * True is there is enough room
     */
    fits: function() {
        return this.room() >= 0;
    },

    /*
     * Resets display state
     */
    reset: function() {

        var $lis  = this.$el.find('.crumb');
        // Reset any previous shortenings
        $lis.find('.crumb_long').css('display', 'inline-block');
        $lis.find('.crumb_short').css('display', 'none');
        $lis.removeClass('crumb--collapsed');
        // remove max widths
        $lis.find('a').css('max-width', 'none');
        $lis.css('display', 'inline-block');
        $lis.find('.crumb__sep i').attr('class', 'icon-angle-right');
    },

    /*
     * resize the crumb to fit the available space
     */
    resize: function() {

        var $lis  = this.$el.find('.crumb');
        var max   = $lis.length;
        var has   = this.has();
        var c;

        this.reset();

        // Must be after we reset to full width
        var wants = this.wants();

        // From right to left make sure all nodes are < 300px
        var mwid = 300;
        for (c=max-1; c >= 0 && !this.fits(); c--) {
            $lis.eq(c).find('a').css('max-width', mwid+'px');
        }

        // From left to right, see if there is a short version of any nodes
        for (c=1; c < max-1 && !this.fits(); c++) {
            var $s = $lis.eq(c).find('.crumb__short');
            if ($s.length) {
                $lis.eq(c).find('.crumb__short').css('display', 'inline-block');
                $lis.eq(c).find('.crumb__long').css('display', 'none');
            }
        }

        // If we are on a screen smaller than X, and we don't fit then it's ok collapse the last node
        if (!this.fits() && window.matchMedia && window.matchMedia('(max-width: 736px)').matches) { // see layout/regions.less
            $lis.eq(max-1).addClass('crumb--collapsed');
        }

        // From left to right hide nodes but NEVER remove the last node
        for (c=1; c < max-1 && !this.fits(); c++) {
            $lis.eq(c).css('display', 'none');
            $lis.eq(c+1).find('.crumb__sep i').attr('class', 'icon-double-angle-right')
        }

        // Now fine tune the size of the selected item to make it perfect
        var gap = this.room();
        var $sel = $lis.last().find('a');
        if ($sel.css('max-width') == 'none') {
            mwid = $sel.width();
        }
        $sel.css('max-width', (mwid + gap) + 'px');

    },

    /*
     * replace the crumbtrail with new data. Each crumb object is identical to
     * the template data but in json:
     * {
     *   nid:   12345,
     *   href:  '/climbing/australia',
     *   icon:  'world',
     *   label: 'Australia',
     *   short: 'Aus'
     * }
     */
    replace: function(crumbs) {
        var html = '';
        var c = 0;
        for(c=0; c<crumbs.length; c++) {
            var cr = crumbs[c];
            var dclass = '';
            var aclass= 'crumb__a';
            if (c == crumbs.length-1) { dclass += ' crumb--selected';}
            if (c == 0     ) { dclass += ' crumb--first'   ;}
            if (cr.children) { dclass += ' crumb--children';}


            if (cr.icon && !cr.label && cr.children) {
                dclass += ' crumb--menu';
                dclass += ' dropdown-menu--trigger';
            }
            html += '<div class="crumb'+dclass+'">';
            if (c != 0) {
                html += this.render_crumb__sep(cr.nid,0);
            }
            html += '<a class="'+aclass+'" href="'+cr.href+'" ';
            if (cr.nid) {
                html += ' data-nid="'+cr.nid+'"';
            }
            html += '>';
            if (cr.icon) {
                html += '<span class="crumb__icon"><i class="icon-'+cr.icon+'"></i></span>';
            }
            if (cr.label) {
                html += '<span class="crumb__long" itemprop="title">'+cr.label+'</span>';
            }
            if (cr['short']) {
                html += '<span class="crumb__short">'+cr['short']+'</span>';
            }
            html += '</a>';
            html += '</div>';
        }
        this.$el.find('.crumbs__all').html(html);
        this.resize();
    },

    render_crumb__sep: function(nid, children) {
        var html = '';
        var sclass = 'crumb__sep';
        if (children) {
            sclass += ' crumb--menu';
            sclass += ' crumb--spin';
            sclass += ' dropdown-menu--trigger';
        }
        html += '<span class="'+sclass+'"';
        if (nid) {
            html += ' data-nid="'+nid+'"';
        }
        html += '><i class="icon-angle-right"></i>';
        html += '</span>';
        return html;
    }
}

thecrag.crumbs = new Crumbs($('#breadCrumbs'));


function centerTabs(){
    $('.tabs').each(function(i) {
        var $t = $(this);
        var $s = $t.find('.tab--selected');
        if ($s.length) {
            $t.find('.tabs__slider').scrollLeft($s[0].offsetLeft - $t.width()/2 + $s.width()/2);
        }
    });
}
$(window).on('resize', _.throttle(centerTabs, 100));
window.addEventListener("orientationchange", centerTabs, false);


function initLazyJS(){
    $('.js-lazy-img').lazy({
        effect: "fadeIn",
        effecttime: 2600,
        threshold: 0
    });
    $('.js-lazy-img-fast').lazy();
}



(function($){

	$.fn.keepVisible = function(keepInside){
		// if no parent id then
		var margin = {
			top: 0,
			bottom: 0
			},
			that = this,
			height = this.height(),
			width  = this.width(),
			outerHeight = this.outerHeight(),
			outerWidth  = this.outerWidth(),
			offset = this.offset(),
			slider = this,
			placeHolder,
			modeFlow = 0, modeTop = 1, modeBottom = 2,
			mode = modeFlow,
			check;

		if (keepInside){
			margin.top = offset.top;
			margin.bottom = $(document).outerHeight() - offset.top - outerHeight;
		}

		// make a placeholder
		placeHolder = $('<div class="placeholder" />')
			.css({height: outerHeight, width: 10, display: 'none'})
			.insertBefore(this);

		// make the 
		check = function(){
			height = that.height();
			outerHeight = that.outerHeight();
			//offset = that.offset();
			var scrollTop = $(window).scrollTop(),
				winHeight = $(window).height(),
				oldMode = mode;
			mode = modeFlow;

			// has the slider overlapped the window frame?
			if (scrollTop < offset.top + outerHeight - winHeight ){
				mode |= modeBottom;
			}
			if (scrollTop > offset.top ){
				mode |= modeTop;
			}

			// if both the top and bottom overlap then put it back into flow mode
			if (mode === (modeTop | modeBottom)){ mode -= modeTop | modeBottom; }

			if (winHeight < 400 || $(window).width() < 650){
				mode = modeFlow;
			}

			if (outerHeight != that.outerHeight() ||
				outerWidth  != that.outerWidth() ){
				outerHeight = that.outerHeight();
				outerWidth  = that.outerWidth();
			} else {
				if (mode === oldMode){ return; }
			}

			if (mode === modeFlow){
				placeHolder.hide();
				slider.removeClass('fixed')
				return;
			}
			placeHolder.show().height(height);
			slider.addClass('fixed');

		};
		$(window).scroll(check);
		$(window).resize(check);
		check();
	};


})(jQuery);

// Follow / unfollow buttons

if ($('body').data('uid')){
    $(".follow-them,.unfollow-them").click(function(e){
        var $el = $(this);
        var fol = $el.hasClass('follow-them');
		$('body').trigger('crag.edit.start');
        updateFollowing($('body').data('uid'),$el.data('uid'),fol,function(){
		    $('body').trigger('crag.edit.stop');
        });
        $el.toggleClass('follow-them btn-success', !fol);
        $el.toggleClass('unfollow-them', fol);
        $el.html('<i class="icon-male"></i> ' +  (fol ? 'Unfollow' : 'Follow') );
        return false;
    });
    $(".block-them,.unblock-them").click(function(e){
        var $el = $(this);
        var blk = $el.hasClass('block-them');
		$('body').trigger('crag.edit.start');
        updateBlockAccount($('body').data('uid'),$el.data('uid'),blk,function(){
		    $('body').trigger('crag.edit.stop');
        });
        $el.toggleClass('block-them btn-danger', !blk);
        $el.toggleClass('unblock-them', blk);
        if (blk) {
          $el.html('<i class="icon-circle-blank"></i> ' +  'Unblock');
        } else {
          $el.html('<i class="icon-ban-circle"></i> ' +  'Block');
        }
        return false;
    });
    $(".grant-them,.ungrant-them").click(function(e){
        var $el = $(this);
        var gnt = $el.hasClass('grant-them');
		$('body').trigger('crag.edit.start');
        updateGrantSupporter($('body').data('uid'),$el.data('uid'),gnt,function(){
		    $('body').trigger('crag.edit.stop');
        });
        $el.toggleClass('grant-them', !gnt);
        $el.toggleClass('ungrant-them btn-danger', gnt);
        if (gnt) {
          $el.html('<i class="icon-heart-empty"></i> ' +  'Ungrant');
        } else {
          $el.html('<i class="icon-heart"></i> ' +  'Grant');
        }
        return false;
    });
}

$('.link-map__pins a').on('mouseover', function(e) {
    $('body').trigger('node.over', {id: $(this).data('nid') });
});
$('.link-map__pins a').on('mouseout', function(e) {
    $('body').trigger('node.out',  {id: $(this).data('nid') });
});

$(document).on('topotoggle',  function(e,data){
    var node = data.orig;
    if (data.editing){
        return;
    }
	if (node.type == 'area'){
		window.location = node.url;
    } else {

        // Ask the page, is it selectable
        var $check = $('input[type=checkbox][value='+node.id+']');
        if ($check.length > 0){
            // If yes, then select or deselect it
            if ($check.attr('checked')){
                $('body').trigger('node.deselect', {id: node.id});
            } else {
                $('body').trigger('node.select',   {id: node.id});
            }

        } else {
            // If not then navigate to it (eg cross area topo, or route page)
		    window.location = node.url;
        }

    }
});
$(document).on('topohover',   function(e,data){

    // Only code specific to topos go here's, the rest delegate to node.over
    var node = data.node;

    $('body').trigger('node.over', {id: node.id});
    var o = data.orig;
        
    var style = o.style || '';
    var style = style.replace(/ /,'-').toLowerCase();

    if (o.type != 'route'){ return; }

    var stars = '';
    for(c=0; c<o.stars.length; c++) {
        stars += '<span class="star gold">★</span>';
    }

	var name = '' + stars
            + ' '
            + o.name
            + ' <span class="'+o['class']+'">' + o.grade + '</span> '
            + thecrag.getTextUC('dbconfig.route-gear-style.'+style);
	$('body')
        .poshytip('enable')
        .poshytip('update', name)
        .poshytip('show');
});
$(document).on('topounhover', function(e,data){

    // Only code specific to topos go here's, the rest delegate to node.over
	$('body').trigger('node.out', {id: data.node.id});
	if( !$.fn.poshytip){
		return;
	}
	$('body').poshytip('disable').poshytip('hide');
});


function setupKeyboard(){
	$("body").keydown(function(e) {
		var keyMap = {
			37: 'prev',
			//38: 'up', // don't mess with normal scroll nav
			39: 'next'
			// 191: '#searchForm input' // '/' and '?' character - disabled because it stops blocks text area inputs
		};
		var link = keyMap[e.keyCode];
		if (!link) return true;
		var focus = $(e.target).is('body');
		if (!focus){ return true; }
		var href = $("link[rel='"+link+"']").attr('href');
		if (href){
			window.location = href;
			return false;
		}
		var elem = $(link);
		if (elem[0]){
			elem.focus();
			return false;
		}
	});
}

jQuery.expr[':'].anchas = function(a,i,m){
    return jQuery(a).closest(m[3]).length == 0;
};

function setupTooltips(){

	if( !$.fn.poshytip){
		return;
	}

    // Remove things we don't want tooltips for like google maps and logos
    var $t = $('[title]:not([title=""]):anchas(.js-no-tooltips)');

    $t.poshytip({
		className: 'tip-twitter',
		content: function(callback){
			var tip = $(this).data('title.poshytip');
			if (tip.indexOf(' - ') != -1){
				tip = '<h3>'+tip.replace(/ - /, '</h3>');
			}
			tip = tip.replace(/ - /g, '<br />');
			return tip;
		},
		fade: false,
		liveEvents: true,
		followCursor: true,
		showTimeout: 1,
		hideTimeout: 1,
		slide: false,
		alignX: 'center',
		offsetY: 8,
		allowTipHover: false,
		// alignTo:'cursor'
		alignTo:'target'
    });
	// This one is spare for topo, maps and other dynamic tooltips
	$('body').poshytip({
		shownnnnnOn: 'none',
		className: 'tip-twitter',
		fade: false,
		followCursor: true,
		showTimeout: 0,
		showAniDuration: 0,
		refreshAniDuration: 0,
		slide: false,
		alignX: 'center',
		alignTo: 'cursor'
	}).poshytip('disable');
}


/*
 * This is only triggered on the first hover which
 * loads data and is then removed. After that it is pure
 * css hovers.
 *
 */
function menuHoverHandler(e){
	var $e = $(e.currentTarget);
	$e.unbind('mouseenter', menuHoverHandler);

    var $nid = $e.find('> [data-nid]');
    if ($nid.length == 0) {
        $nid = $e.parent().find('> [data-nid]');
    }
    var lang = $('html').attr('lang');

	var nid = $nid.data('nid');
	var suffix = $e.closest('[data-suffix]').data('suffix') || '';
	function menuLoadHandler ($li, data){
        data = data[0];

        function addItem($l, item){
            var a = $('<a>').attr('href', thecrag_index_url({
                id :item[0],
                'type': 'area',
                urlStub: item[2],
                urlAncestorStub: item[3],
                trailer: suffix
            }, {lang: lang} ) )
                .text(item[1])
                .attr('data-nid',item[0])
                .attr('data-subtype',item[5].toLowerCase())
                ;
            var $li = $('<li>').toggleClass('dropdown-submenu', item[4] != null).append(a).appendTo($l);
            if (item[4] != null){
                addMenuHandler( $li );
            }
        }

        if (data.length == 0) return;
        if (data.length > 18 && $li.find('> a').data('subtype') == 'region'){

            data.sort(function(a,b){
                var nameA=a[6].toLowerCase(), nameB=b[6].toLowerCase();
                if (nameA < nameB) return -1 ;
                if (nameA > nameB) return 1;
                return 0;
            });

            var $l = $('<ul class="dropdown-menu">');
            for(var al=0; al<5; al++){
                var start = String.fromCharCode(65 + al * 5);
                var end   = String.fromCharCode(65 + (al >= 4 ? 25 : al * 5 + 4));
                var children;
                if (al==4){
                    // special case for last one to catch everything
                    children = data.filter(function(e){
                        var letter = e[6].substring(0,1).toUpperCase();
                        return letter < 'A' || letter > 'T';
                    });
                } else {
                    children = data.filter(function(e){
                        var letter = e[6].substring(0,1).toUpperCase();
                        return letter >= start && letter <= end;
                    });
                }

                var $li = $('<li class="'+(children.length>0?'dropdown-submenu':'disabled')+'"><a class="">' + start+' ... '+end+'</a></li>').appendTo($l);
                if (children.length > 0){
                    var $ul = $('<ul class="dropdown-menu">').appendTo($li);
                    for(var c=0; c<children.length; c++){
                        addItem($ul, children[c]);
                    }
                }
            }
            $l.appendTo($e);
            return;
        }

        var $l = $('<ul class="dropdown-menu">');
        for(var c=0; c<data.length; c++){
            addItem($l, data[c]);
        }
        $l.appendTo($e);
	}
	$.get('/api/node/id/'+nid+'/children/area?flatten=data[id,name,urlStub,urlAncestorStub,subAreaCount,subType,asciiName]&expires=10',
        function(data){
            menuLoadHandler($e, data);
        });
}

function addMenuHandler($e){
	$e.mouseenter(menuHoverHandler);
}

addMenuHandler( $('#favs li.dropdown-submenu') );
addMenuHandler( $('.secondary-navigation li.dropdown-submenu:not(.group,.selected)') );
addMenuHandler( $('.crumb--menu') );


function helpHoverHandler(e){
	var $e = $(e.currentTarget);
	$e.unbind('mouseenter', helpHoverHandler);
	var $ul = $e.find('.dropdown-menu');
	function helpLoadHandler ($ul, data){
        	data = data[0][0];
        	function addHelpItem(addTo, item, drp){
            			//alert("DEBUG:"+item[0] + ":" + item[1]);
            		  var a = $('<a>').attr('href','/article/'+item[0]).text(item[1])
            		  var $li = $('<li>').toggleClass('dropdown-submenu',drp).append(a).appendTo(addTo[item[2]]);
			  if ( drp )  {
            		    var $dp = $('<ul>').addClass('dropdown-menu').appendTo($li);
			    addTo[item[2]+1] = $dp;
			  }
        	}
        	if (data.length == 0) return;
		var addTo = ['',$ul];
        	for(var c=0; c<data.length; c++){
                  var drp = (data[c+1] && data[c][2]<data[c+1][2]);
                  addHelpItem(addTo, data[c], drp);
        	}
	}
	$.get('/api/config/articles?flatten=data[articles[label,name,level]]', function(data){
            helpLoadHandler($ul, data);
        });
}
function addHelpHandler($e){
	$e.mouseenter(helpHoverHandler);
}
// help loaded in server query
// addHelpHandler( $('#pt_help') );

function oembed(el) {
  var oembeddone = el.data('oembed-done');
  if ( !oembeddone ) {
    el.data('oembed-done',1);
    var url = el.data('oembed-url');
    var resource = el.html();
    if ( url && resource ) {
      var tag = el.data('provider-tag') || 'unknown';
      var cbk = el.data('callback') || 'callback';
      url = url + '?url=' + encodeURIComponent(resource) + '&format=json&' + cbk + '=?';
      if ( document.location.protocol == 'https:' )  {
        url = url.replace('http:','https:');
      }
      $.getJSON(url,function(data){
        var html = '';
        if ( data.html ) {
          html = '<div class="oembed-container oembed-'+tag+'">'+data.html+'</div>';
          if ( document.location.protocol == 'https:' )  {
            html = html.replace('http:','https:');
          }
        } else if ( data.type && data.type == 'photo' && data.url ) {
          html = '<a href="'+resource+'"><img src="'+data.url+'" title="'+data.title+'"></a>';
        }
        if ( html ) {
          var provider = 
	   ( data.provider_url ? '<a href="'+data.provider_url+'">' : '' ) +
	   ( data.provider_name ? data.provider_name : '' ) +
	   ( data.provider_url ? '</a>' : '' );
          var license = 
	   ( data.license_url ? '<a href="'+data.license_url+'">' : '' ) +
	   ( data.license ? data.license : '' ) +
	   ( data.license_url ? '</a>' : '' );
          var author = 
	   ( data.author_url ? '<a href="'+data.author_url+'">' : '' ) +
	   ( data.author_name ? data.author_name : '' ) +
	   ( data.author_url ? '</a>' : '' );
          html = html + 
           '<div class="oembed-credits">' +
           ( author ? ' by '+author : '' ) +
           ( provider ? ' via '+provider : '' ) +
           ( license ? ' (under license '+license+')' : '' ) +
           '</div>';
          $(html).insertAfter(el);
          el.html('<a href="'+resource+'">'+resource+'</a>');
          var ptag = el.data('provider-tag');
          if ( ptag ) {
            el.addClass("oembed-"+ptag);
          }
        }
      });
    }
  }
}

$(function(){

	$('span.oembed,div.oembed').each(function(){
          oembed($(this));
	});

	// Setup the node markdown accordian
	// if it is big OR if it has the only-mobile
    var show_more = tc_translate.getText('js.common.show-more');
    $('.node-info:not(.only-mobile) .content').each(function(el){
        var $ni = $(this).closest('.node-info');
        var height = $(this).height();
        var width  = $(window).width();
        var margin = 20; // If the content is only just bigger, it's better to show it than the more button

        // These numbers should match the media queries in css
        if (    (height > (112+margin) && width > 880)                 // @s_break
             || (height > ( 72+margin) && width > 400 && width <= 880) // @t_break - @m_break
             || (width < 400)                                          // @m_break mobile is always collapsed
           ) {
            $ni.addClass('expandable')
            $ni.append($('<span class="comment-more"><a class="btn btn-mini" href="#">'+show_more+'</a></span>'));
        }
    });
	$('.node-info.only-mobile .content').each(function(el){
		var $ni = $(this).closest('.node-info');
		$ni.append($('<span class="comment-more"><a class="btn btn-mini" href="#">'+show_more+'</a></span>'));
	});
		// if big then add class and more button
	$(".comment-more a, .node-info h2").on("click", function(){
		var $ni = $(this).closest('.node-info');
		var open = $ni.hasClass('expandable');
		var off = $ni.find('h2').offset().top - $(window).scrollTop();
		var $c = $ni.find('.content');
		var moreTop = $ni.offset().top + $ni.outerHeight() - $(window).scrollTop();
		$ni.toggleClass("expandable", !open);
		$ni.toggleClass("contractable", open);
		//var label =  $ni.find('h2').clone().children('small').remove().end().text().toLocaleLowerCase();
		var label =  $ni.find('h2').clone().children('small').remove().end().text();
		$ni.find('.comment-more a').text(!open ? show_more : tc_translate.getText('js.common.hide.label',{label:label}) );
		$ni.trigger('section'+(open?'open':'close'));

        // Opportunity to load things
        initLazyJS();

		// if the h2 wasn't visible scroll up til it is
		if (!open && off < 0){
			var moreTopNow = $ni.offset().top + $ni.outerHeight();
			window.scrollTo(0,moreTopNow - moreTop);
		}
		return false;
  });
  
  //inherit description from other nodes
  //the links in the node info section should follow the link and not trigger the "read more" toggle
  $(".node-info a.inherit-from").on("click", function(e){
    e.stopPropagation();
  });


  //remove the loading background image for topos after the real image was loaded
  //see: https://stackoverflow.com/questions/3877027/jquery-callback-on-image-load-even-when-the-image-is-cached
  $(".fn-remove-parent-background").one("load", function(e) {
    $(e.currentTarget).parent().css("background-image", "none");
  }).each(function() {
    if(this.complete) {
        $(this).load();
    }
  });

	//
	$('.node-listview .area[data-nid]').each(function(i,e){
		var nid = $(e).data('nid');
		var $e = $(e).find('.stats .routes');
		$e.html( '<a href="/routes/at/'+nid+'" title="Search and filter these routes">' + $e.html() + '</a>'  );
		var $e = $(e).find('.stats .ticks');
		$e.html( '<a href="/ascents/at/'+nid+'" title="Search and filter these ascents">' + $e.html() + '</a>'  );
	});

    initLazyJS();

	// see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
	if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {

	} else {
	// start non-touch, ie all hover events
	$(  '.routetable[data-hover!=false] tr   ,'+
            '.areatable[data-hover!=false] tr    ,'+
            '.secondary-navigation a             ,'+
            '.routelist > div                    ,'+
            '.crumbtrail-partial__crumb[data-nid],'+
            '.quick-toc               a[data-nid],'+
            '.node-listview      .route[data-nid],'+
            '.node-listview .annotation[data-nid],'+
            '.node-listview       .area[data-nid]').hover(

			function(){
                           var element = $(this).closest('[data-nid]');
                           if ( element.data('iid') ) { // not a list item element
			     $('body').trigger('list-item.over', {id: element.data('iid') });
           $('body').trigger('node.over', {id: element.data('nid') }); //also node over for maps
                           } else {
			     $('body').trigger('node.over', {id: element.data('nid') });
                           }
			},
	   		function(){
                           var element = $(this).closest('[data-nid]');
                           if ( element.data('iid') ) {
			     $('body').trigger('list-item.out', {id: element.data('iid') });
           $('body').trigger('node.out', {id: element.data('nid') });
                           } else {
			     $('body').trigger('node.out', {id: element.data('nid') });
                           }
			}
		);
	}
	// end non-touch events




  $('.fn-topo-fullscreen').on('click',function(e){
    var topodivcontainer = $(this).closest('.phototopo-fsc').get(0); 
    var $topodiv = $(topodivcontainer).find('.phototopo');
    var $toposvg = $(topodivcontainer).find('svg');
    var $topoCan = $(topodivcontainer).find('.canvas');
    var $i = $(this).find('i');
    var tooltip;
    var tw = ($topodiv.data("width") || 1);
    var th = ($topodiv.data("height") || 1);
    var topo = $topodiv.data('phototopo');
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      $topoCan.find('img[data-big]').each(function(){
        $(this).attr({src: $(this).data('big'),'data-big':null})
      });
      if (document.fullscreenEnabled) {
        topodivcontainer.requestFullscreen().then((fe) => {
          $topodiv.css('margin', 'auto');

          var $w = $(window);
          var wh = $w.height() * 1;
          var ww = $w.width() * 1;
                
          var scale = Math.min(ww / tw, wh / th);
          var mw = Math.round(tw * scale);
          $topodiv.css('max-width', (mw + "px"));
          $i.attr('class', 'icon-resize-small');
        });
      } else {
        //alternate fullscreen zoom
        console.log("alternate zoom mode");
        if ($toposvg.data("alternate-fullscreen-zoom") === 1) {
          console.log("zoom off by click");
          if (topo.zoomScale > 1 ) {
            topo.autoZoom(e);
          }
          $toposvg.off("touchstart");
          $toposvg.data("alternate-fullscreen-zoom",0);
          $i.attr('class', 'icon-resize-full');
        } else {
          function zoom_in_fullscreen(e){
            topo.autoZoom(e.originalEvent);
            return false;
            //if (e.target.tagName == 'svg'){}
          }
          $toposvg.on("touchstart", zoom_in_fullscreen);
          $i.attr('class', 'icon-resize-small');
          topo.autoZoom(e.originalEvent);
          $toposvg.data("alternate-fullscreen-zoom",1);
        }
        
      }


      $(topodivcontainer).on("fullscreenchange", (event) => {

        function zoom_in_fullscreen(e){
          topo.autoZoom(e.originalEvent);
          return false;
          //if (e.target.tagName == 'svg'){}
        }

        if (document.fullscreenElement) {
          console.log("entered topo fullscreen mode.");

          var topoffset = $(document.fullscreenElement).offset().top * -1;
          $(window).on("resize", (e) => {
            var $w = $(window);
            var wh = $w.height() * 1;
            var ww = $w.width() * 1;
                   
            var scale = Math.min(ww / tw, wh / th);
            var mw = Math.round(tw * scale);
            $topodiv.css('max-width', (mw + "px"));
          });

          console.log("bind ontouchstart ");
          //$toposvg.on("click", otc);
          $toposvg.on("touchstart", zoom_in_fullscreen);

          document.myfs_observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {   
              if (mutation.type === "childList") {
                let target = mutation.addedNodes[0];
                if (target && target.classList.contains("tip-twitter")) {
                  $(target).css('margin-top', topoffset+"px");
                  $(document.fullscreenElement).append(target);
                  tooltip = target;
                }
              }
            });
          });

          document.myfs_observer.observe(document.querySelector("body"), {childList: true});

        } else {
          console.log("Leaving topo fullscreen mode now.");
          if (topo.zoomScale > 1 ) {
            topo.autoZoom(event);
          }
          $i.attr('class', 'icon-resize-full');
          $topodiv.css('margin', '');
          $topodiv.css('max-width', (($topodiv.data("width") || 1) + "px"));
          $(topodivcontainer).off("fullscreenchange");
          $(window).off("resize");
          $toposvg.off("touchstart");
          document.myfs_observer.disconnect();
          $(tooltip).css('margin-top',"0px");
        }
      });
    }

    e.preventDefault();
    e.stopPropagation();
  });


    $('.showhide').on('touchstart',function(e){
        var topo = $(this).closest('.phototopo').data('phototopo');
        var $i = $(this).find('i')
        var show = $i.hasClass('icon-eye-open');
        if (show){
            topo.hide()
            $i.attr('class', 'icon-eye-close');
        } else {
            topo.show()
            $i.attr('class', 'icon-eye-open');
        }
        e.preventDefault();
		    e.stopPropagation();
    });

    $('.showhide').click(function(e){
        return false;
    });
    $('.showhide').hover(function(){
        $(this).closest('.phototopo').data('phototopo').hide()
        $(this).find('i').attr('class', 'icon-eye-close');
    }, function(){
        $(this).closest('.phototopo').data('phototopo').show()
        $(this).find('i').attr('class', 'icon-eye-open');
    });
    $('.phototopo--legend').click(function(e){
        var types = $(this).closest('.phototopo').data('phototopo').pointsInUse();
        var html = '';
        var group = '';
        var lastgroup = '';
        for (var c=0; c<types.length; c++) {
            var type = types[c];
            group = type.pointtype.group.substring(2);
            if (group != lastgroup) {
                html += '<li class="nav-header">' + group;
            }
            html += '<li class="nolink">'
                + '<img src="/svg/topo-' + type.type + '?v=1">'
                + type.pointtype.label
                // + '<span class="pull-right op5"><span class="badge">' + type.c + '</span></span>'
                + '</li>';
            lastgroup = group;
        }
        $(this.nextSibling).html('<ul>'+ html + '</ul>');
        // return false;
        // TODO if there are not types then don't show the button at all
        // TODO de-duplicate points on same position
    });

	if (screen.width > 400){



		setupTooltips();
		setupKeyboard();

		// headling fixed but only for big screens (not iphones etc)
		if ($('#headline:not(.nofix)').length) {
			$('#headline').keepVisible();
		}

	}

	// ALL events that apply to both touch and mouse, eg FastClick events
	$('body').bind('node.select', function(e,data){

		if (window.PhotoTopo){
			PhotoTopo.select(data.id);
		}
		var $check = $('input[type=checkbox][value='+data.id+']');
    if (data.iid) {
		  $check = $('input[type=checkbox][value='+data.id+'][data-iid='+data.iid+']');
    }
		if ( $check.length>0 ) {
			$check.attr('checked', true);
		}

		var $tr = $('.node-listview').find('.route[data-nid='+data.id+'],.annotation[data-nid='+data.id+'], .area[data-nid='+data.id+']');
    if (data.iid) {
		  $tr = $('.node-listview').find('.list-item[data-iid='+data.iid+']');
    }
		if ( $tr.length>0 ) {
			$tr.addClass('selected');
			if ( $tr.hasClass('route') ) {
				updateAscentButton();
			}
			if (typeof updateDynamicListViewMenu == 'function') {
				updateDynamicListViewMenu(e,$tr);
			}
		}
	});

	$('body').bind('node.deselect', function(e,data){
		if (window.PhotoTopo){
			PhotoTopo.deselect(data.id);
		}
		var $check = $('input[type=checkbox][value='+data.id+']');
                if (data.iid) {
		  $check = $('input[type=checkbox][value='+data.id+'][data-iid='+data.iid+']');
                }
		if ( $check.length>0 ) {
			$check.attr('checked', false);
		}

		// var $tr = $check.closest('[data-nid]');
		var $tr = $('.node-listview').find('.route[data-nid='+data.id+'],.annotation[data-nid='+data.id+'], .area[data-nid='+data.id+']');
                if (data.iid) {
		  $tr = $('.node-listview').find('.list-item[data-iid='+data.iid+']');
                }
		if ( $tr.length>0 ) {
			$tr.removeClass('selected');
			if ( $tr.hasClass('route') ) {
				updateAscentButton();
			}
			if (typeof updateDynamicListViewMenu == 'function') {
				updateDynamicListViewMenu(e,$tr);
			}
		}
	});

	$('body').bind('list-item.over', function(e,data){
		var id = data.id;
		if (!id){ return; }
		$('.node-listview .list-item[data-iid='+id+']').addClass('hover');
	});

	$('body').bind('list-item.out', function(e,data){
		var id = data.id;
		if (!id){ return; }
		$('.node-listview .list-item[data-iid='+id+']').removeClass('hover');
	});

	$('body').bind('node.over', function(e,data){
		var id = data.id;
		if (!id){ return; }

		// hover tr's
		$('#n'+id).addClass('hover');
		$('.node-listview .annotation[data-nid='+id+']').addClass('hover');
		$('.node-listview      .route[data-nid='+id+']').addClass('hover');
		$('.node-listview       .area[data-nid='+id+']').addClass('hover');
		$('.secondary-navigation    a[data-nid='+id+']').addClass('active');
		$('.link-map__pins       .pin[data-nid='+id+']').addClass('pin--hover');

		// hover topos
		if (window.PhotoTopo){
			PhotoTopo.hover(id);
		}
	});

	$('body').bind('node.out', function(e,data){
		var id = data.id;
		if (!id){ return; }

		// hover tr's
		$('#n'+id).removeClass('hover');
		$('.node-listview .annotation[data-nid='+id+']').removeClass('hover');
		$('.node-listview      .route[data-nid='+id+']').removeClass('hover');
		$('.node-listview       .area[data-nid='+id+']').removeClass('hover');
		$('.secondary-navigation    a[data-nid='+id+']').removeClass('active');
		$('.link-map__pins       .pin[data-nid='+id+']').removeClass('pin--hover');


		// hover topos
		if (window.PhotoTopo){
			PhotoTopo.unhover(id);
		}
	});
	if (window.PhotoTopo && window.defaultSelect){
		PhotoTopo.select(window.defaultSelect);
	}



	// This set the selected class if you come back to the page
	$('.node-listview :checkbox').each(function(){
		var $check = $(this);
		var is = $check.is(':checked');
		var $tr = $check.closest('.route');
		$tr.toggleClass('selected', is);
	});

	function updateAscentButton(){
		var c = $('.route.selected').length;
    var label = tc_translate.getText('process.button.log-ascent',{count:c},{count:c});
    var button = $("[name='State:LogAscent']");
    var hasSelection = c > 0;
		button.val(label).toggleClass('action', hasSelection).toggleClass('disabled',!hasSelection);
    if (hasSelection) {
      button.prop('disabled', false)
    } else {
      button.prop('disabled', true)
    }
	}
        $(".logascentflow").submit(function(){
		event.stopPropagation();
		event.preventDefault();
		var selected = $('.route.selected');
                if (selected.length > 0) {
                  var routes = [];
                  selected.each(function(){ 
                    var s_nid = $(this).data('nid'); 
                    if (s_nid) {
                      routes.push({
                       routeID: s_nid,
                       route: $(this).data('route-tick') || {},
                      });
                    }
                  });
                  showLogAscentModal(routes);
                }
        });
	$(".node-listview").on("click", ":checkbox", function(event){
		event.stopPropagation();
		var $check = $(this);
		var is = $check.is(':checked');
		var $tr = $check.closest('.route');
		$('body').trigger(is?'node.deselect':'node.select', {id: $tr.data('nid'), iid:$tr.data('iid') });
	});
	// any routes 
	$(".node-listview .route[data-nid]").on("click", function(event){
		if ($(event.target).closest('.actionarea').length) return;
		var $tr = $(this);
		var $check = $tr.find(':checkbox');
		var is = $check.is(':checked');
		$('body').trigger(is?'node.deselect':'node.select', {id: $tr.data('nid'), iid:$tr.data('iid') });
	});
	// any annotations 
	$(".node-listview .annotation[data-nid]").on("click", function(event){
        var $target = $(event.target);
		if ($target.closest('.actionarea').length) return;
		if ($target.closest('a').length) return;
		var $tr = $(this);
		var is = $tr.hasClass('selected');
		$('body').trigger(is?'node.deselect':'node.select', {id: $tr.data('nid'), iid:$tr.data('iid') });
	});

  //any areas
  $(".node-listview .area[data-nid]").on("click", function(event){
    var $target = $(event.target);
    if ($target.closest('.actionarea').length) return;
		if ($target.closest('a').length) return;
    var $tr = $(this);
    var is = $tr.hasClass('selected');
    $('body').trigger(is?'node.deselect':'node.select', {id: $tr.data('nid'), iid:$tr.data('iid') });
    });





	var loading = 0; // number of loading calls
	var oldLoading = 0;
	var saving = 0;  // number of saving calls
	var oldSaving = 0;
	var error = 0;   // number of errors
	$('body').bind('crag.save.start', function(){ saving++;  renderLoadSave() });
	$('body').bind('crag.save.stop' , function(){ saving--;  renderLoadSave() });
	$('body').bind('crag.load.start', function(){ loading++; renderLoadSave() });
	$('body').bind('crag.load.stop' , function(){ if (loading) loading--; renderLoadSave() });
	$('body').bind('crag.load.stop-all' , function(){ loading = 0; renderLoadSave() });

	$('body').bind('crag.edit.start', function(){ addExitWarning() });
	$('body').bind('crag.edit.stop',  function(){ removeExitWarning() });

    var exitwarning = function (e) {
        e = e || window.event;
        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = 'You have unsaved data';
        }
        // For Safari
        return 'You have unsaved data';
    }
	function addExitWarning(){
        window.addEventListener("beforeunload", exitwarning);
	}
	// if they submit via the main form then turn the warning off
	function removeExitWarning(){
        window.removeEventListener("beforeunload", exitwarning);
	}

	function renderLoadSave(){
		// if no elem then make it
		var feedback = $('#feedback');
		if (!feedback.length){
			$('body').append('<div id="feedback" class="alert"><strong><div class="feedback-title"></div></strong><div class="feedback-details"></div><div class="feedback-footer"></div></div>');
			feedback = $('#feedback');
		}
                var feedbackTitle = feedback.find('.feedback-title');
		if (oldLoading === 0) {
                  resetFeedbackDetails();
                }
		// if saving then save
		if (saving > 0){
			feedbackTitle.text(tc_translate.getText('system.saving'));
			feedback
				.removeClass('alert-success')
				.addClass('waiting')
				.show();
		} else if (oldSaving > 0){
			feedbackTitle.text(tc_translate.getText('system.saved'));
			feedback
				.removeClass('waiting')
				.addClass('alert-success')
				.show(0)
				.delay(2000)
				.fadeOut(500);
			removeExitWarning();

		} else {
			if (loading > 0){
				feedbackTitle.text(tc_translate.getText('system.loading')+ (Array(loading + 1).join('.')));
				feedback
					.removeClass('alert-success')
					.addClass('waiting')
                                        .stop()
					.delay(700)
					.show(0);
			} else {
				feedback
					.fadeOut(0);
			}

		}
		oldLoading = loading;
		oldSaving = saving;
	}

	$("#favorite").unbind('click').bind('click',function(e){
		e.preventDefault();
		var nodeid = $('body').data('nid');
		var acctid = $('body').data('uid');
		var isFav = $('#favorite').hasClass('fav') ? 1 : 0;
		if ( nodeid && acctid ) {
			var f = $('#favorite');
			f.find('i').attr('class','icon-spinner');
			var count = f.next().text().split(',').join('')*1;
			if (isFav) count--;
			else count++;
			f.next().text(count);
			updateFavorite(acctid, nodeid, 1 - isFav, function(){
				var f = $('#favorite');
				f.toggleClass('fav',isFav);
				f.find('i').removeClass('icon-spinner').toggleClass('icon-heart',!isFav).toggleClass('icon-heart-empty',!!isFav);
                	});
		} else  {
			alert("Please login or sign up to add fav crags");
		}
	}); 

	$('#content form.trackunsaved').delegate('input, textarea, select', 'change', function(){
		$('body').trigger('crag.edit.start');
	});
	$('#content form.trackunsaved').submit(function(){
		$('body').trigger('crag.edit.stop');
	});



});

/*
 * Data Access Object for nodes
 * Initally just an in memory access and caching layer around the api
 */
DAO = (function(){
	var cache = {};
        var defaultNodeShow = 'ancestors,children';
	return {
		/*
		 * Returns an object OR if not available calls the callback when it is
		 */	
		getNode: function(id, callback, show=defaultNodeShow){

                        var cacheKey = show === defaultNodeShow ? id : show + ':' + id
			if (cache[cacheKey]){
				callback(cache[cacheKey]);
				return;
			}
			$('body').trigger('crag.load.start');
			$.get('/api/node/id/'+id+'?show='+show,null,function(data){
				cache[cacheKey] = data.data;
				if (data['children']){
					cache[cacheKey].children = data['children']; // TODO remove hack
				}
				$('body').trigger('crag.load.stop');
				callback(cache[cacheKey]);
				return;
			},'json');
		},
		getNodes: function(ids, callback, show=defaultNodeShow){
			var ret = [];
                        
			// if all in cache then return it
			var loadIds = [];
			$.each(ids, function(i, id){
                                var cacheKey = show === defaultNodeShow ? id : show + ':' + id
				if (cache[cacheKey]){
					ret[i] = cache[cacheKey];
				} else {
					ret[i] = {loading: true};
					loadIds.push(id);
				}
			});
			if (loadIds.length == 0){
				callback(ret);
				return;
			}
			theCrag('/api/node/ids?show='+show+'&id='+loadIds.join(','), function(data){
				$.each(data.data, function(i, node){
                                  var cacheKey = show === defaultNodeShow ? node.id : show + ':' + node.id
				  cache[cacheKey] = node;
				});
				$.each(ids, function(i, id){
                                  var cacheKey = show === defaultNodeShow ? id : show + ':' + id
				  ret[i] = cache[cacheKey];
				});
				callback(ret);
			});

		},
		getTranslation: function(key, callback, timeoutMs){
                        var lang = $('html').attr('lang') || 'en';
                        var id = lang + '-' + key;
			if (cache[id]){
				callback(cache[id]);
				return;
			}
                        var timeout = null;
                        if (timeoutMs) {
                          timeout = setTimeout(function() {
			    $('body').trigger('crag.load.stop');
			    callback("");
                          }, timeoutMs); 
                        }
			$('body').trigger('crag.load.start');
			$.get('/api/translate/texts?lang='+lang+'&fallback=en&lookup='+key,null,function(data){
                                if (timeout) {
                                  clearTimeout(timeout);
                                }
                                var obj = data.data && data.data.texts && data.data.texts[key];
				cache[id] = obj ? obj[lang] || obj['en'] : '';
				$('body').trigger('crag.load.stop');
				callback(cache[id]);
				return;
			},'json');
		},
		getAscent: function(id, callback){
			if (cache[id]){
				callback(cache[id]);
				return;
			}
			$('body').trigger('crag.load.start');
			$.get('/api/ascent/id/'+id+'?full=1',null,function(data){
				cache[id] = data.data;
				$('body').trigger('crag.load.stop');
				callback(cache[id]);
				return;
			},'json');
		},
		search: function(search, cfg, callback){
			if (typeof cfg === "function"){
				callback=cfg;
				cfg = {};
			}
			var esctext = encodeURIComponent(search);
			var url = '/api/node' + (cfg.nodeID ? '' : '') + '/search?search=' + esctext + ( cfg.stopifexact ? '&stopifexact='+cfg.stopifexact : '') + ( cfg.oftype ? '&oftype='+cfg.oftype : '');
			theCrag(url,function(data){
			        var ret = [];
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		getAccount: function(id, callback){
			theCrag('/api/climber/id/' + id, function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		mapAccountLabel: function(label, callback){
			theCrag('/api/climber/label/' + encodeURIComponent(label), function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		mapAccountEmail: function(label, callback){
			theCrag('/api/climber/email/' + encodeURIComponent(label), function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		lookupCrag: function(startswith, mode, callback){
			if (typeof mode === "function"){
				callback=mode;
				mode = '';
			}
			theCrag('/api/lookup/crag?page=1&page-size=20&search=' + encodeURIComponent(startswith) + (mode ? '&mode=' + mode : ''), function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		lookupClimber: function(startswith, mode, callback){
			if (typeof mode === "function"){
				callback=mode;
				mode = 'all';
			}
			theCrag('/api/lookup/climber?page=1&page-size=20&search=' + encodeURIComponent(startswith) + (mode ? '&mode=' + mode : ''), function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		forumID: function(nodeid, callback){
			theCrag('/api/node/id/'+nodeid+'/forumid', function(data){
			        var ret = {};
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		},
		accountSearch: function(search, cfg, callback){
			if (typeof cfg === "function"){
				callback=cfg;
				cfg = {};
			}
			var esctext = encodeURIComponent(search);
			var url = '/api/climber/search?search=' + esctext + ( cfg.stopifexact ? '&stopifexact='+cfg.stopifexact : '');
			theCrag(url,function(data){
			        var ret = [];
				if ( data && data.data )   {
					ret = data.data;
				}
				callback(ret);
			});
		}
	}
}());

/*
 * a convenience wrapper around $.ajax
 * theCrag(url,data,success,error)
 */
var theCrag = function(){
	var args = Array.prototype.slice.call(arguments);

	$('body').trigger('crag.load.start');
	var method = args.shift();
	if (!method || method.substr(0,1) == '/'){
		args.unshift(method);
		method = 'GET';
	}
	var url     = args.shift();
	var data    = args.shift();
	if (typeof data === "function"){
		args.unshift(data);
		data = {};
	}
	var success = args.shift();
	var error   = args.shift();

	if (data){
		data = JSON.stringify(data);
	}

	var p = $.ajax({
		processData: false,
		type: method,
		url: url,
		data: data,
		success: success,
		error: error
	});
	p.always(function(){
		$('body').trigger('crag.load.stop');
	});
	return p;
};


/*
    $(function(){$("#tabs").tabs();});
    $(document).ready(function(){
       $(".hideonopen").hide();
    });
*/


// this function is required for message.js and trip.js - at some point it needs proper integration into the DAO
function postAPI(endpoint,json,successfn,failfn)    {
  var matched = endpoint.match(/\?/);
  if ( matched )   {
    endpoint = endpoint + "&cookieAuth=1";
  } else  {
    endpoint = endpoint + "?cookieAuth=1";
  }
  $.ajax({
    type: 'POST',
    url: endpoint,
    data: json,
    dataType: 'json',
    contentType: 'application/json',
    success: successfn,
    error: function(jqXHR,sts,err){
      if ('undefined' === typeof failfn) {
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
      } else  {
        failfn(jqXHR,sts,err);
      }
    }
  });
}

function postAPIWithPromise(endpoint,json)    {
  var matched = endpoint.match(/\?/);
  if ( matched )   {
    endpoint = endpoint + "&cookieAuth=1";
  } else  {
    endpoint = endpoint + "?cookieAuth=1";
  }
  return $.ajax({
    type: 'POST',
    url: endpoint,
    data: json,
    dataType: 'json',
    contentType: 'application/json'
  });
}


function getIDsFromAttr(element,attr,tags) {
  var data = {};
  var pat = ''
  for (var i = 0; i < tags.length ; i++) {
    data[tags[i]] = 0;
    pat += '_([0-9]+)';
  }
  var re = new RegExp(pat);
  if ( element.attr(attr) ) {
    var matched = element.attr(attr).match(re);
    if (matched instanceof Array) {
      for (var i = 0; i < tags.length ; i++) {
        data[tags[i]] = matched[i+1];
      }
    }
  }
  return data;
}


function requestDayPass(acctid,successFn,failFn) {
  url = "/api/account/update";
  atom={account:acctid,requestDayPass:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
}


function addRouteToCircuit(acctid,cctid,nodeid,fn) {
  url = "/api/circuit/update";
  atom={submittor:acctid,circuit:cctid,routes:[{action:"add",nodeID:nodeid}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function starCircuit(acctid,cctid,action,fn) {
  url = "/api/climber/update";
  atom={account:acctid,circuit:[{action:action,id:cctid}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateFavorite(accid,nodeid,sts,fn) {
  url = "/api/climber/update";
  atom={account:accid,favorite:[{node:nodeid,status:sts}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateFollowing(accid,id,sts,fn) {
  url = "/api/climber/update";
  atom={account:accid,follow:[{account:id,status:sts}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateBlockAccount(accid,id,sts,fn) {
  url = "/api/climber/update";
  atom={account:accid,block:[{account:id,status:sts}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateGrantSupporter(accid,id,sts,fn) {
  url = "/api/climber/update";
  atom={account:accid,grantSupporter:[{account:id,status:sts}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateLastFeed(accid,feed,fn) {
  url = "/api/climber/update";
  atom={account:accid,lastFeed:feed};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function updateUserPrefs(accid,key,value,fn) {
  url = "/api/climber/update";
  atom={account:accid,preference:{}};
  atom.preference[key] = value
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}

function updateTags(tagdata, fn) {
  url = "/api/tag/assign";
  json=JSON.stringify(tagdata);
  postAPI(url,json,fn);
}


function updateSessionPrefs(sessionid,key,value,fn) {
  url = "/api/session/update";
  atom={session:sessionid,preference:{}};
  atom.preference[key] = value
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function adminUpdateUserMeta(accid,key,value,refArea,fn) {
  url = "/api/climber/update";
  atom={account:accid,adminUpdate:1,refArea:refArea,meta:{}};
  atom.meta[key] = value
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}

function updateUserCoverPhoto(accid,photoId,isAdmin,successFn,failFn) {
  var url = "/api/climber/update";
  var atom={account:accid,cover:photoId};
  if ( isAdmin ) {
    atom["adminUpdate"] = 1;
  }
  var data={data:atom};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
}

function sendIt(msg,fn,failFn) {
 var url = "/api/message/send?markupType=html";
 var data={data:msg};
 var json=JSON.stringify(data);
 postAPI(url,json,fn,failFn);
 return true;
}

$(function(){
	$('.loggedin .unknown').hover(function(){
		var el = $(this);
		var styles = ["Boulder","Trad","Sport","Top rope","DWS","Aid","Via ferrata","Ice","Alpine","Unknown"];
		var uid = $('body').data('uid');
		var nid = el.closest('[data-nid]');
		if (nid.prop("tagName") == "BODY"){ return; }
		nid = nid.data('nid');
		if (nid){
			createDynamicSytleSelection(styles, el, uid, nid, function(source){
				el.html(source.html()).attr('class',source.attr('class'));
			});
		}
	},function(){
		$("#style-dynamic").remove();
	});
});
/*
 * style - array of styles
 * elem  - a jQuery elem that was hovered
 */
function createDynamicSytleSelection(styles,elem,userid,routeid,callback)  {
	$("#style-dynamic").remove();
	var pos = elem.position();
	var html = '<ul id="style-dynamic" class="dropdown-menu" style="margin-top:1px">';
	html += '<li><p><strong>Know this route\'s style?</strong></p></li>';
	for (var i = 0; i < styles.length ; i++) {
		html += '<li style="display:block"><a href="#"><span class="tags ' + styles[i].toLowerCase() + '">' + styles[i] + '</span></a></li>';
	}
	html += '</ul>';
	$(html).hide().appendTo(elem).css({position:'absolute','z-index':1000,top:pos.top+elem.innerHeight()+1,left:pos.left}).show().find("a").bind('click',function(e){
		var source = $(this).find('.tags');
		var style = source.text();
		callback(source);
		$("#style-dynamic").remove();
		updateStyle(userid,routeid,style,function(){});
		e.preventDefault();
		return false;
	});
}


function updateStyle(accid,nodeid,style,fn) {
  url = "/api/route/update";
  atom={submittor:accid,node:nodeid,gearStyle:style};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}



function ajaxArchiveRoute(nid,uid,fn) {
  url = "/api/route/update";
  atom={node:nid,submittor:uid,archive:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function ajaxUnarchiveRoute(nid,uid,fn) {
  url = "/api/route/update";
  atom={node:nid,submittor:uid,archive:0};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function archiveRoute(event,element) {
  event.preventDefault();
  var route = element.closest('[data-nid]');
  var nid = route.data('nid');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxArchiveRoute(nid,uid,function(){
      $('body').trigger('node.deselect', {id: nid});
      route.addClass("archived");
    });
  }
  return false;
}


function unarchiveRoute(event,element) {
  event.preventDefault();
  var route = element.closest('[data-nid]');
  var nid = route.data('nid');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxUnarchiveRoute(nid,uid,function(){
      route.removeClass("archived");
      route.find(".label-archived").hide();
    });
  }
  return false;
}



function ajaxArchiveArea(nid,uid,fn) {
  url = "/api/area/update";
  atom={node:nid,submittor:uid,archive:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function ajaxUnarchiveArea(nid,uid,fn) {
  url = "/api/area/update";
  atom={node:nid,submittor:uid,archive:0};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function archiveArea(event,element) {
  event.preventDefault();
  var area = element.closest('[data-nid]');
  var nid = area.data('nid');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxArchiveArea(nid,uid,function(){
      $('body').trigger('node.deselect', {id: nid});
      area.addClass("archived");
    });
  }
  return false;
}


function unarchiveArea(event,element) {
  event.preventDefault();
  var area = element.closest('[data-nid]');
  var nid = area.data('nid');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxUnarchiveArea(nid,uid,function(){
      area.removeClass("archived");
      area.find(".label-archived").hide();
    });
  }
  return false;
}

function thecrag_lang_climbing_prefix(lang)   {
  if ( lang ) {
    switch (lang) {
      case 'en':
        return '/en/climbing';
      case 'de':
        return '/de/klettern';
      case 'ko':
        return '/ko/climbing';
      case 'it':
        return '/it/arrampicar';
      case 'fr':
        return '/fr/grimper';
      case 'es':
        return '/es/escalar';
      case 'zh_hans':
        return '/zh_hans/climbing';
    }
  }
  return '/climbing';
}


function thecrag_index_url(data,ctl)   {
  // alert("DEBUG:thecrag_index_url:start");
  ctl = ctl ? ctl : {};
  var type    = ctl.type    ? ctl.type    : (data.type    ? data.type    : 'area');
  var trailer = ctl.trailer ? ctl.trailer : (data.trailer ? data.trailer : ''    );
  var def = ctl['default'] ? ctl['default'] : '';
  var src = '';
  var prefix = thecrag_lang_climbing_prefix(ctl.lang)
  if ( type.match(/^(area|route)$/) )   {
    if ( data.urlStub )   {
      src = prefix + '/' + data.urlStub;
    } else if ( data.urlAncestorStub )   {
      src = prefix + '/' + data.urlAncestorStub + '/' + type + '/' + data.id;
    } else if ( def )   {
      src = def;
    } else {
      src = '/' + type + '/' + data.id;
    }
  }
  if ( trailer )   {
    src += (trailer.match(/^[\/\?]/)? '' : '/') + trailer;
  }
  // alert("DEBUG:thecrag_index_url:"+src);
  return src;
}


function escapeHTML(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

/*
 * selected bits from https://github.com/h5bp/mobile-boilerplate
 */
(function(document) {
    window.MBP = window.MBP || {};

    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');

    MBP.preventZoom = function() {
	if (!!document.querySelectorAll) return;
        var formFields = document.querySelectorAll('input, select, textarea');
        var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        var i = 0;
        var fieldLength = formFields.length;

        var setViewportOnFocus = function() {
            MBP.viewportmeta.content = contentString + '1';
        };

        var setViewportOnBlur = function() {
            MBP.viewportmeta.content = contentString + '10';
        };

        for (; i < fieldLength; i++) {
            formFields[i].onfocus = setViewportOnFocus;
            formFields[i].onblur = setViewportOnBlur;
        }
    };
    MBP.autogrow = function(element, lh) {
        function handler(e) {
            var newHeight = this.scrollHeight;
            var currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }

        var setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;

        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);

        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('input', handler, false) : element.attachEvent('onpropertychange', handler);
    };

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    MBP.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    MBP.getScrollTop = function() {
        var win = window;
        var doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    MBP.hideUrlBar = function() {
        var win = window;

        // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
        }
    };

    MBP.hideUrlBarOnLoad = function() {
        var win = window;
        var doc = win.document;
        var bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if ( !location.hash && win.addEventListener ) {

            // scroll to 1
            window.scrollTo( 0, 1 );
            MBP.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function() {
                if ( doc.body ) {
                    clearInterval( bodycheck );
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15 );

            win.addEventListener('load', function() {
                setTimeout(function() {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if (MBP.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };


})(document);

MBP.preventZoom();
MBP.hideUrlBar();

function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}
/*
	var node = target;
	do {
		if ((/\bneedsclick\b/).test(node.className)) return true;
	
	}
	while (node = node.parent);
	return false;
*/
	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
	case 'select':
		return true;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	if (this.deviceIsIOS && targetElement.setSelectionRange) {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	// If the touch has moved, cancel the click tracking
	if (this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	if ((/Chrome\/[0-9]+/).test(navigator.userAgent)) {

		// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && metaViewport.content.indexOf('user-scalable=no') !== -1) {
				return true;
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


// if (typeof define !== 'undefined' && define.amd) {
// 
// 	// AMD. Register as an anonymous module.
// 	define(function() {
// 		'use strict';
// 		return FastClick;
// 	});
// } else if (typeof module !== 'undefined' && module.exports) {
// 	module.exports = FastClick.attach;
// 	module.exports.FastClick = FastClick;
// } else {
// 	window.FastClick = FastClick;
// }
// 
// FastClick.attach(document.body);
// 
// 


// ******** START GENERAL HELPER FUNCTIONS ********************

function subURLArg(url,lbl,val) {
  var reg = new RegExp('([?])'+lbl+'=[^&]*&?',"g");
  url = url.replace(reg,'$1');
  reg = new RegExp('&'+lbl+'=[^&]*',"g");
  url = url.replace(reg,'');
  url = url.replace(/[?&]+$/,'');
  if (typeof val !== 'undefined' ) {
    if (!url.match(/[?]/)) {
      url += '?';
    }
    if (!url.match(/[?]$/)) {
      url += '&';
    }
    url += lbl + '=' + val;
  }
  return url;
}

// ********   END GENERAL HELPER FUNCTIONS ********************



// ******** START URL REPLACE EMBED ********************
var URLReplace = {

  resolver: {},

  functions: {},

  resolve: function (resolve) {
    // alert("resolve:" + resolve);
    if ( 'undefined' === typeof URLReplace.resolver[resolve] )  {
      URLReplace.resolver[resolve] = $.Deferred();
    }
    URLReplace.resolver[resolve].resolve();
  },

  resolveTrigger: function ($elem,ctl) {
    //alert("resolveTrigger");
    var resolve = $elem.data('replace-resolve');
    if ( resolve && resolve.length ) {
      if ( 'undefined' === typeof URLReplace.resolver[resolve] )  {
        URLReplace.resolver[resolve] = $.Deferred();
      }
      URLReplace.resolver[resolve].done(function () {URLReplace.trigger($elem,ctl);});
    } else {
      URLReplace.trigger($elem,ctl);
    }
  },

  trigger: function ($elem,ctl) {
    //alert("trigger");
    var control = ctl || {};
    var url = $elem.data('replace-url');
    if ( !url || !url.length )  {
      alert("Error: no stream-url defined");
      return false;
    }
    var cont = $elem.data('replace-container');
    if ( !cont || !cont.length )  {
      alert("Error: no replace-container defined");
      return false;
    }
    var $container = $elem.closest(cont);
    var embed = $elem.data('replace-content');
    if ( !embed || !embed.length )  {
      alert("Error: no replace-content defined");
      return false;
    }
    var $embed = $container.find(embed);
    $container.find('.replace-notification').remove();
    $elem.blur()
    if ('undefined' === typeof control.url) {
      control.url = url;
    }
    var mode = $elem.data('replace-mode');
    if ( mode && mode.length )  {
      control.mode = mode;
    } else {
      control.mode = 'append';
    }
    var prepare = $elem.data('replace-prepare');
    if ( prepare && prepare.length && 'undefined' !== typeof URLReplace.functions[prepare] )  {
      control = URLReplace.functions[prepare]($elem,$container,$embed,control);
    }
    var func = $elem.data('replace-function');
    if ( func && func.length && 'undefined' !== typeof URLReplace.functions[func] )  {
      control.embedder = URLReplace.functions[func];
    }
    URLReplace.embed($elem,$container,$embed,control);
  },

  embed: function ($elem,$container,$embed,control) {
    //alert("embed: "+control.url);
    var waiting =  '<div class="waiting" style="height:5em;"></div>';
    var indev = 0;
    if ( indev ) {
      niceurl = control.url
      niceurl = subURLArg(niceurl,'embed','off');
      $('<p class="replace-notification">Embed URL debug, turn off before prod release: <a href="' + niceurl + '">' + niceurl + '</a></p>').insertAfter($elem);
    }
    $elem.before(waiting);
    $.ajaxSetup({
      xhrFields: {
        withCredentials: true
      }
    });
    var jqxhr = $.ajax(control.url)
    .done(function(content) {
      $container.find('.waiting').remove();
      if ('undefined' === typeof control.embedder) {
        if ( control.mode == 'append' )  {
          $embed.append(content);
        } else if ( control.mode == 'replace' )  {
          $embed.html(content);
        }
      } else {
        control.embedder($elem,$container,$embed,control,content);
      }
    })
    .fail(function() {
      $container.find('.waiting').remove();
      var niceurl = subURLArg(control.url,'embed','off');
      $('.stream').append('<p class="replace-notification">Failed to get stream, please refresh the page to see if the problem was temporary or click the direct url <a href="' + niceurl + '">' + niceurl + '</a></p>');
    })
  }

};

(function(){
 $("body").on("click", "[data-replace-url]", function(e){
  //alert("click");
  e.preventDefault();
  var control = {init:0};
  URLReplace.resolveTrigger($(this),control);
 });
 $(".replace-initialise[data-replace-url]").each(function(){
  //alert("init");
  var control = {init:1};
  URLReplace.resolveTrigger($(this),control);
 });
})();

// ********   END URL REPLACE EMBED ********************



// ********   START ROTATE IMAGE ********************

var ImageUploadRotate = {
  anticlockwise_stub: ['filters:rotate(90)/','','filters:rotate(270)/','filters:rotate(180)/'],
  anticlockwise_position: [3,0,1,2],
  clockwise_stub: ['filters:rotate(270)/','filters:rotate(180)/','filters:rotate(90)/',''],
  clockwise_position: [1,2,3,0],
  positions: {},
  init_image: function (id,pos) {
    ImageUploadRotate.positions[id] = pos;
  },
  rotate_anticlockwise: function ($imgcontainer) {
    $('body').trigger('crag.load.start');
    var url = "/api/image/transform";
    var id = $imgcontainer.data('id');
    var atom={group:$imgcontainer.data('group'),id:id,anticlockwise:1};
    var data={data:atom};
    var json=JSON.stringify(data);
    postAPI(url,json,function(){
      var rstub = ImageUploadRotate.anticlockwise_stub[ImageUploadRotate.positions[id]];
      $imgcontainer.data('url-rotate-stub',rstub);
      ImageUploadRotate.positions[id] = ImageUploadRotate.anticlockwise_position[ImageUploadRotate.positions[id]];
      var imgurl = $imgcontainer.data('server') + $imgcontainer.data('url-size-stub') + rstub + $imgcontainer.data('url-hash-stub');
      $imgcontainer.html('<img src="' + imgurl + '" />');
      $('body').trigger('crag.load.stop');
    });
  },
  rotate_clockwise: function ($imgcontainer) {
    $('body').trigger('crag.load.start');
    var url = "/api/image/transform";
    var id = $imgcontainer.data('id');
    var atom={group:$imgcontainer.data('group'),id:id,clockwise:1};
    var data={data:atom};
    var json=JSON.stringify(data);
    postAPI(url,json,function(){
      var rstub = ImageUploadRotate.clockwise_stub[ImageUploadRotate.positions[id]];
      $imgcontainer.data('url-rotate-stub',rstub);
      ImageUploadRotate.positions[id] = ImageUploadRotate.clockwise_position[ImageUploadRotate.positions[id]];
      var imgurl = $imgcontainer.data('server') + $imgcontainer.data('url-size-stub') + rstub + $imgcontainer.data('url-hash-stub');
      $imgcontainer.html('<img src="' + imgurl + '" />');
      $('body').trigger('crag.load.stop');
    });
  }
};

(function(){
  $(".image-container").each(function(){
    var pos = 0;
    if ( $(this).data('position') ) {
      pos = $(this).data('position');
    }
    id = $(this).data('id');
    ImageUploadRotate.init_image(id,pos);
  });
  $(".rotate-clockwise").click(function(){
    var $rot = $(this).parent().find("[data-group]");
    ImageUploadRotate.rotate_clockwise($rot);
  });
  $(".rotate-anticlockwise").click(function(){
    var $rot = $(this).parent().find("[data-group]");
    ImageUploadRotate.rotate_anticlockwise($rot);
  });
})();

// ********   END ROTATE IMAGE ********************



// ********   START IMAGE READY ********************

(function(){
  function reloadImage(element){
    rstub = '';
    if ( element.data('url-rotate-stub') ) {
      rstub = element.data('url-rotate-stub');
    }
    var imgurl = element.data('server') + element.data('url-size-stub') + rstub + element.data('url-hash-stub');
    element.html('<img src="' + imgurl + '" />');
  }
  function evaluateImageContainer(){
    $(".image-container").each(function(){
      $imgcontainer = $(this);
      ready = '';
      if ( $imgcontainer.data('ready') ) {
        rstub = $imgcontainer.data('ready');
      }
      if ( ready == 'ready' )   {
        reloadImage($imgcontainer);
      } else {
        var checkURL = '/api/image/ready/' + $imgcontainer.data('hash');
	$.get(checkURL,function(data){
          if ( data && data.data && data.data.ready && data.data.ready == 1 )   {
            $imgcontainer.data('ready','ready');
            reloadImage($imgcontainer);
          } else  {
            setTimeout(function() {
             evaluateImageContainer();
            }, 500);
          }
        });
      }
    });
  }
  evaluateImageContainer();
})();
// ********   END IMAGE READY ********************



// ********   START INLINE ATTACHMENT ********************

function initialiseInlineAttachments() {
  $("textarea.inline-attachment").each(function(){
    var $attachElement = $(this);
    var initialised = $attachElement.data('inline-attachment-initialised');
    if (!initialised) {
      $attachElement.data('inline-attachment-initialised',true);
      var nodeID = $attachElement.data('node-id');
      var privateDiscussionID = $attachElement.data('private-discussion-id');
      $attachElement.inlineattachment({
        uploadUrl: '/upload-inline-attachment',
        allowedTypes: allowedTypes,
        extraParams: {
          mode: 'createPhoto',
          nodeID: nodeID,
          privateDiscussionID: privateDiscussionID
        },
        onFileUploadError: function(xhr) {
          var result = JSON.parse(xhr.responseText);
          errorText = result.error;
          alert("Error uploading file:" + errorText);
          return true;
        },
        urlText: function(filename,result)  {
          if ( result.photoID )   {
            return '\nhttps://www.thecrag.com/photo/' + result.photoID + "\n";
          } else {
            return "Upload Error!\n";
          }
        },
        onFileUploaded: function(filename) {
          $attachElement.keyup();
        }
      });
      $attachElement.closest('form').find(".inline-attachment-select").click(function(){
        var input = document.createElement('input');
        input.setAttribute('type','file');
        input.setAttribute('accept',allowedTypes.join());
        $(input).change(function(e){
          var evt = e.originalEvent;
          var files = evt.target.files || [];
          if ( files[0] ) { // simulate a drop event
            $attachElement.trigger($.Event('drop', {originalEvent: { dataTransfer: { files: files }}}));
          }
        });
        input.click();
      });
    }
  });
}

(function(){
  function deferInlineAttachment(method) {
    if ( $.isFunction( $.fn.inlineattachment ) )   {
      method();
    } else {
      setTimeout(function() { deferInlineAttachment(method) }, 500);
    }
  }
  allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif'
  ];
  function inlineAttachmentLoaded(){
    initialiseInlineAttachments();
  }
  deferInlineAttachment(inlineAttachmentLoaded);
})();

// ********   END INLINE ATTACHMENT ********************

// ********   START GENERAL MODAL ********************
$('body').on('shown.bs.modal', '.modal', function () {
   if (window.history && window.history.pushState) {
     var currentUrlNoHash = window.location.href.split("#")[0];
     var state = window.history.state;
     var prevUrl = state ? state.prevUrl : undefined;
     if (prevUrl !== currentUrlNoHash) {
       window.history.pushState({prevUrl: currentUrlNoHash}, '', currentUrlNoHash + '#modal');
     }
   }
})

$('body').on('hidden.bs.modal', '.modal', function () {
   if (window.history && window.history.pushState) {
     var currentUrl = window.location.href
     var urlArgs = currentUrl.split("#");
     var currentUrlNoHash = urlArgs[0];
     var currentHash = urlArgs[1];
     var state = window.history.state;
     var prevUrl = state ? state.prevUrl : undefined;
     if (prevUrl === currentUrlNoHash && currentHash === 'modal') {
       window.history.pushState({prevUrl: currentUrl}, '', currentUrlNoHash);
     }
   }
})

$(window).on('hashchange', function (e) {
  var oldURL = (e.originalEvent || {}).oldURL || '';
  if(oldURL.match(/#modal$/) && location.hash === ''){
    $('.modal:visible').modal('hide');
  }
})

// ********   END GENERAL MODAL ********************


// ********   START RAISE WARNING ********************

function showRaiseWarningModal(nodeID,nodeName){
  $("#raise-warning-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name="title"]').focus();
    });
    modal.modal('show');
    var nodeinput = modal.find('input[name="node"]');
    nodeinput.val(nodeID);
    var name_elem = modal.find('.target-raise-warning-node-name');
    name_elem.html(nodeName);
  });
}


function completeRaiseWarningModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var form = button.closest("form");
    var nid = form.find('input[name="node"]').val();
    var acctid = $('body').data('uid');
    var cat = form.find('input[name="category"]:checked').val();
    var title = form.find('input[name="title"]').val();
    var desc = form.find('textarea[name="description"]').val();
    var warning = {category:cat,title:title,description:desc};
    raiseWarning(acctid,nid,warning,function(data){
      if (data && data.ok) {
        $('body').trigger('crag.save.stop');
        modal.modal('hide');
        button.removeClass('disabled');
        location.reload();
      }
    },function(jqXHR,sts,err){
      alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
      $('body').trigger('crag.save.stop');
      button.removeClass('disabled');
    });
  }
}

function raiseWarning(acctid,nid,warning,successFn,failFn) {
  url = "/api/message/send?markupType=html";
  msg = {fromAccount:acctid,node:nid,warning:warning};
  data={data:msg};
  json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

(function(){
  $(".fn-init-raise-warning").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-init-raise-warning');
    return showRaiseWarningModal(elem.data('node-id'),elem.data('node-name'));
  }); 
  $(".fn-complete-raise-warning").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-raise-warning');
    var modal = elem.closest('.modal');
    return completeRaiseWarningModal_ajax(modal,elem);
  }); 
})();

// ********   END RAISE WARNING ********************


// ********   START LIST ********************

function addListSelectionToListModal(modal,listSelection,listOfLists){
  if (listOfLists.length === 0) {
    modal.find('input:radio[name=action][value=new]').click();
    hideActionDependantFieldsForListModal(modal,'new','unselectable');
  } else {
    if (listOfLists.length > 1) {
      listSelection.append($('<option>', {value: ''}).text(' -- '));
    }
    for (var i = 0; i < listOfLists.length ; i++) {
      var id = listOfLists[i][0];
      var name = listOfLists[i][1];
      listSelection.append($('<option>', {value: id}).text(escapeHTML(name)));
    }
    if (listOfLists.length > 1) {
      var defaultList = modal.find('input[name=defaultList]').val();
      if (defaultList) {
        listSelection.val(defaultList);
      }
    }
    modal.find('input:radio[name=action][value=existing]').click();
  }
  $('body').trigger('crag.load.stop');
}

function validateListModal(modal){
  var valid = true;
  var action = modal.find('input[name=action]:checked').val();
  hideActionDependantFieldsForListModal(modal,action,'unchanged');
  if (action === 'existing') {
    var list = modal.find('select[name=list]').val();
    if (list === undefined || list === null || list.length === 0) {
      valid = false;
    }
  } else if (action === 'new') {
    var name = modal.find('input[name=name]').val();
    if (name === undefined || name === null || name.length === 0) {
      valid = false;
    }
    var permissionsModel = modal.find('input[name=permissionsModel]:checked').val();
    if (permissionsModel === undefined || permissionsModel === null || permissionsModel.length === 0) {
      valid = false;
    }
    var attachedTo = modal.find('select[name=attachedTo]').val();
    if (attachedTo === undefined || attachedTo === null || attachedTo.length === 0) {
      valid = false;
    }
  } else {
    valid = false;
  }
  if ( valid ) {
    modal.find('.fn-complete-add-to-list').removeClass('disabled').prop('disabled', false);
  } else {
    modal.find('.fn-complete-add-to-list').addClass('disabled').prop('disabled', true);
  }
}

function hideActionDependantFieldsForListModal(modal,action,selectable){
  if ( action === 'new' ) {
    modal.find('.hide-unless-new').show();
    modal.find('.hide-unless-existing').hide();
  } else if ( action === 'existing' ) {
    modal.find('.hide-unless-new').hide();
    modal.find('.hide-unless-existing').show();
  } else {
    modal.find('.hide-unless-new').hide();
    modal.find('.hide-unless-existing').hide();
  }
  if ( selectable === 'selectable' ) {
    modal.find('.hide-unless-selectable').show();
  } else if ( selectable === 'unselectable' ) {
    modal.find('.hide-unless-selectable').hide();
  }
}

function showAssignPhotoToListModal(){
  $("#assign-photo-to-list-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=title]').focus();
    });
    modal.modal('show');
    var listSelection = modal.find('select[name=list]');
    listSelection.html('');
    $('body').trigger('crag.load.start');
    $.get('/api/account/id/me/target-lists?photoless=1&flatten=data[id,name]', function(data){
      addListSelectionToListModal(modal,listSelection,data[0]);
    });
  });
}

function showAddToListModal(nodeIDs,nodeNames){
  $("#add-to-list-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=title]').focus();
    });
    modal.modal('show');
    modal.find(":input").off('change paste keyup').on('change paste keyup', function () {
      validateListModal(modal);
    });
    var nodeItemInput = modal.find('input[name=node]');
    nodeItemInput.val(nodeIDs.join(','));
    var nodeItemName = modal.find('.target-add-to-list-node-name');
    nodeItemName.html('');
    for (var i = 0; i < nodeNames.length ; i++) {
      nodeItemName.append($('<div>' + nodeNames[i] + '</div>'));
    }
    modal.find('input[name=name]').val('');
    var action = modal.find('input[name=action]:checked').val();
    hideActionDependantFieldsForListModal(modal,action,'selectable');
    validateListModal(modal);
    var listSelection = modal.find('select[name=list]');
    listSelection.html('');
    var nodeID = nodeIDs[0];
    $('body').trigger('crag.load.start');
    $.get('/api/account/id/me/target-lists?node=' + nodeID + '&flatten=data[id,name]', function(data){
      addListSelectionToListModal(modal,listSelection,data[0]);
    });
  });
}

function showEditListModal(){
  $("#edit-list-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=name]').focus();
    });
    var list = $('.list-container');
    if (list.length) {
      var listID = list.data('list-id');
      var name = list.data('list-name');
      var isAdmin = list.data('is-admin');
      modal.find('input[name=name]').val(name).prop('disabled', isAdmin == 0);

      var description = list.find('.list-description').data('description');
      modal.find('textarea[name=description]').val(description);
      var attachedToID = modal.find('input[name=attachedToID]').val();
      var attachedToName = modal.find('input[name=attachedToName]').val();
      var attachedToSelection = modal.find('select[name=attachedTo]');
      modal.find('input[name=permissionsModel]').prop('disabled', isAdmin == 0);
      attachedToSelection.prop('disabled', isAdmin == 0);
      attachedToSelection.html('');
      $.get('/api/list/id/'+listID+'/attachables?flatten=data[id,name]', function(data){
        var attachables = data[0];
        var found = false;
        attachedToSelection.append($('<option>', {value: ''}).text(' -- '));
        for (var i = 0; i < attachables.length ; i++) {
          var id = attachables[i][0];
          var name = attachables[i][1];
          attachedToSelection.append($('<option>', {value: id}).text(escapeHTML(name)));
          if (!found && attachedToID && attachedToID === id) {
            found = true;
          }
        }
        if (attachedToID && attachedToName) {
          if (!found) {
            attachedToSelection.append($('<option>', {value: attachedToID}).text(escapeHTML(attachedToName)));
          }
          attachedToSelection.val(attachedToID);
        }
        modal.modal('show');
      });
    }
  });
}

function showEditListItemModal(itemId){
  $("#edit-list-item-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=comment]').focus();
    });
    var item = $('.node-listview .list-item[data-iid=' + itemId + ']')
    if (item.length) {
      modal.find('input[name=item]').val(itemId);
      var sequence = item.find('.item-sequence').data('sequence');
      modal.find('select[name=sequence]').val(sequence);
      var comment = item.find('.item-comment').data('comment');
      modal.find('textarea[name=comment]').val(comment);
      var name = item.find('.primary-node-name').text();
      modal.find('.target-item-name').text(escapeHTML(name));
      modal.modal('show');
    }
  });
}

function completeAssignPhotoToListModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var acctid = $('body').data('uid');
    var form = button.closest("form");
    var listId = form.find('select[name=list]').val();
    var photoId = form.find('input[name=photo]').val();
    if ( acctid>0 && listId>0 && photoId>0 )   {
      var data = {photo: photoId};
      updateList(acctid,listId,data,function(data){
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
      });
    }
  }
}

function completeAddToListModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var form = button.closest("form");
    var nodeIDs = form.find('input[name=node]').val().split(',');
    var acctid = $('body').data('uid');
    var list = form.find('select[name=list]').val();
    var name = form.find('input[name=name]').val();
    var permissionsModel = form.find('input[name=permissionsModel]:checked').val();
    var attachedTo = form.find('select[name=attachedTo]').val();
    var items = nodeIDs.map(function(nodeID) {
      return {itemType:'Node',item:nodeID};
    });
    var reloadAfterAdd = modal.find('input[name=reload-after-add]').val();
    var action = modal.find('input[name=action]:checked').val();
    addOrCreateList(acctid,action,list,permissionsModel,name,attachedTo,items,function(data){
      button.removeClass('disabled');
      if ( reloadAfterAdd ) {
        location.reload();
      } else {
        modal.modal('hide');
        $('body').trigger('crag.save.stop');
      }
    },function(jqXHR,sts,err){
      alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
      button.removeClass('disabled');
      $('body').trigger('crag.save.stop');
    });
  }
}

function completeEditListModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var acctid = $('body').data('uid');
    var form = button.closest("form");
    var listId = form.find('input[name=list]').val();
    if ( acctid>0 && listId>0 )   {
      var isAdmin = $('.list-container').data('is-admin');
      var name = form.find('input[name=name]').val();
      var description = form.find('textarea[name=description]').val();
      var attachedTo = form.find('select[name=attachedTo]').val();
      var permissionsModel = form.find('input[name=permissionsModel]:checked').val();
      var data = {};
      if (isAdmin == 1) {
        data = {description: description, name: name, attachedTo: attachedTo, permissionsModel: permissionsModel};
      } else {
        data = {description: description};
      }
      updateList(acctid,listId,data,function(data){
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
      });
    }
  }
}

function completeEditListItemModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var acctid = $('body').data('uid');
    var form = button.closest("form");
    var listId = form.find('input[name=list]').val();
    var itemId = form.find('input[name=item]').val();
    if ( acctid>0 && listId>0 && itemId )   {
      var comment = form.find('textarea[name=comment]').val();
      var sequence = form.find('select[name=sequence]').val();
      var item = {id: itemId, comment: comment, sequence: sequence};
      editListItem(acctid,listId,item,function(data){
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
      });
    }
  }
}

function addOrCreateList(acctid,action,list,permissionsModel,name,attachedTo,items,successFn,failFn) {
  if (action === 'existing') {
    addToList(acctid,list,items,successFn,failFn);
  } else if (action === 'new') {
    addToNewNodeAttachedList(acctid,permissionsModel,name,attachedTo,items,successFn,failFn);
  } else {
    return false;
  }
  return true;
}

function addToNewNodeAttachedList(acctid,permissionsModel,name,attachedTo,items,successFn,failFn) {
  url = "/api/list/create?markupType=html";
  msg = {submittor:acctid,name:name,permissionsModel:permissionsModel,attachedType:'Node',attachedTo:attachedTo,items:items};
  data={data:msg};
  json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function addToList(acctid,list,items,successFn,failFn) {
  var url = "/api/list/update?markupType=html";
  var msg = {submittor:acctid,list:list,items:items};
  var data={data:msg};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function updateList(acctid,list,data,successFn,failFn) {
  var url = "/api/list/update?markupType=html";
  var listData = {submittor:acctid,list:list};
  if ( data.description !== undefined ) {
    listData.description = data.description;
  }
  if ( data.name ) {
    listData.name = data.name;
  }
  if ( data.permissionsModel ) {
    listData.permissionsModel = data.permissionsModel;
  }
  if ( data.attachedTo !== undefined ) {
    if ( data.attachedTo ) {
      listData.attachedType = 'Node';
      listData.attachedTo = data.attachedTo;
    } else {
      listData.attachedTo = '';
    }
  }
  if ( data.archived !== undefined ) {
    listData.archived = data.archived;
  }
  if ( data.promoted !== undefined ) {
    listData.promoted = data.promoted;
  }
  if ( data.photo !== undefined ) {
    listData.photo = data.photo;
  }
  var data={data:listData};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function editListItem(acctid,list,item,successFn,failFn) {
  var url = "/api/list/update?markupType=html";
  var msg = {submittor:acctid,list:list,items:[item]};
  var data={data:msg};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function removeFromList(acctid,list,itemIds,successFn,failFn) {
  var url = "/api/list/update?markupType=html";
  var items = [];
  $.each(itemIds, function(i, id){
    items.push({id:id,delete:1});
  });
  var msg = {submittor:acctid,list:list,items:items};
  var data={data:msg};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

(function(){
  $(".fn-init-assign-photo-to-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    return showAssignPhotoToListModal();
  }); 
  $(".fn-init-add-to-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-init-add-to-list');
    return showAddToListModal([elem.data('node-id')],[elem.data('node-name')]);
  }); 
  $(".fn-complete-assign-photo-to-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-assign-photo-to-list');
    var modal = elem.closest('.modal');
    return completeAssignPhotoToListModal_ajax(modal,elem);
  }); 
  $(".fn-complete-add-to-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-add-to-list');
    var modal = elem.closest('.modal');
    return completeAddToListModal_ajax(modal,elem);
  }); 
  $(".fn-complete-edit-list-item").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-edit-list-item');
    var modal = elem.closest('.modal');
    return completeEditListItemModal_ajax(modal,elem);
  }); 
  $(".fn-init-edit-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    return showEditListModal();
  }); 
  $(".fn-complete-edit-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-edit-list');
    var modal = elem.closest('.modal');
    return completeEditListModal_ajax(modal,elem);
  }); 
  $(".fn-remove-photo-from-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-remove-photo-from-list');
    var acctid = $('body').data('uid');
    var listId = elem.data("list-id")
    if ( acctid>0 && listId>0 )   {
      $('body').trigger('crag.save.start');
      updateList(acctid,listId,{photo: null},function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  }); 
  $(".fn-archive-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-archive-list');
    var acctid = $('body').data('uid');
    var listId = elem.data("list-id")
    if ( acctid>0 && listId>0 )   {
      $('body').trigger('crag.save.start');
      updateList(acctid,listId,{archived: 1},function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  });
  $(".fn-promote-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-promote-list');
    var acctid = $('body').data('uid');
    var listId = elem.data("list-id")
    if ( acctid>0 && listId>0 )   {
      $('body').trigger('crag.save.start');
      updateList(acctid,listId,{promoted: 1},function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  });
  $(".fn-unpromote-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-unpromote-list');
    var acctid = $('body').data('uid');
    var listId = elem.data("list-id")
    if ( acctid>0 && listId>0 )   {
      $('body').trigger('crag.save.start');
      updateList(acctid,listId,{promoted: 0},function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  });
  $(".fn-unarchive-list").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-unarchive-list');
    var acctid = $('body').data('uid');
    var listId = elem.data("list-id")
    if ( acctid>0 && listId>0 )   {
      $('body').trigger('crag.save.start');
      updateList(acctid,listId,{archived: 0},function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  }); 
})();

function removeSelectedListItems(event,element) {
  event.preventDefault();
  $('body').trigger('crag.save.start');
  var triggeredItem = element.closest('[data-iid]');
  var selected = triggeredItem.siblings('[data-iid].selected').add(triggeredItem);
  var itemIds = [];
  selected.each(function(){
    var itemId = $(this).data('iid');
    itemIds.push(itemId);
  })
  var listId = $('body').data('is-list');
  var uid = $('body').data('uid');
  if ( itemIds.length>0 && uid>0 && listId>0 )   {
    removeFromList(uid,listId,itemIds,function(){
      $('body').trigger('crag.save.stop');
      selected.remove();
    },function(jqXHR,sts,err){
      alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
      $('body').trigger('crag.save.stop');
    });
  }
  return false;
}

// ********   END LIST ********************


// ********   START COPYRIGHT REVIEW  ********************

function showStartCopyrightReviewModal(){
  $("#start-copyright-review-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=email-user-flag]').focus();
    });
    modal.modal('show');
  });
}

function showResolveGoodCopyrightReviewModal(){
  $("#resolve-good-copyright-review-modal").each(function(){
    var modal = $(this);
    modal.on('shown', function () {
      $('input[name=comment]').focus();
    });
    modal.modal('show');
  });
}

function startCopyrightReview(atom,successFn,failFn) {
  var url = "/api/copyright-review/create";
  var data={data:atom};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function resolveCopyrightReview(atom,successFn,failFn) {
  var url = "/api/copyright-review/update?markupType=html";
  var data={data:atom};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function completeStartCopyrightReviewModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var acctid = $('body').data('uid');
    var form = button.closest("form");
    if ( acctid>0 )   {
      var type = form.find('input[name=type]').val();
      var object = form.find('input[name=object]').val();
      var emailUserFlag = form.find('input[name=email-user-flag]:checked').val() ? '1' : '0';
      var data = {submittor: acctid, type: type, object: object, emailUserFlag: emailUserFlag};
      startCopyrightReview(data,function(data){
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
      });
    }
  }
}

function completeResolveGoodCopyrightReviewModal_ajax(modal,button){
  if ( !button.hasClass('disabled') )   {
    button.addClass('disabled');
    $('body').trigger('crag.save.start');
    var acctid = $('body').data('uid');
    var form = button.closest("form");
    var copyrightReviewId = form.find('input[name=copyright-review-id]').val();
    var comment = form.find('textarea[name=comment]').val();
    if ( acctid>0 && copyrightReviewId>0 )   {
      var data = {copyrightReview: copyrightReviewId, resolver: acctid, reviewStatus: 'Good', comment: comment};
      resolveCopyrightReview(data,function(data){
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
        button.removeClass('disabled');
      });
    }
  }
}

(function(){
  $(".fn-init-start-copyright-review").unbind('click').bind('click',function(e){
    e.preventDefault();
    return showStartCopyrightReviewModal();
  }); 

  $(".fn-init-resolve-good-copyright-review").unbind('click').bind('click',function(e){
    e.preventDefault();
    return showResolveGoodCopyrightReviewModal();
  }); 

  $(".fn-complete-start-copyright-review").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-start-copyright-review');
    var modal = elem.closest('.modal');
    return completeStartCopyrightReviewModal_ajax(modal,elem);
  }); 

  $(".fn-complete-resolve-good-copyright-review").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-resolve-good-copyright-review');
    var modal = elem.closest('.modal');
    return completeResolveGoodCopyrightReviewModal_ajax(modal,elem);
  }); 

  $(".fn-resolve-bad-copyright-review").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-resolve-bad-copyright-review');
    var acctid = $('body').data('uid');
    var copyrightReviewId = elem.data("copyright-review-id")
    if ( acctid>0 && copyrightReviewId>0 )   {
      if (confirm('Are you sure you want to treat this resource as a copyright infringement?')) {
        $('body').trigger('crag.save.start');
        var data = {copyrightReview: copyrightReviewId, resolver: acctid, reviewStatus: 'Bad'};
        resolveCopyrightReview(data,function(data){
          $('body').trigger('crag.save.stop');
          location.reload();
        },function(jqXHR,sts,err){
          alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
          $('body').trigger('crag.save.stop');
        });
      }
    }
  }); 
})();
// ********   END COPYRIGHT REVIEW  ********************


// ********   START ACCOUNT COVER ********************
(function(){
  $(".fn-remove-photo-from-account-cover").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-remove-photo-from-account-cover');
    var acctid = $('body').data('uid');
    var fromAccountId = elem.data("account-id")
    if ( fromAccountId>0 )   {
      $('body').trigger('crag.save.start');
      updateUserCoverPhoto(fromAccountId,null,acctid!==fromAccountId,function(data){
        $('body').trigger('crag.save.stop');
        location.reload();
      },function(jqXHR,sts,err){
        alert("api post error: " + err + ":" + sts + ":" + jqXHR.responseText);
        $('body').trigger('crag.save.stop');
      });
    }
  }); 
})();
// ********   END ACCOUNT COVER ********************


// ********   START DISPLAY MODE ********************

function ajaxFlattenDisplay(nid,uid,fn) {
  url = "/api/area/update";
  atom={node:nid,submittor:uid,flattenDisplay:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function ajaxUnflattenDisplay(nid,uid,fn) {
  url = "/api/area/update";
  atom={node:nid,submittor:uid,flattenDisplay:0};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function flattenDisplay(event,element) {
  event.preventDefault();
  var nid = element.data('node-id');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxFlattenDisplay(nid,uid,function(){
      location.reload();
    });
  }
  return false;
}

function unflattenDisplay(event,element) {
  event.preventDefault();
  var nid = element.data('node-id');
  var uid = $('body').data('uid');
  if ( nid>0 && uid>0 )   {
    ajaxUnflattenDisplay(nid,uid,function(){
      location.reload();
    });
  }
  return false;
}

(function(){
  $(".fn-flatten-display-mode").unbind('click').bind('click',function(e){
    e.preventDefault();
    return flattenDisplay(e,$(this));
  }); 
  $(".fn-unflatten-display-mode").unbind('click').bind('click',function(e){
    e.preventDefault();
    return unflattenDisplay(e,$(this));
  }); 
})();

// ********   END DISPLAY MODE ********************

// ********   START GRADE CONVERSION ********************
(function(){
 $(".node-listview, .grade-convert").on("click", ".fn-toggle-grade-convert", function(e){
  e.preventDefault();
  var link = $(this).closest('.fn-toggle-grade-convert');
  var state = link.data('grade-state');
  var container = $(this).closest(".node-listview, .grade-convert");
  if ( state === 'converted' )  {
    container.find('.grade-convert-sys').addClass('hide').parent().removeClass('converted-grade');
    container.find('.grade-base-sys').removeClass('hide');
    state = link.data('grade-state','unconverted');
  } else {
    container.find('.grade-convert-sys').removeClass('hide').parent().addClass('converted-grade');
    container.find('.grade-base-sys').addClass('hide');
    state = link.data('grade-state','converted');
  }
  return false;
 });
})();
// ********   END GRADE CONVERSION ********************


// ********   START SAVING FEEDBACK DETAILS ********************
// details: key -> string
function updateFeedbackDetails(key,detail) {
  var feedbackDetails = $('#feedback .feedback-details');
  var details = feedbackDetails.data('details') || {index:{},list:[]};
  var index = details.index[key] !== undefined ? details.index[key] : details.list.length
  details.index[key] = index;
  details.list[index] = detail;
  feedbackDetails.data('details',details);
  detailText = details.list.join('</div><div>');
  if (detailText) {
    feedbackDetails.html('<div>' + detailText + '</div>');
  } else {
    feedbackDetails.html('');
  }
  return feedbackDetails;
}
function updateFeedbackFooter(detail) {
  var feedbackFooter = $('#feedback .feedback-footer');
  feedbackFooter.html(detail);
  return feedbackFooter;
}
function resetFeedbackDetails() {
  $('#feedback .feedback-details').removeData('details').html('');
  $('#feedback .feedback-footer').html('');
}
// ********   END SAVING FEEDBACK DETAILS ********************


// ********   START UUID ********************
// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// ********   END UUID ********************
