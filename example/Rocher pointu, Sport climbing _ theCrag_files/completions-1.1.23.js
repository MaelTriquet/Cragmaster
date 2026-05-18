// this code is required across both common.js and process.js, but only needed on some edit forms

var completions = {
 mention: {
  at: "@",
  search_key: "search",
  tpl: "<li data-value='@${login}' class='account'><img src='/avatar/${id}'> ${name} <small>@${login}</small></li>",
  limit: 10,
  show_the_at: true,
  cache: [],
  callbacks: {
   remote_filter: function(prefix, render) {
    var api = '';
    var uid = $('body').data('uid');
    if ( uid )   {
     api = '/api/lookup/climber?page-size=10&search=' + encodeURIComponent(prefix) + '&mode=you,history,mention,karma,follow,login';
     var discussion = $('div.discussion').data('discussion');
     if ( discussion )   {
      api += ',discuss&discussion='+discussion;
     }
     var tlc = $('div.tlc').data('tlc');
     if ( tlc )   {
      api += '&tlc='+tlc;
     }
     at_remoteFilter(tlc+":"+discussion,'mention',api,prefix,render);
    }
   }
  }
 },
 hashtag: {
  at: "#",
  search_key: "name",
  tpl: "<li data-value='#${name}'>${name}</li>",
  limit: 10,
  show_the_at: true,
  cache: [],
  callbacks: {
   remote_filter: function(prefix, render) {
    var api = '/api/lookup/hashtag?page-size=10&search=' + encodeURIComponent(prefix);
    var tlc = $('div.tlc').data('tlc');
    if ( tlc )   {
     api += '&tlc='+tlc;
    }
    at_remoteFilter(tlc,'hashtag',api,prefix,render);
   }
  }
 },
 quote: {
  at: "'",
  search_key: "name",
  tpl: "<li data-value=\"'${name}'\">${name} <small>${qualifier}</small></li>",
  limit: 10,
  show_the_at: true,
  cache: [],
  callbacks: {
   remote_filter: function(prefix, render) {
    var api = '';
    var tlc = $('div.tlc').data('tlc');
    if ( tlc && prefix.length >= 2 )   {
     api = '/api/lookup/node?page-size=10&ancestor='+tlc+'&search=' + encodeURIComponent(prefix);
     at_remoteFilter(tlc,'quote',api,prefix,render);
    }
   }
  }
 },
 doublequote: {
  at: '"',
  search_key: "name",
  tpl: "<li data-value=\"&quot;${name}&quot;\">${name} <small>${qualifier}</small></li>",
  limit: 10,
  show_the_at: true,
  cache: [],
  callbacks: {
   remote_filter: function(prefix, render) {
    var api = '';
    var tlc = $('div.tlc').data('tlc');
    if ( tlc && prefix.length >= 2 )   {
     api = '/api/lookup/node?page-size=10&ancestor='+tlc+'&search=' + encodeURIComponent(prefix);
     at_remoteFilter(tlc,'quote',api,prefix,render);
    }
   }
  }
 },
 emoji: {
  at: ":",
  search_key: "name",
//   tpl: "<li data-value=':${name}:'>${name} <i class='twa twa-${class}'></i></li>",
  tpl: "<li data-value=':${name}:'>${name} <img class='emoji' src='https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg'></li>",
  limit: 10,
  show_the_at: true,
  cache: [],
  callbacks: {
   remote_filter: function(prefix, render) {
    var api = '/api/lookup/emoji?page-size=10&search=' + encodeURIComponent(prefix);
    at_remoteFilter('','emoji',api,prefix,render);
   }
  }
 }
}
function at_remoteFilter(context, type, api, prefix, render) {
 var elem = $(this);
 var uid = $('body').data('uid');
 if ( !uid )   {
  uid = '';
 }
 if( !elem.data('active') ){
  elem.data('active', true);                            
  var shorterFailed = 0;
  if ( prefix ) {
   var shorter = prefix;
   shorter = shorter.substring(0, shorter.length - 1);
   var cachekey = uid + '_' + '_' + shorter;
   var shorterCached = completions[type].cache[cachekey];
   if ( shorterCached && typeof shorterCached == "object" )  {
    if ( !shorterCached.length )  {
     shorterFailed = 1;
    }
   }
  }
  if ( !shorterFailed ) {
    var cachekey = uid + '_' + '_' + prefix;
    var cached = completions[type].cache[cachekey];
    if(typeof cached == "object"){
     render(cached);
    }else {                            
     if (elem.xhr) {
      elem.xhr.abort();
     }
     elem.xhr = $.getJSON(api, function(res) {
      if ( res.data ) {
       var data = res.data;
       completions[type].cache[cachekey] = data
       render(data);
      }
     });
    }                            
  }
  elem.data('active', false);                            
 }
}

$(function(){
 initialiseCompletions();
});



    // this actually does the searching
    // it also does the under lining of the search term
function select2_filterAccounts(term,maxdisplay,accounts,inherit){

 if (inherit) {
   var extrawith = inherit.select2('data');
   $.each(extrawith, function(i,e) {
     e.grouplabel = "with";
     e.groupname = "With";
     e.grouporder = 0;
     if (e.sortname) {
       e.sortname = '0' + e.sortname.substr(1);
     }
     if (e.name && typeof e.name === 'object') {
       e.name = String(e.name);
     }
     var name = e.name;
     var login = e.login;
     if (name && name.startsWith("@")) {
       e.name = name = name.substring(1);
       if (!e.login) {
         e.login = name;
       }
     }
     if (!e.sortname && name) {
       e.sortname = '0' + name;
     }
     if (!e.search && name) {
       e.search = name;
     }
     if (e.id.startsWith("@")) {
       e.avatar = 1;
     }
   });
   accounts = extrawith.concat(accounts);
 }

 term = term.trim();
 var matched = [];
 var matchedids = {};
 if ( accounts )  {
  $.each(accounts, function(i,e){
   if ( matched.length < maxdisplay )  {
    if (matchedids[e.id]) {
      return;
    }
    matchedids[e.id] = 1;
    if ( !e.name ) {
	 e.name = '';
    }
	var name = e.name || '';
	var login = e.login;
	var sterm = term;
	if (sterm[0] == '@'){ sterm = sterm.substring(1); }
	var sterm  = Select2.util.stripDiacritics(''+sterm).toUpperCase();
	var sname  = Select2.util.stripDiacritics(''+name    ).toUpperCase();
	var slogin = Select2.util.stripDiacritics(''+login   ).toUpperCase();
	var tl = term.length;
	var ni = -1;
	if ( sname.match(new RegExp('\\b'+sterm)) ) {
	  ni =  sname.indexOf( sterm );
    }
	var li = -1;
	if ( slogin.match(new RegExp('\\b'+sterm)) ) {
	  li = slogin.indexOf( sterm );
    }
	e.showname = e.name;
	e.showlogin = e.login;
	if (ni >= 0 && name){
		e.showname = [name.slice(0, ni), '<u>', name.slice(ni,ni+tl), '</u>', name.slice(ni+tl)].join('');
	}
	if (li >= 0 && login){
		e.showlogin = [login.slice(0, li), '<u>', login.slice(li,li+tl), '</u>', login.slice(li+tl)].join('');
	}
	if (ni >= 0 || li >= 0){
        matched.push(e);
	}
   }
  });
 }
    var ret = [];
    var children = [];
    var group = '';
    $.each(matched, function(i,o){
        if (o.groupname != group){
            if (children.length > 0){
                ret.push({text: group, children: children});
            }
            children = [];
        }
        children.push(o);
        group = o.groupname;
    });
 if (children.length > 0){
  ret.push({text: group, children: children});
 }
 return {results: ret};
}

function searchTransform(data) {
	var arr = data.data;
	$.each(arr, function(i,o){
		o.avatar = 1;
		o.uid = o.id;
		o.login =  o.login.toLowerCase();
		o.id = '@' + o.login;
		o.sortname = o.grouporder+o.name+o.login;
	});
	arr.sort(function(a,b){
		return a.sortname.localeCompare(b.sortname);
	});
	return arr;
}

var searchCache = {  // global so so that the cache is shared
	cache: [],
	api: []
};
function doneSearch(search,key,data,inheritwith) {
  if (typeof searchCache.cache[key] === 'undefined') {  // calling searchTransform twice will create bad data
    searchCache.cache[key] = searchTransform(data);
  }
  if ( search.filterTrigger[key] ) {
    search.filterTrigger[key].callback(select2_filterAccounts(search.filterTrigger[key].term,search.maxdisplay,searchCache.cache[key],inheritwith));
  }
}
function initialiseSelect2ClimberCompletions(elem) {
 // If 'inheritwith' data-attr is set, it is a selected to a second
 // Select2 element then climbers selected in this element will also
 // be added to that select, and also those selected in that element
 // will be given a special 'with' group in this selects dropdown.
 // The other with elem should already be initialized first.
 var inheritwith = null;
 if (elem.data('inheritwith')) {
   inheritwith = $('[name="' + elem.data('inheritwith') + '"]');
 }
 var search = {
	elem: elem,
	maxdisplay: 50,
	maxsearch: 50,
	cachekeybase: '',
	apibase: '',
	filterTrigger: []
 };
 var baseMode = 'history,mention,karma,follow,login,recentclimbswith';
 var withYou = !elem.data('without-you');
 var mode = withYou ? 'you,' + baseMode : baseMode;
 if (elem.data('only-community')) {
    mode = 'community,login';
 }
 var discussion = '';
 var tlc = '';
 var uid = $('body').data('uid');
 if ( uid )   {
  var comp_id = $('body').data('compid');
  if ( comp_id )   {
   mode += ',competition';
  }
  discussion = $('div.discussion').data('discussion');
  if ( discussion )   {
   mode += ',discuss';
  }
  tlc = $('div.tlc').data('tlc');
  ref = elem.data('ref');
  if ( ref )   {
   mode += ',ref';
  }
  var overrideMode = elem.data('override-mode');
  if (overrideMode) {
    mode = overrideMode;
  }
  search.apibase = '/api/lookup/climber?page-size=' + search.maxsearch + '&mode='+mode; // seach 
  if ( comp_id )   {
    search.apibase += '&competition='+comp_id;
  }
  if ( discussion ) {
    search.apibase += '&discussion='+discussion;
  }
  if ( tlc ) {
    search.apibase += '&tlc='+tlc;
  }
  if ( ref ) {
    search.apibase += '&ref='+ref;
  }
  search.apibase += '&search=';
  search.cachekeybase = uid + '_' + search.apibase + '_';
  if (!searchCache.api[search.cachekeybase] ) { // preload but do not filter
    searchCache.api[search.cachekeybase] = $.getJSON(search.apibase);
  }
  searchCache.api[search.cachekeybase].done(function(data){
    doneSearch(search,search.cachekeybase,data,inheritwith);
  });
 }
 var initdata = [];
 var inittext = elem.attr("value");
 if ( inittext.length ) {
   var aa = [];
   inittext = inittext.replace(/ and /gi,' & ');
   $(inittext.split(/\s*[,&]\s*/)).each(function () {
     if ( this.length ) {
       aa.push(this);
       initdata.push({name: this, id: this});
     }
   });
   if ( aa.length ) {
     elem.attr("value",aa.join(','));
   }
 }
 elem.select2({
  minimumInputLength: 0,
  multiple: true,
  tags:[''],
  selectOnBlur: false,
  tokenSeparators: [',', '&'],
  query: function(options){
    if ( search.apibase )  {
	var sterm = options.term;
	if ( sterm.match(/^\@/) ) {
	  sterm = sterm.substring(1);
        }
        var apiSearch = search.apibase + encodeURIComponent(sterm);
        var cachekey = search.cachekeybase + sterm;
	var shorter = sterm;
	var doNetworkSearch = 1;
	if (searchCache.cache[cachekey]){
	  doNetworkSearch = 0;
	  options.callback(select2_filterAccounts(options.term,search.maxdisplay,searchCache.cache[cachekey],inheritwith));
	} else {
	  while ( shorter.length )  {
            shorter = shorter.substring(0, shorter.length - 1);
            var shorterkey = search.cachekeybase + shorter;
            if ( searchCache.cache[shorterkey] && typeof searchCache.cache[shorterkey] == "object" ) {
              if ( searchCache.cache[shorterkey].length < search.maxsearch )   {
	        doNetworkSearch = 0;
	        searchCache.cache[cachekey] = searchCache.cache[shorterkey];
	        options.callback(select2_filterAccounts(options.term,search.maxdisplay,searchCache.cache[shorterkey],inheritwith));
              } else {
	        options.callback(select2_filterAccounts(options.term,search.maxdisplay,searchCache.cache[shorterkey],inheritwith)); // filter on what we can and do network search
              }
	      break;
            }
          }
	}
	if ( doNetworkSearch ){
	  search.filterTrigger[cachekey] = options;
	  if (!searchCache.api[cachekey] ) { // load and filter
	    searchCache.api[cachekey] = $.getJSON(apiSearch);
	  }
	  searchCache.api[cachekey].done(function(data){
            doneSearch(search,cachekey,data);
	  });
	}
    } else  {
	options.callback(select2_filterAccounts(options.term,null,null,inheritwith));
    }
  },
  formatSelection: function (obj, container){
	var html = '';
	var closeavatar = 0;
	if (obj.avatar){
		closeavatar = 1;
		html += '<span class="select2user">';
		html += '<img src="/avatar/'+(obj.uid || obj.login)+'" width="20" height="20" class="avatar"> ';
	}
	if (obj.login){
		html += '@' + obj.login;
	} else {
		if (obj.name && obj.name.match(/^\@[_a-zA-Z][_a-zA-Z0-9]*$/) ) {
			closeavatar = 1;
			var login = obj.name.toLowerCase();
			login = login.substring(1);
			html += '<span class="select2user">';
			html += '<img src="/avatar/'+login+'" width="20" height="20" class="avatar"> ';
		}
		html += obj.name;
	}
	if (closeavatar){
		html += '</span>';
    }
	return html;
  },
  formatResult: function (obj, container){
    if (obj.children){
      return '<b>' + obj.text + '</b>';
    }
	var html = '';
	if (obj.avatar){
		html += '<span class="select2user">';
        html += '<img src="/avatar/'+(obj.uid || obj.login)+'" width="20" height="20" class="avatar"> ';
		html += obj.showname;
		html += ' <small>@' + obj.showlogin + '</small>';
		html += '</span>';
	} else {
		html = obj.name;
	}
	return html;
  },
  createSearchChoice: function(term){
	return {id: term, name: term};
  },
  matcher: function(term, text) {
	var sterm = Select2.stripDiacritics(''+term).toUpperCase();
       	return Select2.stripDiacritics(''+text).toUpperCase().indexOf( sterm) >= 0;
  }
 }).select2("data",initdata);
 if ($().sortable ? 1 : 0) {
   elem.select2("container").find("ul.select2-choices").sortable({
    containment: 'parent',
    start:  function() { elem.select2("onSortStart"); },
    update: function() { elem.select2("onSortEnd"  ); }
   });
 }
 elem.on('select2-highlight', function(e) {
    // See issues #3128 vs #1799 if we have typed text which didn't match
    // anything then we want to tokenise it IF it is still selected.
    // If anything else is selected then ignore on blur, we want those real
    // accounts to be explicitely added
    var hasAt = e.val.indexOf('@') > -1;
    $(e.currentTarget).data('select2').opts.selectOnBlur = !hasAt;

 });
 if (inheritwith) {
   elem.on('select2-selecting', function (e) {
     var selected = inheritwith.select2('val');
     var newsel = e.val;
     // Is it already selected?
     if (selected.indexOf(newsel) == -1) {

       // Don't add yourself!
       if ( $('body').data('uid') == e.object.uid) return;
       // If it in the list of options or do we add it?
       var data2 = inheritwith.select2('data').concat(e.object);
       inheritwith.select2('data', data2);
     }
   });
 }

}

function initialiseSelect2NodeCompletions(elem) {
}

function initialiseCompletions() {
 var timer = 0;
 $(".completions-select2-mention").each(function(){
  var elem = $(this);
  timer += 10;
  setTimeout(function() {
   initialiseSelect2ClimberCompletions(elem);
  }, timer);
 });
 $(".completions-select2-node").each(function(){
  var elem = $(this);
  timer += 10;
  setTimeout(function() {
    initialiseSelect2NodeCompletions(elem);
  }, timer);
 });
 var elem = $(".completions-mention");
 if (typeof elem.atwho === "function") { 
   elem.atwho(completions.mention);
 }
 elem = $(".completions-hashtag");
 if (typeof elem.atwho === "function") { 
   elem.atwho(completions.hashtag);
 }
 elem = $(".completions-quote");
 if (typeof elem.atwho === "function") { 
   elem.atwho(completions.quote).atwho(completions.doublequote);
 }
 elem = $(".completions-emoji");
 if (typeof elem.atwho === "function") { 
   elem.atwho(completions.emoji);
 }
}

function initialiseCompletionsForElement(elem) {
  if ( elem.hasClass("completions-mention") ) {
    elem.atwho(completions.mention);
  }
  if ( elem.hasClass("completions-hashtag") ) {
    elem.atwho(completions.hashtag);
  }
  if ( elem.hasClass("completions-quote") ) {
    elem.atwho(completions.quote).atwho(completions.doublequote);
  }
  if ( elem.hasClass("completions-emoji") ) {
    elem.atwho(completions.emoji);
  }
}
