// Must be loaded after jquery lazy load

(function ( $ ) {
 
    $.fn.aspectchart = function(options) {
        let settings = $.extend({
            nodeid: 0,
            accountid: 0,
            current: "",
            initial: "",
            inherited: "",
            aspectlabel: "Aspect",
        }, options );

        let $aspect_widget = this;
        let $aspect_chart = $aspect_widget.find("svg[name='aspect_chart']");
        let $aspect_edit_btn =  $aspect_widget.find("button[name='aspect_edit_btn']");
        let $aspect_labels = $aspect_widget.find(".fn_aspect_label");
        
        $aspect_chart.data("current", settings.current);
        $aspect_chart.data("initial", settings.initial);
        $aspect_chart.data("inherited", settings.inherited);

        let $editg = $aspect_chart.find("g[name='edit']");
        let $showg = $aspect_chart.find("g[name='show']");
        let $unknown_label = $aspect_chart.find("text[name='unknown_label']");
        let $unknown_label_text = $aspect_widget.find("span[name='unknown_label_text']");
        

        function updatesArcEdits(data) {
          for (let aspect_key in data) {
            let $arc = $editg.find(`circle[name='${aspect_key}']`);
            if (data[aspect_key] == 1) {
              $arc.css("fill", "#000");
              $arc.data("sel", 1);
            } else {
              $arc.css("fill", "#eee");
              $arc.data("sel", 0);
            }
          }
        }

        function updatesChart(data) {
          let some_aspect = 0;
          for (let aspect_key in data) {
            let $arc = $showg.find(`path[name='${aspect_key}']`);
            let $tag = $aspect_labels.filter("span[name='aspect_chart_tag_"+aspect_key.toLowerCase()+"']");
            if (data[aspect_key] == 1) {
              $arc.attr("visibility", "");
              $tag.css("display", "inline-block");
              some_aspect = 1;
            } else {
              $arc.attr("visibility", "hidden");
              $tag.css("display", "none");
            }
          }

          let $inherited = $aspect_widget.find("i[name='inherited_label']");
          if (settings.inherited !== 0) {
              $inherited.css("display", "inline-block");
          } else {
            $inherited.css("display", "none");
          }

          if (some_aspect) {
              $unknown_label.attr("visibility", "hidden");
              $unknown_label_text.css("display", "none");

          } else {
            $unknown_label_text.css("display", "inline");
            $unknown_label.attr("visibility", "");
          }

        }

        //initial updating of charts
        updatesChart($aspect_chart.data("current"));

        $showg.find("path").on("mouseover", (el) => {
          var $seg = $(el.currentTarget);
          try {
            $aspect_chart.data('poshytip').update($seg.attr('my_title'));
          } catch (error) {}
        });
        
        $showg.find("path").on("mouseout", () => {
          try {
            $aspect_chart.data('poshytip').update(settings.aspectlabel);
          } catch (error) {}
        });

        $editg.find("circle").on("click", (el) => {
          var $seg = $(el.currentTarget);
          let data = $seg.data("sel");

          if (data == 1) {
            $seg.css("fill", "#eee");
            $seg.data("sel", 0);

          } else {
            $seg.data("sel", 1);
            $seg.css("fill", "#000");
          }
        });

        if ($aspect_edit_btn) {
          $aspect_edit_btn.on("click", (el) => {
            let $btn = $(el.currentTarget);
            if ($aspect_chart.data("editmode") == 1) {
              $aspect_chart.data("editmode", 0);
              $aspect_chart.attr("width",$aspect_chart.attr("width") / 1.2);
              $aspect_chart.attr("height",$aspect_chart.attr("height") / 1.2);
              $showg.attr("visibility", "");
              $editg.attr("visibility", "hidden");
              let aspect_tags = structuredClone($aspect_chart.data("current"));
              
              let total = 0;
              for (let aspect_key in aspect_tags) {
                let sel = $editg.find(`circle[name='${aspect_key}']`).data("sel");
                aspect_tags[aspect_key] = $editg.find(`circle[name='${aspect_key}']`).data("sel");
                total += sel;

              }

              if (JSON.stringify(aspect_tags) != JSON.stringify($aspect_chart.data("initial"))) {
                $('body').trigger('crag.save.start');
                let postdata = {
                  "data" : {
                    "by" : settings.accountid,
                    "to" : settings.nodeid,
                    "tag": {
                      "Aspect": aspect_tags,
                    }
                  }
                };
                updateTags(postdata, () => {$('body').trigger('crag.save.stop');});
                if (total == 0 & settings.inherited !== 0) {
                  $aspect_chart.data("current", structuredClone($aspect_chart.data("inherited")));
                  updatesChart($aspect_chart.data("inherited"));
                } else {
                  $aspect_chart.data("current", structuredClone(aspect_tags));
                  $aspect_chart.data("initial", structuredClone(aspect_tags));
                  settings.inherited = 0;
                  updatesChart(aspect_tags);
                }

              } else {
                let id = $aspect_chart.data("initial");
                let total = 0;
                for (let tag_key in id) {total+=id[tag_key]}
                if (total == 0 & settings.inherited !== 0) {
                  $aspect_chart.data("current", structuredClone($aspect_chart.data("inherited")));
                  updatesChart($aspect_chart.data("current"));
                } else {
                  updatesChart($aspect_chart.data("initial"));
                }
              }
              $btn.html($btn.data("label_edit"));
            } else {
              $aspect_chart.data("editmode", 1);
              $aspect_labels.css("display", "none");
              updatesArcEdits(settings.inherited !== 0 ? $aspect_chart.data("initial") : $aspect_chart.data("current"));
              $btn.html($btn.data("label_save"));
              $aspect_chart.attr("width",$aspect_chart.attr("width") * 1.2);
              $aspect_chart.attr("height",$aspect_chart.attr("height") * 1.2);
              $showg.attr("visibility", "hidden");
              $editg.attr("visibility", "");
            }
          });
        }
        return this;
    };

    $.fn.taggroupwidget = function(options) {
      let settings = $.extend({
          nodeid: 0,
          accountid: 0,
          current: "",
          initial: "",
          inherited: "",
          taggroup: "Weather",
      }, options );

      let $tag_widget = this;
      let $edit_btn =  $tag_widget.find("button[name='edit_btn']");
      let $alltags = $tag_widget.find(".fn_tag");
      
      $tag_widget.data("current", settings.current);
      $tag_widget.data("initial", settings.initial);
      $tag_widget.data("inherited", settings.inherited);

      let $unknown_label_text = $tag_widget.find("p[name='unknown_label_text']");
      
      function updateTagsEdit(data) {
        for (let tag_key in data) {
          let $tag = $alltags.filter(`[name='${tag_key}']`);
          if (data[tag_key] == 1) {
            $tag.css("filter", "grayscale(0)");
            $tag.css("box-shadow", "0 0 2px 2px #08c");
            $tag.data("sel", 1);
          } else {
            $tag.css("filter", "grayscale(1)");
            $tag.css("box-shadow", "");
            $tag.data("sel", 0);
          }
        }
      }

      function updateTagsShow(data) {
        let some_tags = 0;
        for (let tag_key in data) {
          let $tag = $alltags.filter(`[name='${tag_key}']`);
          if (data[tag_key] == 1) {
            $tag.css("display", "inline-block");
            $tag.data("sel", 1);
            some_tags = 1;
          } else {
            $tag.css("display", "none");
            $tag.data("sel", 0);
          }
        }

        let $inherited = $tag_widget.find("i[name='inherited_label']");
        if (settings.inherited !== 0) {
            $inherited.css("display", "inline-block");
        } else {
          $inherited.css("display", "none");
        }

        if (some_tags > 0) {
            $unknown_label_text.css("display", "none");
        } else {
          $unknown_label_text.css("display", "inline");
        }
      }

      //initial updating of charts
      updateTagsShow($tag_widget.data("current"));

      function clickHandler(el) {
        var $tag = $(el.currentTarget);
        if ($tag.data("sel") == 1) {
          $tag.css("filter", "grayscale(1)");
          $tag.data("sel", 0);
          $tag.css("box-shadow", "");
        } else {
          $tag.css("filter", "grayscale(0)");
          $tag.css("box-shadow", "0 0 2px 2px #08c");
          $tag.data("sel", 1);
        }
      }

      if ($edit_btn) {
        $edit_btn.on("click", (el) => {
          let $btn = $(el.currentTarget);
          if ($tag_widget.data("editmode") == 1) {
            $tag_widget.data("editmode", 0);
            $alltags.off("click", clickHandler);
            $alltags.css("cursor", "auto");
            $alltags.css("filter", "grayscale(0)");
            let edit_tags = structuredClone($tag_widget.data("current"));
            
            let total = 0;
            for (let tag_key in edit_tags) {
              let sel = $alltags.filter(`[name='${tag_key}']`).data("sel");
              edit_tags[tag_key] = sel;
              total += sel;
            }

            if (JSON.stringify(edit_tags) != JSON.stringify($tag_widget.data("initial"))) {
              $('body').trigger('crag.save.start');
              let postdata = {
                "data" : {
                  "by" : settings.accountid,
                  "to" : settings.nodeid,
                  "tag": {}
                }
              };
              postdata["data"]["tag"][settings.taggroup] = edit_tags;
              
              updateTags(postdata, () => {$('body').trigger('crag.save.stop');});

              if (total == 0 & settings.inherited !== 0) {
                $tag_widget.data("current", structuredClone($tag_widget.data("inherited")));
                updateTagsShow($tag_widget.data("inherited"));
              } else {
                $tag_widget.data("current", structuredClone(edit_tags));
                $tag_widget.data("initial", structuredClone(edit_tags));
                settings.inherited = 0;
                updateTagsShow(edit_tags);
              }

            } else {
              let id = $tag_widget.data("initial");
              let total = 0;
              for (let tag_key in id) {total+=id[tag_key]}
              if (total == 0 & settings.inherited !== 0) {
                $tag_widget.data("current", structuredClone($tag_widget.data("inherited")));
                updateTagsShow($tag_widget.data("current"));
              } else {
                updateTagsShow($tag_widget.data("initial"));
              }
            }
            $alltags.css("box-shadow", "");
            $btn.html($btn.data("label_edit"));
          } else {
            $tag_widget.data("editmode", 1);
            $alltags.css("display", "inline-block");
            $alltags.on("click", clickHandler);
            $alltags.css("cursor", "pointer");
            $unknown_label_text.css("display", "none");
            updateTagsEdit(settings.inherited !== 0 ? $tag_widget.data("initial") : $tag_widget.data("current"));
            $btn.html($btn.data("label_save"));
          }
        });
      }
      return this;
  };
 
}( jQuery ));
