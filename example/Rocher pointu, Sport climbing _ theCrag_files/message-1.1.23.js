// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires 
if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}
$.each({

    // add the default values here
    "process.button.save": "Save",
    "process.button.resolve": "Resolve",
    "process.button.unresolve": "Unresolve",
    "template.message.confirm-report-spam": "Report this comment as spam?",
    "template.message.comment-reported-as-spam": "This comment has been reported as spam.",


  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************



function processMsgReply(formData,data,refreshURL,jumpToDiscussion) {
  if ( formData != "Cancelled" )    {
    content = formData.msgf_content;
    if ( data.msgid>0 && data.acctid>0 && !isBlank(content) )   {
      $('body').trigger('crag.save.start');
      replyMessage(data.msgid,data.acctid,data.subject,content,function(rdata){
        if (jumpToDiscussion){
          var messageID = rdata.ok.messageID;
          location.href="/discussion/"+jumpToDiscussion+"#"+messageID;
        } else if (refreshURL){
          location.reload();
        } else   {
          var feedtab = $('#chat_tab a:first-child');
          if (feedtab.length == 1){
            refreshFeed(feedtab,'messages');
          }
          $('body').trigger('crag.save.stop');
        }
      });
      return false;
    } else   {
      alert("Cannot send empty message");
    }
  }
}


function processAccountSend(formData,data,refreshURL,jumpToDiscussion) {
  if ( formData != "Cancelled" )    {
    content = formData.msgf_content;
    subject = formData.msgf_subject;
    if ( data.toid>0 && data.acctid>0 && !(isBlank(content) && isBlank(subject)) )   {
      $('body').trigger('crag.save.start');
      msg = {content:content,fromAccount:data.acctid,toAccounts:[data.toid]};
      if ( !isBlank(subject) ) {
        msg.subject = subject;
      }
      if ( data.ascentid ) {
        msg.ascent = data.ascentid;
      }
      if ( data.photoid ) {
        msg.photo = data.photoid;
      }
      sendMessage(msg,function(rdata){
        if (jumpToDiscussion){
          var messageID = rdata.ok.messageID;
          location.href="/discussion/"+messageID;
        } else if (refreshURL){
          location.reload();
        } else   {
          var feedtab = $('#ascents_tab a:first-child');
          if (feedtab.length == 1){
            refreshFeed(feedtab,'ascents');
          }
          $('#selectfeed').change();
          $('body').trigger('crag.save.stop');
        }
      });
      return false;
    } else   {
      alert("Cannot send empty message");
    }
  }
  return false;
}


function clickChatAscent(event,element) {
  var d = getIDsFromAttr(element,'id',["ascentid","toid","acctid"]);
  if ( d.ascentid>0 && d.toid>0 && d.acctid>0 )   {
    showMsgPopup(
      element.parent().parent(),
      //{divClass:'msgPopupform',formID:'msgForm',cancelButton:1,buttonName:'Start discussion',jumpToDiscussion:1},
      {divClass:'msgPopupform',formID:'msgForm',cancelButton:1,buttonName:'Start discussion',refreshURL:1},
      {toid:d.toid,acctid:d.acctid,ascentid:d.ascentid},
      processAccountSend
    );
  } else   {
    alert("Cannot reply because no ascentid, toid or acctid in dom");
  }
}


function thecrag_messageform(data,ctl)   {
  ctl = ctl ? ctl : {};
  var reply = ctl.reply ? ctl.reply : 0;
  var cancelButton = ctl.cancelButton ? ctl.cancelButton : 0;
  var canInputSubject = ctl.canInputSubject ? ctl.canInputSubject : 0;
  var buttonName = ctl.buttonName ? ctl.buttonName : 'Chat';
  var divClass = ctl.divClass ? ctl.divClass : 'compose';
  var formID = ctl.formID ? ctl.formID : 'composeAccountForm';
  var subject = data.subject ? data.subject : '';
  var src = '';
  src += '<div class="' + divClass + '">';
  src += '<div style="float:right">style using <a href="/article/UpdatingDescriptions#section3">thecrag markdown</a></div>';
  if ( reply && !isBlank(subject) ) {
    src += '  <strong>' + subject + '</strong><br />';
  }
  src += '  <form id="' + formID + '" method="post" style="clear:both">';
  if ( canInputSubject ) {
    src += '<div class="msgLabel">Subject:</div><input type="text" class="msgf_subject" maxlength="30" size="30" /> (optional)<br />';
  }
  src += '  <textarea class="msgf_content markdown completions-mention completions-hashtag completions-quote completions-emoji inline-attachment"></textarea><br />';
  src += '<div style="float:right;margin-right:10px" class="inline-attachment-select"><i class="icon-upload"></i></div>';
  src += '  <input type="submit" class="btn btn-primary" value="' + buttonName + '" />';
  if ( cancelButton ) {
    src += '<input type="button" id="msgCancel" class="btn" value="Cancel" />';
  }
  src += '  </form>';
  src += '</div>';
  return src;
}


function initServicesIntegration() {
  if (typeof initTextAreaMarkdown === "function") { 
    initTextAreaMarkdown();
  }
  if (typeof initialiseCompletions == 'function') { 
    initialiseCompletions(); 
  }
  if (typeof initialiseInlineAttachments === "function") { 
    initialiseInlineAttachments();
  }
}


function showMsgPopup(element,ctl,data,processFn) {
  var divClass = ctl.divClass ? ctl.divClass : 'compose';
  var formID = ctl.formID ? ctl.formID : 'composeAccountForm';
  var hideControl = ctl.hideControl ? ctl.hideControl : 1;
  var refreshURL = ctl.refreshURL ? ctl.refreshURL : 0;
  var jumpToDiscussion = ctl.jumpToDiscussion ? ctl.jumpToDiscussion : 0;
  ctl.divClass = divClass;
  ctl.formID = formID;
  var s = thecrag_messageform(data,ctl);
  if ( hideControl )   {
    element.find('.msgctl').hide();
  }
  $("."+divClass).remove();
  $(s).appendTo(element).hide().slideDown('300');
  $('.msgf_subject').focus();
  $("#msgCancel").click(function(){
    returnMsgResponse(processFn,divClass,0,0,"Cancelled");
  });
  $("#"+formID).submit(function(event){
    event.preventDefault();
    formInfo = new Object;
    formInfo.msgf_content = $(this).find(".msgf_content").val();
    formInfo.msgf_subject = $(this).find(".msgf_subject").val();
    returnMsgResponse(processFn,divClass,refreshURL,jumpToDiscussion,formInfo,data);
    return false;
  });
  initServicesIntegration();
}

function returnMsgResponse(processFn,divClass,refreshURL,jumpToDiscussion,fI,data){
  $("."+divClass).remove();
  processFn(fI,data,refreshURL,jumpToDiscussion);
}


function mapAccountLabelToID(str) {
  id = '';
  $.ajax({ 
    async: false, 
    url: '/api/climber/label/'+str, 
    dataType: "json", 
    success: function(data) {
      if (data && data.data && data.data.id) {
        id = data.data.id; 
      }
    } 
  });
  return id;
}


function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}


function getMessageAccount(element,tag) {
  var id = 0;
  var acctid = 0;
  if ( element.attr("id") ) {
    var matched = element.attr("id").match(/_([0-9]+)_([0-9]+)/);
    if (matched instanceof Array) {
      id = matched[1];
      acctid = matched[2];
    }
  }
  var res = {acctid:acctid};
  res[tag] = id;
  return res;
}


function leaveDiscussionUpdate(msgid,acctid,fn) {
  deleteMessage(msgid,acctid,fn);
}


function deleteMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid};
  atom["delete"] = 1;
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function joinDiscussionUpdate(msgid,acctid,fn) {
  undeleteMessage(msgid,acctid,fn);
}


function undeleteMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,undelete:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function unlinkMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,unlink:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function apiReportSpam(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,reportSpam:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function removeMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,remove:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function unremoveMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,unremove:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function setReadMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid};
  atom["read"] = 1;
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function setReadMessages(ids,acctid,fn) {
  var atom = [];
  for (var i=0; i<ids.length; i++) {
    atom[i] = {message:ids[i],submittor:acctid};
    atom[i]["read"] = 1;
  }
  url = "/api/message/update";
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function unsetReadMessage(msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:acctid,unread:1};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function inviteAccountsToThread(submittorid,msgid,accts,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:submittorid,invite:accts};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function inviteToThread(submittorid,msgid,acctid,fn) {
  url = "/api/message/update";
  atom={message:msgid,submittor:submittorid,invite:[{account:acctid,status:1}]};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
}


function preferenceSubscription(accid,s,v) {
  url = "/api/climber/update";
  subs={};
  subs[s] = v;
  atom={account:accid,areaSubscriptionPreference:subs};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,function(){
    location.reload();
  });
}


function subscribeNodeForum(accid,nodeid,s,v) {
  url = "/api/climber/update";
  subs={node:nodeid};
  subs[s] = v;
  atom={account:accid,areaSubscription:subs};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,function(){
    location.reload();
  });
}


function subscribeForum(accid,forumid,v) {
  url = "/api/climber/update";
  subs={forum:forumid,status:v};
  atom={account:accid,forumSubscription:subs};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,function(){
    location.reload();
  });
}


function editMessage(msgid,acctid,content,successfn,failfn) {
  url = "/api/message/update?markupType=html";
  atom={message:msgid,submittor:acctid,content:content};
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,successfn,failfn);
  return true;
}


function updateWarning(wid,acctid,category,title,description,successfn,failfn) {
  url = "/api/warning/update?markupType=html";
  atom={warning:wid,submittor:acctid,category:category,title:title,description:description};
  data={data:atom};
  json=JSON.stringify(data);
  // alert("DEBUG:"+json);
  postAPI(url,json,successfn,failfn);
  return true;
}


function resolveWarning(wid,acctid,w_sts,resolution,successfn,failfn) {
  url = "/api/warning/update?markupType=html";
  atom={warning:wid,submittor:acctid,'status':w_sts,resolution:resolution};
  data={data:atom};
  json=JSON.stringify(data);
  // alert("DEBUG:"+json);
  postAPI(url,json,successfn,failfn);
  return true;
}



function replyMessage(msgid,acctid,subject,content,successfn,failfn) {
  url = "/api/message/send?markupType=html";
  atom={responseTo:msgid,fromAccount:acctid,content:content};
  if ( !isBlank(subject) )    {
   atom.subject = subject;
  }
  data={data:atom};
  json=JSON.stringify(data);
  postAPI(url,json,successfn,failfn);
  return true;
}


function sendMessage(msg,fn) {
  url = "/api/message/send?markupType=html";
  data={data:msg};
  json=JSON.stringify(data);
  postAPI(url,json,fn);
  return true;
  // return false;
}

// ********************************
// this function is required for new forum code

function markAsUnread(event,element) {
  event.preventDefault();
  var discussion = element.closest('[data-discid]');
  var discid = discussion.data('discid');
  var comments = discussion.data('comments');
  var uid = $('body').data('uid');
  if ( discid>0 && uid>0 )   {
    unsetReadMessage(discid,uid,function(){
      discussion.removeClass("read").addClass("unread");
      // TODO - refresh badge tooltips so the tooltip is updated with the new title
      discussion.find(".badge").addClass("badge-info").attr('title',comments + " unread comments of " + comments + " in this discussion").html(comments + " / " + comments);
      discussion.find(".comment-content").addClass("unread");
      element.find("i").removeClass("icon-eraser").addClass("icon-check");
      element.find("span").html(" Mark as read");
      element.removeClass("fn-mark-as-unread").addClass("fn-mark-as-read").unbind('click').bind('click',function(event){
        return markAsRead(event,$(this));
      }); 
    });
  }
  return false;
}

function markAsRead(event,element) {
  event.preventDefault();
  var discussion = element.closest('[data-discid]');
  var discid = discussion.data('lastid'); // note we need to reference the last message to set as read
  var comments = discussion.data('comments');
  var uid = $('body').data('uid');
  if ( discid>0 && uid>0 )   {
    setReadMessage(discid,uid,function(){
      if (discussion.closest('.forum').hasClass('unread-only')) {
        discussion.slideUp(function(){
            discussion.removeClass("unread").addClass("read");
        });
      } else {
        discussion.removeClass("unread").addClass("read");
      }
      // TODO - refresh badge tooltips so the tooltip is updated with the new title
      discussion.find(".badge").removeClass("badge-info").attr('title',comments + " comments in this discussion").html(comments);
      discussion.find(".comment-content").removeClass("unread");
      element.find("i").removeClass("icon-check").addClass("icon-eraser");
      element.find("span").html(" Mark as unread");
      element.removeClass("fn-mark-as-read").addClass("fn-mark-as-unread").unbind('click').bind('click',function(event){
        return markAsUnread(event,$(this));
      }); 
    });
  }
  return false;
}

function markAllAsRead(event,element) {
  event.preventDefault();
  var container = element.closest('.forum-container');
  var uid = $('body').data('uid');
  var ids = [];
  container.find('[data-lastid]').each(function(){
    ids.push($(this).data('lastid'));
  });
  if ( ids.length>0 && uid>0 )    {
    setReadMessages(ids,uid,function(){
      if (container.find('.forum').hasClass('unread-only')) {
        container.find('[data-discid]').slideUp(function(){
          container.find('[data-discid]').removeClass("unread").addClass("read");
        });
        container.find('.page-chooser').slideUp();
        // Special dashboard cleanup
        $('#dashboard-nav .badge').remove();
        $('.account-menu .account-menu__badge').remove();
      } else {
        container.find('[data-discid]').removeClass("unread").addClass("read");
      }
      // TODO - update badge info, but at the moment this is only been used when the discussion becomes hidden
      container.find(".comment-content").removeClass("unread");
    });
  }
  return false;
}

function leaveDiscussion(event,element) {
  event.preventDefault();
  var discussion = element.closest('[data-discid]');
  var discid = discussion.data('discid');
  var uid = $('body').data('uid');
  if ( discid>0 && uid>0 )   {
    deleteMessage(discid,uid,function(){
      discussion.slideUp().addClass("deleted");
    });
  }
  return false;
}

function joinDiscussion(event,element) {
  event.preventDefault();
  var discussion = element.closest('[data-discid]');
  var discid = discussion.data('discid');
  var uid = $('body').data('uid');
  if ( discid>0 && uid>0 )   {
    undeleteMessage(discid,uid,function(){
      discussion.slideUp().addClass("deleted");
    });
  }
  return false;
}

function editComment(event,element) {
  event.preventDefault();
  element.attr('disabled', 'disabled');
  var comment = element.closest('.comment');
  var nodeID = comment.data('node-id');
  var privateDiscussionID = comment.data('private-discussion-id');
  if (comment.find('form').length <= 0){
    var mid = comment.data('message-id');
    var uid = $('body').data('uid');
    if ( !isBlank(mid) && !isBlank(uid) )   {
      $.ajax({ 
        url: '/api/message/'+mid, 
        dataType: "json", 
        success: function(data) {
          if (data && data.data && data.data.message) {
            var text = '';
            if ( data.data.message.subject ) {
              text = escapeHTML(data.data.message.subject) + "\n\n";
            }
            text = text + escapeHTML(data.data.message.markdown);
            var nodeText = '';
            if ( data.data.message.node ) {
              nodeText = 'data-node-id="'+data.data.message.node.id+'"';
            } else if ( nodeID ) {
              nodeText = 'data-node-id="'+nodeID+'"';
            }
            var privateDiscussionText = '';
            if ( privateDiscussionID ) {
              privateDiscussionText = 'data-private-discussion-id="'+privateDiscussionID+'"';
            }
            markdown = comment.find('.markdown');
            markdown.replaceWith('<form class="editMsg"><textarea class="completions-mention markdown completions-hashtag completions-quote completions-emoji inline-attachment" '+nodeText+' '+privateDiscussionText+'>'+text+'</textarea><div style="float:right;margin-right:10px" class="inline-attachment-select"><i class="icon-upload"></i></div><button class="btn btn-small btn-primary">'+tc_translate.getText('process.button.save')+'</button></form>');
            initServicesIntegration();
            var edit_form = comment.find('.editMsg');
            var edit_button = edit_form.find('button');
            edit_form.unbind('submit').bind('submit',function(event){
              event.preventDefault();
              edit_button.attr('disabled', 'disabled');
              content = comment.find('textarea').val();
              editMessage(mid,uid,content,
                function(data){  // success
                  if ( data && data.ok )   {
                    var replace_text = ''
                    if ( data.ok.subject ) {
                      replace_text = '<p>' + data.ok.subject + "</p>";
                    }
                    if ( data.ok.markupHTML ) {
                      replace_text = replace_text + data.ok.markupHTML;
                    }
                    edit_form.replaceWith("<div class='markdown'>"+replace_text+"</div>");
                    element.attr('disabled', null);
                  }
                },function(jqXHR,sts,err){  // fail
                  alert("error sending message: " + err + ":" + sts + ":" + jqXHR.responseText);
                  edit_button.attr('disabled', null);
              });
            });
          }
        } 
      });
    }
  }
  return false;
}

function updateWarningForm(event,element) {
  event.preventDefault();
  element.attr('disabled', 'disabled');
  var comment = element.closest('.comment');
  var nodeID = comment.data('node-id');
  if (comment.find('form').length <= 0){
    var mid = comment.data('message-id');
    var wid = comment.data('warning-id');
    var uid = $('body').data('uid');
    var lang = $('html').attr('lang');
    if ( !isBlank(mid) && !isBlank(uid) && !isBlank(wid) )   {
      $.ajax({ 
        url: '/api/message/'+mid+"?withAvailableWarningCategories=1&lang="+lang, 
        dataType: "json", 
        success: function(data) {
          if (data && data.data && data.data.message && data.data.message.warning && data.data.warningCategories) {
            var warning = data.data.message.warning;
            var category = '';
            if ( warning.category ) {
              category = escapeHTML(warning.category);
            }
            var title = '';
            if ( warning.title ) {
              title = escapeHTML(warning.title);
            }
            var desc = '';
            if ( warning.description ) {
              desc = escapeHTML(warning.description);
            }
            var selectCat = '<div><select>';
            $.each(data.data.warningCategories, function(key, val){
              selectCat = selectCat + '<option value="'+val.value+'"'+(val.value == warning.category ? ' selected="selected"' : '')+'>'+val.name+'</option>';
            });
            selectCat = selectCat + '</select></div>';
            markdown = comment.find('.markdown');
            markdown.replaceWith('<form class="editMsg">'+selectCat+'<div style="margin:5px 5px 5px 0;"><input type="text" name="title" value="'+title+'" style="width:100%"></div><textarea class="completions-mention markdown completions-hashtag completions-quote completions-emoji inline-attachment" data-node-id="'+nodeID+'">'+desc+'</textarea><div style="float:right;margin-right:10px" class="inline-attachment-select"><i class="icon-upload"></i></div><button class="btn btn-small btn-primary">'+tc_translate.getText('process.button.save')+'</button></form>');
            initServicesIntegration();
            var edit_form = comment.find('.editMsg');
            var edit_button = edit_form.find('button');
            edit_form.unbind('submit').bind('submit',function(event){
              event.preventDefault();
              edit_button.attr('disabled', 'disabled');
              category = comment.find('select').val();
              title = comment.find('input[name=title]').val();
              description = comment.find('textarea').val();
              updateWarning(wid,uid,category,title,description,
                function(data){  // success
                  if ( data && data.ok )   {
                    location.reload();
                  }
                },function(jqXHR,sts,err){  // fail
                  alert("error sending message: " + err + ":" + sts + ":" + jqXHR.responseText);
                  edit_button.attr('disabled', null);
              });
            });
          }
        } 
      });
    }
  }
  return false;
}


function getMessageVersion_MessageSuccess(element,data) {
  if (data && data.data && data.data.message) {
    var text = '';
    if ( data.data.message.subject ) {
      text = '<p>' + data.data.message.subject + '</p>';
    }
    text = text + data.data.message.markupHTML;
    var markdown = element.find('.markdown');
    markdown.html(text);
  }
}

function getMessageVersion_WarningSuccess(element,data) {
  if (data && data.data && data.data.message && data.data.message.warning && data.data.warningCategories) {
    var warning = data.data.message.warning
    var cat = ''
    if ( warning.category )   {
      $.each(data.data.warningCategories, function(key, val){
        if ( val.value == warning.category )   {
          cat = val.name;
        }
      });
    }
    var title = '';
    if ( warning.title )   {
      title = warning.title;
    }
    var text = '<p><span class="badge badge-default">'+cat+'</span> '+title+'</p>';
    if ( warning.markupHTMLDescription )   {
      text += warning.markupHTMLDescription;
    }
    if ( warning['status'] && warning['status'] == 'Resolved' )   {
      text += '<div class="alert alert-info">';
      if ( warning.resolveTitle )   {
        text += '<strong>' + warning.resolveTitle + '</strong>';
      }
      if ( warning.markupHTMLResolution )   {
        text += warning.markupHTMLResolution;
      }
      text += '</div>';
    }
    var markdown = element.find('.markdown');
    markdown.html(text);
  }
}

function getMessageVersion(event,element,successFn) {
  event.preventDefault();
  var comment = element.closest('.comment');
  if (comment.find('form').length <= 0){
    var mid = element.data("message-id")
    if ( mid>0 ) {
      var url = "/api/message/"+mid+'?markupType=html';
      var vid = element.data("version-id")
      if ( !isBlank(vid) ) {
        url = url + "&version="+vid;
      }
      if ( element.hasClass('warning-version') )   {
        var lang = $('html').attr('lang');
        url = url + '&withResolveTitle=1&withAvailableWarningCategories=1&lang='+lang;
      }
      $.ajax({ 
        url: url,
        dataType: "json", 
        success: function(data) {
          successFn(comment,data);
        }
      });
    }
  }
  return false;
}

function reportSpam(event,element) {
  event.preventDefault();
  if ( !element.hasClass('disabled') )   {
    var comment = element.closest('[data-commentid]');
    var mid = comment.data('commentid');
    var uid = $('body').data('uid');
    if ( mid>0 && uid>0 )   {
      var ok = confirm(tc_translate.getText('template.message.confirm-report-spam'));
      if ( ok )  {
        apiReportSpam(mid,uid,function(){
          element.addClass('disabled');
          comment.find(".markdown").prepend('<div class="alert alert-info">'+tc_translate.getText('template.message.comment-reported-as-spam')+'</div>');
        });
      }
    }
  }
  return false;
}

function removeComment(event,element) {
  event.preventDefault();
  var comment = element.closest('[data-commentid]');
  var mid = comment.data('commentid');
  var uid = $('body').data('uid');
  if ( mid>0 && uid>0 )   {
    removeMessage(mid,uid,function(){
      location.reload();
    });
  }
  return false;
}

function unremoveComment(event,element) {
  event.preventDefault();
  var comment = element.closest('[data-commentid]');
  var mid = comment.data('commentid');
  var uid = $('body').data('uid');
  if ( mid>0 && uid>0 )   {
    unremoveMessage(mid,uid,function(){
      location.reload();
    });
  }
  return false;
}

function unlinkDiscussion(event,element) {
  event.preventDefault();
  var comment = element.closest('[data-commentid]');
  var mid = comment.data('commentid');
  var uid = $('body').data('uid');
  if ( mid>0 && uid>0 )   {
    unlinkMessage(mid,uid,function(){
      location.reload();
    });
  }
  return false;
}

function initForum()   {
  $(".forum .discussion .fn-mark-as-unread").unbind('click').bind('click',function(event){
    return markAsUnread(event,$(this));
  }); 
               // this function is required for new forum code
  $(".forum .discussion .fn-mark-as-read").unbind('click').bind('click',function(event){
    return markAsRead(event,$(this));
  }); 
  $(".forum-container .fn-mark-all-as-read").unbind('click').bind('click',function(event){
    return markAllAsRead(event,$(this));
  }); 
  $(".forum .discussion .fn-leave").unbind('click').bind('click',function(event){
    return leaveDiscussion(event,$(this));
  }); 
  $(".forum .discussion .fn-join").unbind('click').bind('click',function(event){
    return joinDiscussion(event,$(this));
  }); 
  $(".comment .fn-edit-comment").unbind('click').bind('click',function(event){
    return editComment(event,$(this));
  }); 
  $(".comment .fn-update-warning").unbind('click').bind('click',function(event){
    return updateWarningForm(event,$(this));
  }); 
  $(".comment .warning-version").unbind('click').bind('click',function(event){
    return getMessageVersion(event,$(this),getMessageVersion_WarningSuccess);
  }); 
  $(".comment .message-version").unbind('click').bind('click',function(event){
    return getMessageVersion(event,$(this),getMessageVersion_MessageSuccess);
  }); 
  $(".comment .fn-moderator-remove").unbind('click').bind('click',function(event){
    return removeComment(event,$(this));
  }); 
  $(".comment .fn-report-spam").unbind('click').bind('click',function(event){
    return reportSpam(event,$(this));
  }); 
  $(".comment .fn-moderator-unremove").unbind('click').bind('click',function(event){
    return unremoveComment(event,$(this));
  }); 
  $(".comment .fn-moderator-unlink").unbind('click').bind('click',function(event){
    return unlinkDiscussion(event,$(this));
  }); 

}

$(function(){
  initForum();
});

// end forum code
// ********************************

function initMessages()   {

  $(".msgctl").hide();

  $(".message,.threadTable .thread,.messageoverlay .comment h4,.comment .body .markdown").unbind("mouseenter mouseleave").hover(
    function () {
      if ( $('.msgPopupform').length == 0  )    {
        $(this).find('.msgctl').show();
      }
      $(this).find('.msgcontent,.msgmain').css("background-color","#FFE");
      $(this).find('.msg_del,.msg_undel,.msg_read,.msg_unread,.msg_rem,.msg_unrem,.msg_unlink').show();
    }, 
    function () {
      $(this).find('.msgctl').hide();
      $(this).find('.msg_del,.msg_undel,.msg_read,.msg_unread,.msg_rem,.msg_unrem,.msg_unlink').hide();
      $(this).find('.msgcontent,.msgmain').css("background-color","#FFFFFF");
    }
  ); 

  $(".ascent_msg").unbind("mouseenter mouseleave").hover(
    function () {
      if ( $('.msgPopupform').length == 0  )    {
        $(this).find('.msgctl').show();
      }
    }, 
    function () {
      $(this).find('.msgctl').hide();
    }
  ); 

  $("div.msgcontent").each(function(el){
    if ( $(this).height()>150 && !$(this).hasClass('msgExpandable') ){
      $(this).addClass('msgExpandable').after($('<span class="comment-more"><a href="#">show more</a></span>'));
    }
  });
  $(".subPref").unbind('change').bind('change',function(){
    $('body').trigger('crag.load.start');
    var chk = $(this).is(':checked') ? 1 : 0;
    var val = $(this).val();
    var acctid = 0;
    if ( $(this).attr("id") ) {
      var matched = $(this).attr("id").match(/chk_([0-9]+)_/);
      if (matched instanceof Array) {
        acctid = matched[1];
      }
    }
    if ( acctid>0 && !isBlank(val) )   {
      preferenceSubscription(acctid,val,chk);
    } else   {
      alert("Cannot update preference, invalid html format");
    }
    $('body').trigger('crag.load.stop');
  }); 

  $(".unsubscribe_node").unbind('click').bind('click',function(){
    $('body').trigger('crag.load.start');
    var d = getIDsFromAttr($(this),'id',["acctid","nodeid"]);
    if ( d.acctid>0 && d.nodeid>0 )   {
      subscribeNodeForum(d.acctid,d.nodeid,'Manual',0);
    } else   {
      alert("Cannot subscribe to node forum, invalid html format");
    }
    $('body').trigger('crag.load.stop');
  }); 

  $(".subscribe_node").unbind('click').bind('click',function(){
    $('body').trigger('crag.load.start');
    var d = getIDsFromAttr($(this),'id',["acctid","nodeid"]);
    if ( d.acctid>0 && d.nodeid>0 )   {
      subscribeNodeForum(d.acctid,d.nodeid,'Manual',1);
    } else   {
      alert("Cannot subscribe to node forum, invalid html format");
    }
    $('body').trigger('crag.load.stop');
  }); 

  $(".subscribe_forum").unbind('click').bind('click',function(){
    $('body').trigger('crag.load.start');
    var d = getIDsFromAttr($(this),'id',["acctid","forumid"]);
    if ( d.acctid>0 && d.forumid>0 )   {
      subscribeForum(d.acctid,d.forumid,1);
    } else   {
      alert("Cannot subscribe to forum forum, invalid html format");
    }
    $('body').trigger('crag.load.stop');
  }); 

  $(".unsubscribe_forum").unbind('click').bind('click',function(){
    $('body').trigger('crag.load.start');
    var d = getIDsFromAttr($(this),'id',["acctid","forumid"]);
    if ( d.acctid>0 && d.forumid>0 )   {
      subscribeForum(d.acctid,d.forumid,0);
    } else   {
      alert("Cannot subscribe to forum forum, invalid html format");
    }
    $('body').trigger('crag.load.stop');
  }); 

  $(".dbut").unbind('click').bind('click',function(){
    msg = getMessageAccount($(this),"msgid","dmsg");
    if ( msg.msgid>0 && msg.acctid>0 )   {
      deleteMessage(msg.msgid,msg.acctid,function(){
        $("#msg_"+msgid).remove();
        location.reload();
      });
    } else   {
      alert("Cannot delete because no msgid and/or acctid in dom");
    }
  }); 

  $(".rbut").unbind('click').bind('click',function(){
    var msg = getIDsFromAttr($(this),'id',["msgid","acctid","rootid"]);
    if ( msg.msgid>0 && msg.acctid>0 && msg.rootid>0 )   {
      subject = $('#msubj_'+msg.msgid).text();
      showMsgPopup(
        $(this).parent().parent().parent(),
        //{reply:1,divClass:'msgPopupform',formID:'msgForm',cancelButton:1,buttonName:'Reply',jumpToDiscussion:msg.rootid},
        {reply:1,divClass:'msgPopupform',formID:'msgForm',cancelButton:1,buttonName:'Reply',refreshURL:1},
        {subject:subject,msgid:msg.msgid,acctid:msg.acctid},
        processMsgReply
      );
    } else   {
      alert("Cannot reply because no msgid or acctid in dom");
    }
  }); 

  $(".abut").unbind('click').bind('click',function(){
    msg = getMessageAccount($(this),"toid","compose");
    if ( msg.toid>0 && msg.acctid>0 )   {
      showMsgPopup(
        $('#composeMarker'),
        {canInputSubject:1,divClass:'msgPopupform',formID:'msgForm',cancelButton:1,buttonName:'Start discussion',jumpToDiscussion:1},
        {toid:msg.toid,acctid:msg.acctid},
        processAccountSend
      );
      $(this).closest(".hide-after-select").hide();
    } else   {
      alert("Cannot reply because no toid or acctid in dom");
    }
  });

  $(".tbut").unbind('click').bind('click',function(event){
    clickChatAscent(event,$(this));
  });


  $(".message-type").unbind('change').bind('change',function(){
    $(this).closest('form').find('.msgTo').toggle();
  });

  var totype = $('input[name=to_type]:checked').val()
  if ( totype == 'private_account' )   {
    $(".toarea").hide();
    $(".toacct").show();
  } else   {
    $(".toarea").show();
    $(".toacct").hide();
  }

  $("#composeAccountForm").unbind('submit').bind('submit',function(event){
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    var subject = $(this).find(".msgf_subject").val();
    if ( isBlank(content) && isBlank(subject) ) {
      alert('must have message subject or content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var msg = {content:content,fromAccount:acctid};
        if ( !isBlank(subject) ) {
          msg.subject = subject;
        }
        var totype = $('input[name=to_type]:checked').val()
        if ( totype == 'private_account' )   {
          var toAcct = [];
          $(this).find(".autocomplete-account.autocomplete-hidden-id").each(function(){
            var acctid = $(this).val();
            if ( acctid && acctid.match(/^\d+$/) )   {
              toAcct.push(acctid);
            }
          });
          $(this).find(".autocomplete-account.autocomplete-select option:selected").each(function(){
            var acctid = $(this).val();
            if ( acctid && acctid.match(/^\d+$/) )   {
              toAcct.push(acctid);
            }
          });
          if ( toAcct.length )   {
            msg.toAccounts = toAcct;
            sendMessage(msg,function(rdata){
              var messageID = rdata.ok.messageID;
              location.href="/discussion/"+messageID;
            });
          } else   {
            alert('have not specified any valid accounts');
          }
        } else if ( totype == 'public_area' )   {
          var nodeid = $(this).find(".autocomplete-node.autocomplete-hidden-id").val();
          if ( !nodeid )    {
            nodeid = $(this).find(".autocomplete-node.autocomplete-select option:selected").val();
          }
          if ( nodeid )    {
            DAO.forumID(nodeid,function(r){
              if ( r && r.forum )    {
                if ( r.forum.id  ) {
                  msg.toGroups = [r.forum.id];
                } else   {
                  msg.createGroup = {name:r.forum.name,type:r.forum.type,prn:r.forum.prn};
                }
                msg.node = nodeid;
                sendMessage(msg,function(rdata){
                  var messageID = rdata.ok.messageID;
                  location.href="/discussion/"+messageID;
                });
              }
            });
          } else   {
            alert('have not specified a valid crag');
          }
        } else   {
          alert('internal error: private account or public area not flagged');
        }
      }
    }
    return false;
  });

  $("#composeNodeForm").unbind('submit').bind('submit',function(event){
    $(this).find('button').prop('disabled', true);
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    var subject = $(this).find(".msgf_subject").val();
    $('body').trigger('crag.save.start');
    if ( isBlank(content) && isBlank(subject) ) {
      alert('must have message subject or content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var nodeid = $(this).find("#msgf_nodeid").val();
        if ( isBlank(nodeid) ) {
          alert('internal error: no from nodeid');
        } else   {
          var forumid = $(this).find("#msgf_forumid").val();
          var forumname = $(this).find("#msgf_forumname").val();
          if ( isBlank(forumid) && isBlank(forumname) ) {
            alert('internal error: need either forumid or forumname');
          } else   {
            msg = {content:content,fromAccount:acctid,node:nodeid};
            if ( !isBlank(forumid) ) {
              msg.toGroups = [forumid];
            } else   {
              msg.createGroup = {name:forumname,type:'Area Forum',prn:nodeid};
            }
            if ( !isBlank(subject) ) {
              msg.subject = subject;
            }
            var formElement = $(this);
            sendMessage(msg,function(rdata){
              $('body').trigger('crag.save.stop');
              var messageID = rdata.ok.messageID;
              location.href="/discussion/"+messageID;
            });
            return false;
          }
        }
      }
    }
    $('body').trigger('crag.save.stop');
    return false;
  });

  $("#composeForumForm").unbind('submit').bind('submit',function(event){
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    var subject = $(this).find(".msgf_subject").val();
    $('body').trigger('crag.save.start');
    if ( isBlank(content) && isBlank(subject) ) {
      alert('must have message subject or content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var forumid = $(this).find("#msgf_forumid").val();
        if ( isBlank(forumid) ) {
          alert('internal error: no from forumid');
        } else   {
          msg = {content:content,fromAccount:acctid,toGroups:[forumid]};
          if ( !isBlank(subject) ) {
            msg.subject = subject;
          }
          var formElement = $(this);
          sendMessage(msg,function(rdata){
            var messageID = rdata.ok.messageID;
            location.href="/discussion/"+messageID;
          });
          return false;
        }
      }
    }
    $('body').trigger('crag.save.stop');
    return false;
  });

  $("#composeTripForm").unbind('submit').bind('submit',function(event){
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    $('body').trigger('crag.save.start');
    if ( isBlank(content) ) {
      alert('must have message content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var toAcct = [];
        var toErr = '';
        $(this).find(".msgf_to").each(function(){
          toAcct.push($(this).val());
        });
        if ( toAcct.length == 0 )    {
          alert("no to accounts specified");
        } else   {
          var ref = $(this).find("#msgf_ref").val();
          if ( isBlank(ref) ) {
            alert('internal error: no trip reference');
          } else   {
            var msg = {content:content,fromAccount:acctid,trip:ref,toAccounts:toAcct};
            var formElement = $(this);
            sendMessage(msg,function(){
              formElement[0].reset();
              $('body').trigger('crag.save.stop');
              location.reload();
            });
            return false;
          }
        }
      }
    }
    $('body').trigger('crag.save.stop');
    return false;
  });

  $("#composeAscentForm").unbind('submit').bind('submit',function(event){
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    $('body').trigger('crag.save.start');
    if ( isBlank(content) ) {
      alert('must have message content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var toAcct = [];
        var toErr = '';
        $(this).find(".msgf_to").each(function(){
          toAcct.push($(this).val());
        });
        if ( toAcct.length == 0 )    {
          alert("no to accounts specified");
        } else   {
          var ref = $(this).find("#msgf_ref").val();
          if ( isBlank(ref) ) {
            alert('internal error: no ascent reference');
          } else   {
            var msg = {content:content,fromAccount:acctid,ascent:ref,toAccounts:toAcct};
            var formElement = $(this);
            sendMessage(msg,function(){
              formElement[0].reset();
              $('body').trigger('crag.save.stop');
              location.reload();
            });
            return false;
          }
        }
      }
    }
    $('body').trigger('crag.save.stop');
    return false;
  });


  $("#composePhotoForm").unbind('submit').bind('submit',function(event){
    event.preventDefault();
    var content = $(this).find(".msgf_content").val();
    $('body').trigger('crag.save.start');
    if ( isBlank(content) ) {
      alert('must have message content');
    } else   {
      var acctid = $(this).find("#msgf_acctid").val();
      if ( isBlank(acctid) ) {
        alert('internal error: no from acctid');
      } else   {
        var toErr = '';
        var ref = $(this).find("#msgf_ref").val();
        if ( isBlank(ref) ) {
          alert('internal error: no photo reference');
        } else   {
          var msg = {content:content,fromAccount:acctid,photo:ref};
          var formElement = $(this);
          sendMessage(msg,function(){
            formElement[0].reset();
            $('body').trigger('crag.save.stop');
            location.reload();
          });
          return false;
        }
      }
    }
    $('body').trigger('crag.save.stop');
    return false;
  });

  $("img.toggle_msgcontent").unbind('click').bind('click',function(){
     var data = getIDsFromAttr($(this),'class',["msgid","acctid"]);
     if ( data.msgid>0 && data.acctid>0 )   {
       if ( $(this).hasClass('msgshow') )   {
         setReadMessage(data.msgid,data.acctid,function(){});
         $(this).parent().parent().removeClass('unread').find('td').css("font-weight:normal;");
       }
     }
     $(this).parent().parent().parent().find('.toggle_'+data.msgid+'_'+data.acctid).toggle();
  });

  $(".msg_del").unbind('click').bind('click',function(){
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      deleteMessage(data.msgid,data.acctid,function(){
        location.reload();
      });
    }
  }); 

  $(".msg_undel").unbind('click').bind('click',function(){
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      undeleteMessage(data.msgid,data.acctid,function(){
        location.reload();
      });
    }
  }); 

  $(".msg_read").unbind('click').bind('click',function(event){
    event.preventDefault();
    var element = $(this);
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      setReadMessage(data.msgid,data.acctid,function(){
        if ( element.attr("href") )   {
          location.href=element.attr("href");
        } else   {
          location.reload();
        }
      });
    }
    return false;
  }); 

  $(".msg_unread").unbind('click').bind('click',function(event){
    event.preventDefault();
    var element = $(this);
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      unsetReadMessage(data.msgid,data.acctid,function(){
        if ( element.attr("href") )   {
          location.href=element.attr("href");
        } else   {
          location.reload();
        }
      });
    }
    return false;
  }); 

  $(".msg_unrem").unbind('click').bind('click',function(){
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      unremoveMessage(data.msgid,data.acctid,function(){
        location.reload();
      });
    }
  }); 

  $(".msg_rem").unbind('click').bind('click',function(){
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      removeMessage(data.msgid,data.acctid,function(){
        location.reload();
      });
    }
  }); 

  $(".msg_unlink").unbind('click').bind('click',function(){
    var data = getIDsFromAttr($(this),'id',["msgid","acctid"]);
    if ( data.msgid>0 && data.acctid>0 )   {
      unlinkMessage(data.msgid,data.acctid,function(){
        location.reload();
      });
    }
  }); 

}


$(function(){
  initMessages();
});
