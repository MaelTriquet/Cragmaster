

function theCragAPIGradeConverter(options){
    this.params = {
      input: {
        context: 'US',
        style: 'Sport',
        grade: ''
      },
      grade: null,
      convert: {
        Trad: ['YDS','FR','AU','UKT'],
        Sport: ['YDS','FR','AU','UKT'],
        Boulder: ['BLDV','FB']
      },
      ascentMode: false,
      callback: function () {},
    };

    this.options = options;

    var that = this;

    if (this.options.input) {
      this.params.input = this.options.input;
    }

    if (this.options.contextElement) {
      this.options.contextElement.change(function(){
        that.inputChange();
      });
    }

    if (this.options.styleElement) {
      this.options.styleElement.change(function(){
        that.inputChange();
      });
    }

    if (this.options.outputSystemElement) {
      this.options.outputSystemElement.change(function(){
        that.inputChange();
      });
    }

    if (this.options.gradeElement) {
      this.options.gradeElement.keyup(function(){
        that.delay(function(){
          that.inputChange();
        }, 600 );
      });
    }

    if (this.options.ascentMode) {
      this.params.ascentMode = this.options.ascentMode;
    }

    if (this.options.callback) {
      this.params.callback = this.options.callback;
    }
}

theCragAPIGradeConverter.prototype = {

    delay: (function() {
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
     };
    })(),

    inputChange: function() {
      this.readInputs();
      this.loadGrade();
    },

    readInputs: function() {
      this.params.input.context = this.options.contextElement.val();
      this.params.input.style = this.options.styleElement.val();
      this.params.input.grade = this.options.gradeElement.val();
    },

    apiFail: function(err) {
      alert(err);
    },

    gradeChange: function() {
      if ( this.params.grade ) {
        var grade = this.params.grade;
        if ( this.options.outputElement ) {
          this.options.outputElement.html('<span class="grade gb' + (grade.gradeBand ? grade.gradeBand : '0') + '" title="' + (grade.systemText ? grade.systemText : '') + '">' + grade.gradeInContext + '</span>');
        }
        if ( this.options.convertElement ) {
          var converted = grade.converted;
          var html = '<table>'
          if ( converted ) {
            converted.forEach(function(el){
              html = html + '<tr><td>' + el.grade + '</td><td>' + el.system + ': ' + el.systemName + '</td></tr>';
            });
          }
          html = html + '</table>'
          this.options.convertElement.html(html);
        }
      }
    },

    convertTo: function() {
      var style = this.params.input.style;
      var convert = [];
      var extra = '';
      if ( this.options.outputSystemElement )   {
        extra = this.options.outputSystemElement.val();
      }
      if ( extra.length > 0 )    {
        convert.unshift(extra);
      }
      if ( this.params.convert[style] )   {
        this.params.convert[style].forEach(function(sys){
          if ( sys != extra )  {
            convert.push(sys);
          }
        });
      }
      return convert;
    },

    loadGrade: function() {
      var that = this;
      var context = this.params.input.context;
      var style = this.params.input.style;
      var grade = this.params.input.grade;
      if ( context.length > 0 && style.length > 0 && grade.length > 0 )  {
        var obj={data:{text:grade,context:context,style:style}};
        if ( this.params.convert[style] ) {
          obj.data.convert = this.convertTo();
        }
        if ( this.params.ascentMode ) {
          obj.data.ascentMode = 1;
        }
        var json=JSON.stringify(obj);
        postAPIWithPromise('/api/grade',json)
        .done(function(data) {
          if ( data && data.data && data.data.grade && data.data.grade.length ) {
            that.params.grade = data.data;
            that.gradeChange();
            if (that.params.callback) {
              that.params.callback(that.params.grade);
            }
          } else {
            that.params.grade = null;
            that.apiFail("API did not return a grade");
          }
        })
        .fail(function() {
          that.params.grade = null;
          that.apiFail("API failed");
        });
      } else {
        that.params.grade = null;
        if ( this.options.outputElement ) {
          this.options.outputElement.html('');
        }
        if (that.params.callback) {
          that.params.callback(that.params.grade);
        }
        // that.apiFail("Insufficient grade inputs");
      }
    }

};

