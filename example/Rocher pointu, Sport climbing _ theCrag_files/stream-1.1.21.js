// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires
if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}
$.each({

    // add the default values here
    "template.message.you-replied-just-then": "You replied just now",
    "template.message.button.edit-comment": "Edit comment",
    "template.message.add-your-comment": "Add your comment",
    "process.button.save": "Save",

    "template.stream.button-forum-discussion": "Forum discussion",
    "template.account.profile.edit-this-ascent": "Edit this ascent",
    "template.facet.menu.delete-ascent": "Delete ascent",

    "template.stream.why-you-see-this": "Why you see this",
    "template.stream.this-is-a-hidden-event": "This is a hidden event. Only admin can see it.",
    "template.stream.this-is-your-private-event": "This is your private event. You and people you link to can see it.",
    "template.stream.this-is-permission-managed-event": "This is a {model} event with managed permissions.",
    "template.stream.this-is-a-private-event": "This is a private event for {name}. People they link to can see it.",
    "template.stream.this-is-a-public-event": "This is a public event.",
    "template.stream.stream-settings": "Stream settings",
    "template.stream.comment-on-this-event": "Comment on this event",
    "template.stream.full-stream-event-comments": "Full stream event comments",
    "template.stream.source-stream-event": "Source stream event",
    "template.stream.full-stream-event": "Full stream event",
    "template.stream.view-this-ascent": "View this ascent",
    "template.stream.view-this-route": "View this route",
    "template.stream.view-all-ascents-of-this-route": "View all ascents of this route",
    "template.stream.log-ascent-of-this-route": "Log ascent of this route",
    "template.stream.comment-on-this-ascent": "Comment on this ascent",
    "template.stream.moderate-discussion": "Moderate discussion",
    "template.stream.end-of-stream": "End of stream (note the system currently does not go back past 2010).",
    "template.stream.no-events-between": "No events between {startDate} and {endDate} - click Load more to go back further.",
    "template.stream.hide-stream-event": "Hide stream event",
    "template.stream.unhide-stream-event": "Unhide stream event",
    "dbconfig.category.permissions-model.private": "Private",
    "dbconfig.category.permissions-model.collaborative": "Collaborative",
    "dbconfig.activity-item.upload-photo" : "Upload Photo",
   

  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************


function saveEventComment(e) {
 e.preventDefault();
 $('body').trigger('crag.save.start');
 var uid = $('body').data('uid'),
     did = 0,
     eid = 0,
     aid = $(this).closest('[data-ascent-id]').data('ascent-id');
 if ( aid )  {
   did = $(this).closest('[data-ascent-id]').data('discussionid'); // associated discussion, not a typo
 } else {
   did = $(this).closest('[data-discussionid]').data('discussionid');
   eid = $(this).closest('[data-eventid]').data('eventid');
 }
 var $textArea = $(this).parent().find(".your-comment");
 var nodeID = $textArea.data('node-id');
 var cnt = $textArea.val();
 if ( cnt.length ) {
   var msg = {content:cnt,fromAccount:uid};
   if ( did ) {
     msg.responseTo = did;
   } else if ( aid ) {
     msg['ascent'] = aid;
   } else if ( eid ) {
     msg['event'] = eid;
   }
   var container = $(this).closest('.comment.new');
   // alert("DEBUG:H:"+JSON.stringify(msg));
   sendIt(msg,function(rdata){
    $('body').trigger('crag.save.stop');
    if ( rdata.ok ) {
     var html = rdata.ok.markupHTML;
     var mid = rdata.ok.messageID;
     var nodeText = '';
     if ( nodeID ) {
       nodeText = 'data-node-id="'+nodeID+'"';
     }
     $('<div class="comment you" id="m'+mid+'" data-message-id="'+mid+'"'+nodeText+'><div class="body"><h4>'+tc_translate.getText('template.message.you-replied-just-then')+'<a class="btn btn-small fn-edit-comment"><i class="icon-pencil"></i> '+tc_translate.getText('template.message.button.edit-comment')+'</a></h4><div class="markdown">'+html+'</div></div></div>').insertBefore(container).slideDown();
     $textArea.val('');
     $textArea.parent().find('.markdown').html('');
     $textArea.parent().parent().find('button').blur();
     if (typeof initForum === "function") { 
       initForum();
     } else {
       console.warn('initForum not found');
     }
    } else {
     alert("Error: problem saving message");
    }
   },function(jqXHR,sts,err){  // fail
    $('body').trigger('crag.save.stop');
    alert("Error: server response error sending message: " + err + ":" + sts + ":" + jqXHR.responseText);
   });
 }
 return false;
}

function addStreamEventMenu(eid,uid,$elem) {
  var why = $elem.data('why');
  var action = '';
  var commentable = false;
  var uncommentable = !!$elem.closest('.stream-content').data('uncommentable');
  var discussing = $elem.data('discussing');
  var hide = $elem.data('hide')
  if ( hide )  {
    action = '<a href="#" class="btn btn-small"><i class="icon-ban-circle"></i></a>';
  } else if ( uid )  {
    if ( discussing )  {
      action = '<a href="' + discussing + '#new_message" class="btn btn-small"><i class="icon-comments"></i></a>';
    } else {
      commentable = !uncommentable && $elem.parent().find('.event-inline-comments.whole-event').length > 0;
      if ( commentable )  {
        action = '<a href="#" class="btn btn-small fn-comment"><i class="icon-comment"></i></a>';
      } else {
        action = '<a href="/event/'+eid+'" class="btn btn-small"><i class="icon-hand-right"></i></a>';
      }
    }
  } else if ( discussing )  {
    action = '<a href="' + discussing + '" class="btn btn-small"><i class="icon-hand-right"></i></a>';
  } else {
    action = '<a href="/event/'+eid+'" class="btn btn-small"><i class="icon-hand-right"></i></a>';
  }
  var $m = $('<div class="btn-group inline">' + 
    action + 
    '<a class="btn btn-small btn-toggle" data-toggle="dropdown" href="#"><i class="icon-caret-down"></i></a>' +
    '<ul class="dropdown-menu pull-right"></ul>' +
    '</div>');
  var $menu = $m.find('.dropdown-menu');
  $menu.append('<li class="nav-header">'+tc_translate.getText('template.stream.why-you-see-this')+'</li>');
  if ( hide ) {
    $menu.append('<li class="nolink">'+tc_translate.getText('template.stream.this-is-a-hidden-event')+'</li>');
  } else if ( $elem.data("yourprivate") ) {
    $menu.append('<li class="nolink">'+tc_translate.getText('template.stream.this-is-your-private-event')+'</li>');
  } else if ( $elem.data("collaboration") ) {
    var model = tc_translate.getText("dbconfig.category.permissions-model." + $elem.data("collaboration"));
    $menu.append('<li class="nolink">'+tc_translate.getText('template.stream.this-is-permission-managed-event',{model:model})+'</li>');
  } else if ( $elem.data("private") ) {
    $menu.append('<li class="nolink">'+tc_translate.getText('template.stream.this-is-a-private-event',{name:$elem.data("private")})+'</li>');
  } else {
    $menu.append('<li class="nolink">'+tc_translate.getText('template.stream.this-is-a-public-event')+'</li>');
  }
  $.each(['mine','following','watching','country','node','activitynode','world','event'], function(i,w){
    var txt = $elem.data(w);
    if ( txt ) {
      $menu.append($('<li class="nolink">').text(txt));
    }
  });

  if ( $elem.data("is-admin") ) {
    $menu.append('<li class="divider"></li>');
    if ( hide ) {
      $menu.append('<li><a href="#" class="fn-unhide-stream-event"><i class="icon-minus"></i> '+tc_translate.getText('template.stream.unhide-stream-event')+'</a></li>');
    } else {
      $menu.append('<li><a href="#" class="fn-hide-stream-event"><i class="icon-trash"></i> '+tc_translate.getText('template.stream.hide-stream-event')+'</a></li>');
    }
  }

  if ( $elem.data("settings") ) {
    $menu.append('<li class="divider"></li>');
    $menu.append('<li><a href="/settings/streams"><i class="icon-cog"></i> '+tc_translate.getText('template.stream.stream-settings')+'</a></li>');
  }

  if ( commentable )  {
    $menu.append('<li class="divider"></li>');
    $menu.append('<li><a href="/event/'+eid+'" class="fn-comment"><i class="icon-comment"></i> '+tc_translate.getText('template.stream.comment-on-this-event')+'</a></li>');
  }

  $menu.append('<li class="divider"></li>');
  if ( $elem.data("commenting") ) {
    $menu.append('<li><a href="/event/'+eid+'"><i class="icon-hand-right"></i> '+tc_translate.getText('template.stream.full-stream-event-comments')+'</a></li>');
    $menu.append('<li><a href="/event/'+$elem.data("commenting")+'"><i class="icon-hand-right"></i> '+tc_translate.getText('template.stream.source-stream-event')+'</a></li>');
  } else if ( $elem.data("discussing") ) {
    $menu.append('<li><a href="'+$elem.data("discussing")+'"><i class="icon-hand-right"></i> '+tc_translate.getText('template.stream.button-forum-discussion')+'</a></li>');
  } else {
    $menu.append('<li><a href="/event/'+eid+'"><i class="icon-hand-right"></i> '+tc_translate.getText('template.stream.full-stream-event')+'</a></li>');
  }
  if ( $elem.data("moderate-discussion") ) {
    $menu.append('<li><a href="/discussion/'+$elem.data("moderate-discussion")+'"><i class="icon-wrench"></i> '+tc_translate.getText('template.stream.moderate-discussion')+'</a></li>');
  }
  
  $m.appendTo( $elem );
}


function addStreamAscentMenu(ascentVersion,aid,uid,auid,nid,rurl,did,$elem) {
  var uncommentable = !!$elem.closest('.stream-content').data('uncommentable');
  var commentable = uid && !uncommentable;
  var $m = $('<div class="pull-right btn-group inline">' +
    ( commentable ? '<a href="/ascent/'+aid+'" class="btn btn-mini fn-comment"><i class="icon-comment-alt"></i></a>' : '' ) +
    '<ul class="dropdown-menu pull-right"></ul>' +
    '<a class="btn btn-mini btn-toggle" data-toggle="dropdown" href="#"><i class="icon-caret-down"></i></a>' +
    '</div>');
  var $menu = $m.find('.dropdown-menu');
  
  $menu.append('<li><a href="/ascent/'+aid+'">'+tc_translate.getText('template.stream.view-this-ascent')+'</a></li>');
  $menu.append('<li><a href="'+rurl+'">'+tc_translate.getText('template.stream.view-this-route')+'</a></li>');
  $menu.append('<li><a href="'+rurl+'/ascents">'+tc_translate.getText('template.stream.view-all-ascents-of-this-route')+'</a></li>');
  if ( uid )  {
    var refurl = encodeURIComponent(window.location);
    if ( auid && auid == uid )  {
      $menu.append('<li class="divider"></li>');
      if (ascentVersion === 2) {
        $menu.append('<li><a class="fn-edit-ascent" data-ascent-id="'+aid+'" data-route-id="'+nid+'"><i class="icon-pencil"></i> '+tc_translate.getText('template.account.profile.edit-this-ascent')+'</a></li>');
      } else {
        $menu.append('<li><a href="/processmap/directreviewascent/'+aid+'?edit=direct&R='+refurl+'"><i class="icon-pencil"></i> '+tc_translate.getText('template.account.profile.edit-this-ascent')+'</a></li>');
      }
      $menu.append('<li><a href="/processmap/deleteascent/'+aid+'?R='+location.href+'"><i class="icon-remove"></i> '+tc_translate.getText('template.facet.menu.delete-ascent')+'</a>');
    }
    $menu.append('<li><a href="/processmap/uploadphoto/'+nid+'?R='+refurl+'" data-route-id="'+nid+'"><i class="icon-camera"></i> '+tc_translate.getText('dbconfig.activity-item.upload-photo')+'</a></li>');
    $menu.append('<li class="divider"></li>');
    if ( $('#log-ascent-modal').length === 1) {
      $menu.append('<li><a class="loglink"><i class="icon-ok"></i> '+tc_translate.getText('template.stream.log-ascent-of-this-route')+'</a>').find(".loglink").unbind('click').bind('click',function(){
        showLogAscentModal([{routeID: nid}]);
      });
    }
    if ( !uncommentable ) {
      $menu.append('<li><a href="/ascent/'+aid+'" class="fn-comment"><i class="icon-comment-alt"></i> '+tc_translate.getText('template.stream.comment-on-this-ascent')+'</a></li>');
    }
    if ( did ) {
      $menu.append('<li><a href="/discussion/'+did+'"><i class="icon-wrench"></i> '+tc_translate.getText('template.stream.moderate-discussion')+'</a></li>');
    }
  }

  if (typeof initalizeAscentModalBindings === 'function') {
    initalizeAscentModalBindings($m)
  }

  $m.appendTo( $elem );
}


var StreamManager = {
  init: function () {
    var uid = $('body').data('uid');
    $('.event[data-eventid]').each(function(){
      var $elem = $(this),
          eid = $elem.data('eventid'),
          $why = $elem.find('.event-why');
      if ( eid ) {
        if ( $why ) {
          var setup = $why.data('setup');
          if ( !setup ) {
            addStreamEventMenu(eid,uid,$why);
            $why.data('setup',1);
          }
        }
        if ( uid ) {
          $elem.find('.event-buttons.can-comment').each(function(){
            var setup = $(this).data('setup');
            if ( !setup ) {
              $(this).data('setup',1);
              var discussid = $(this).prev().data('discussionid');
              if ( discussid ) {
                $(this).append('<a href="/event/'+eid+'" class="btn btn-success btn-mini fn-comment comment-button">'+tc_translate.getText('template.message.add-your-comment')+'</a>');
              }
            }
          });
        }
      }
    });
    $('.event-item[data-ascent-id]').each(function(){
      var $elem = $(this),
          aid = $elem.data('ascent-id'),
          ascentVersion = $elem.data('ascent-version'),
          auid = $elem.data('ascent-uid'),
          nid = $elem.data('node-id'),
          rurl = $elem.data('route-url'),
          did = $elem.data('moderate-discussion'),
          $tmenu = $elem.find('.tick-menu');
      if ( aid && auid ) {
        if ( $tmenu ) {
          var setup = $tmenu.data('setup');
          if ( !setup ) {
            addStreamAscentMenu(ascentVersion,aid,uid,auid,nid,rurl,did,$tmenu);
            $tmenu.data('setup',1);
          }
        }
      }
    });
    if (typeof initForum === "function") { 
      initForum();
     } else {
       console.warn('initForum not found');
    }
  }
};



function firstDayPrevMonth(str) {
  var f = str.match(/^(\d\d\d\d)-(\d+)-/);
  var y = f[1];
  var m = f[2];
  if ( y && y.length && m && m.length ) {
    m -= 1;
    if ( m==0 ) {
      y -= 1;
      m = 12;
    }
    var mm = m;
    if ( m<10 ) {
      mm = "0"+m.toString();
    }
    return y + "-" + mm + '-01';
  }
  return '';
}

function lastDayPrevMonth(str) {
  str = str.replace(/-/g,"/");
  var dt = new Date(str), y = dt.getFullYear(), m = dt.getMonth();
  var pd = new Date(y, m, 0);
  y = pd.getFullYear();
  m = pd.getMonth()+1;
  var d = pd.getDate();
  var mm = m;
  if ( m<10 ) {
    mm = "0"+m.toString();
  }
  var dd = d;
  if ( d<10 ) {
    dd = "0"+d.toString();
  }
  return y + "-" + mm + '-' + dd;
}

function lastDayCurMonth(str) {
  str = str.replace(/-/g,"/");
  var dt = new Date(str), y = dt.getFullYear(), m = dt.getMonth();
  var pd = new Date(y, m+1, 0);
  y = pd.getFullYear();
  m = pd.getMonth()+1;
  var d = pd.getDate();
  var mm = m;
  if ( m<10 ) {
    mm = "0"+m.toString();
  }
  var dd = d;
  if ( d<10 ) {
    dd = "0"+d.toString();
  }
  return y + "-" + mm + '-' + dd;
}


function getPrevStreamWindow($elem) {
  var url = $elem.data('replace-url');
  var dt = $elem.data('date');
  if ( !dt.length )  {
    return '';
  }
  var f = firstDayPrevMonth(dt);
  var l = lastDayPrevMonth(dt);
  if ( f && l ) {
    url = subURLArg(url,'startDate',f);
    url = subURLArg(url,'endDate',l);
    url = subURLArg(url,'paginateAt');
    url = subURLArg(url,'pageinateTime');
    $elem.data('date',f);
    $elem.data('replace-url',url);
    $elem.data('prev-result','');
    $elem.data('prev-start',f);
    $elem.data('prev-end',l);
  } else {
    return '';
  }
  return url;
}

function getPrevActiveStreamWindow($elem,$embed) {
  var url = $elem.data('replace-url');
  var dt = $elem.data('date');
  if ( !dt.length )  {
    return '';
  }
  var f = dt.match(/^(\d\d\d\d)-(\d+)/);
  var y = f[1];
  var m = parseInt(f[2],10); // assumes month is always valid
  var str = $embed.data('active-months');
  if (!str || !str.length )  {
    return '';
  }
  var arr = str.split(" ");
  var py = 0;
  var pm = 0;
  for (i = 0; i < arr.length; i++) { 
    var fcmp = arr[i].match(/^(\d\d\d\d)-(\d+)/);
    var ycmp = fcmp[1];
    var mcmp = parseInt(fcmp[2],10); // assumes month is always valid
    if ( ycmp < y || (ycmp == y && mcmp < m) ) {
      py = ycmp;
      pm = mcmp;
      break;
    }
  }
  if ( !py || !pm ) {
    return '';
  }
  var f = py+'-'+pm+'-01';
  var l = lastDayCurMonth(f);
  //alert("DEBUG:"+f+":"+l);
  url = subURLArg(url,'startDate',f);
  url = subURLArg(url,'endDate',l);
  url = subURLArg(url,'paginateAt');
  url = subURLArg(url,'pageinateTime');
  $elem.data('date',f);
  $elem.data('replace-url',url);
  $elem.data('prev-result','');
  $elem.data('prev-start',f);
  $elem.data('prev-end',l);
  return url;
}


function endofstream($elem,$embed) {
  $elem.prop('disabled', true);
  $embed.append('<p class="alert alert-info">'+tc_translate.getText('template.stream.end-of-stream')+'</p>');
 
}


URLReplace.functions['stream-prepare'] = function($elem,$container,$embed,control) {
  // alert("stream-prepare");
  var repeat = 0;
  if ( control.init ) {
    repeat = 1;
  } else {
    var prevresult = $elem.data('prev-result');
    var lastid=0, lastdate=0;
    if ( !prevresult || !prevresult.length || prevresult != 'empty' ) {
      var $lastevent = $container.find('.event[data-eventid]').last();
      lastid = $lastevent.data('eventid');
      lastdate = $lastevent.data('date');
    } 
    if ( lastid && lastdate ) {
      if ( !control.startPagination )   {
        control.url = subURLArg(control.url,'paginateAt',lastid);
        control.url = subURLArg(control.url,'pageinateTime',lastdate);
        repeat = 1;
      }
    } else {
      //control.url = getPrevStreamWindow($elem);
      control.url = getPrevActiveStreamWindow($elem,$embed);
      if ( !control.url ) {
        endofstream($elem,$embed)
      }
    }
  }
  if ( typeof control.repeat === "undefined" )   {
    control.repeat = repeat;
  }
  control.url = subURLArg(control.url,'embed','chunk');
  return control;
}


URLReplace.functions['stream-function'] = function($elem,$container,$embed,control,content) {
  // alert("stream-function");
  var $page = $(content);
  var $html = $page.find('.stream-content');
  var innercontent = $html.html();
  if ( !$embed.data('active-months') && $html.data('active-months') ){
    $embed.data('active-months',$html.data('active-months'));
  }
  if ( $html.find('.event[data-eventid]').length ) {
    $embed.append(innercontent);
    //alert("DEBUG:"+$embed.data('active-months'));
    StreamManager.init();
    $('.phototopo').phototopo();
    $('span.oembed,div.oembed').each(function(){
       oembed($(this));
    });
    initLazyJS();
  } else {
    if ( control.repeat )   {
      console && console.info("DEBUG:no content -> repeat");
      // control.url = getPrevStreamWindow($elem);
      control.url = getPrevActiveStreamWindow($elem,$embed);
      if ( !control.url ) {
        endofstream($elem,$embed)
      } else {
        control.url = subURLArg(control.url,'embed','chunk');
        control.startPagination = 1;
        control.repeat = 0;
        URLReplace.trigger($elem,control);
      }
    } else   {
      // alert("DEBUG:no content -> end");
      console && console.info("DEBUG:no content -> end");
      $elem.data('prev-result','empty');
      var f = $elem.data('prev-start');
      var l = $elem.data('prev-end');
      $embed.append('<p class="replace-notification">'+tc_translate.getText('template.stream.no-events-between',{startDate:f,endDate:l})+'</p>');
    }
  }
}

URLReplace.resolve('stream');

function hideStreamEvent(acctid,eid,fn) {
  url = "/api/streamevent/update";
  atom={submittor:acctid,streamEvent:eid,hide:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}

function unhideStreamEvent(acctid,eid,fn) {
  url = "/api/streamevent/update";
  atom={submittor:acctid,streamEvent:eid,hide:0};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}

(function(){

 $(".stream").on("click", ".fn-show-hidden", function(e){
  e.preventDefault();
  $(this).parent().parent().find(".hide-group").show();
  $(this).hide();
  return false;
 });

  $(".stream").on("click", ".fn-hide-stream-event", function(e){
    e.preventDefault();
    var uid = $('body').data('uid'),
        eid = $(this).closest('[data-eventid]').data('eventid');
    $('body').trigger('crag.save.start');
    hideStreamEvent(uid,eid,function(data){
      if (data) {
        $('body').trigger('crag.save.stop');
        location.reload();
      }
    });
    return false;
  });
  $(".stream").on("click", ".fn-unhide-stream-event", function(e){
    e.preventDefault();
    var uid = $('body').data('uid'),
        eid = $(this).closest('[data-eventid]').data('eventid');
    $('body').trigger('crag.save.start');
    unhideStreamEvent(uid,eid,function(data){
      if (data) {
        $('body').trigger('crag.save.stop');
        location.reload();
      }
    });
    return false;
  });

 $(".stream").on("click", ".fn-comment", function(e){
  e.preventDefault();
  var $container = $(this).closest('.event, .event-item');
  if ( $container ) {
    var nodeID = $container.data('node-id');
    var $target = $container.find('.event-inline-comments.whole-event');
    if ( !$target.length ) {
      $target = $container.find('.event-inline-comments.single-item');
    }
    if ( $target.length==1 ) {
      var $btns = $container.find('.event-buttons');
      if ( $btns ) {
        $btns.find('.fn-comment').hide();
      }
      var $ecomm = $target.find('.comment.new');
      if ( !$ecomm.length ) {
        var nodeText = '';
        if ( nodeID ) {
          nodeText = 'data-node-id="'+nodeID+'"';
        }
        $target.append('<div class="comment you new"><div class="body"><h4>'+tc_translate.getText('template.message.add-your-comment')+'</h4><div><form><textarea class="your-comment completions-mention markdown completions-hashtag completions-quote completions-emoji inline-attachment" '+nodeText+'></textarea><div style="float:right;margin-right:10px" class="inline-attachment-select"><i class="icon-upload"></i></div><button class="btn btn-success btn-mini fn-save-comment">'+tc_translate.getText('process.button.save')+'</button></form></div></div></div>');
        if (typeof initialiseCompletions === "function") { 
          initialiseCompletions();
        }
        if (typeof initTextAreaMarkdown === "function") { 
          initTextAreaMarkdown();
        }
        if (typeof initialiseInlineAttachments === "function") { 
          initialiseInlineAttachments();
        }
      }
      $target.find('textarea').focus();
    }
  }
  $(this).parent().parent().parent().removeClass('open');
  return false;
 });
 $(".stream").on("click", ".fn-save-comment", saveEventComment );

 $(".stream-group-settings").on("change", "input", function(e){
   var showGroup = '';
   $(".stream-group-settings input:checked").each(function(){
     if ( showGroup.length ) {
       showGroup += ','
     }
     showGroup += $(this).data('object-type');
   });
   var $btn = $(".stream-button");
   var $cnt = $(".stream-content");
   if ( $btn.length && $cnt.length ) {
     var url = $btn.data('original-url');
     url = subURLArg(url,'showGroup',showGroup);
     // alert("DEBUG:D:"+url);
     $btn.data('original-url',url);
     $btn.data('replace-url',url);
     $cnt.html('');
     var control = {init:1};
     URLReplace.resolveTrigger($btn,control);
   }
 });

 StreamManager.init();

})();

