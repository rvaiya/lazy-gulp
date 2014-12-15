var gulp = require('gulp');
var watch = require('gulp-watch');
var through = require('through2');
var vutil = require('vinyl-utils');


var Rule = function(opts) {
  opts.opts = opts.opts || {};
  opts.description = opts.description || [];

  var obj = this;

  obj.opts = {};
  obj.description = [];
  obj.files = [];

  opts.files.forEach(function(e) {
    obj.files.push(e);
  });

  for(var k in opts.opts)
    obj.opts[k] = opts.opts[k];

  for(var k in opts.description)
    obj.description[k] = opts.description[k];
};

Rule.prototype.clone = function() {
  return new Rule(this);
};

Rule.prototype.createPrePipeline = function() {
  return vutil.createPipeline(this.description);
};

Rule.prototype.createPostPipeline = function() {
  return vutil.createPipeline(this.opts.post);
};


function buildRuleSet(rules, dest) {
  rules.forEach(function(rule) {
    gulp.src(rule.files, rule.opts)
        .pipe(rule.createPrePipeline())
        .pipe(gulp.dest(rule.opts.dest ? dest + '/' + rule.opts.dest : dest))
        .pipe(rule.createPostPipeline())
        .pipe(vutil.drain()); //FIXME
  });
}

// Consumes an array of rules along with a destination and processes each rule
// placing the result in the directory specified by dest. globalOpts applies to
// all rules unless said rule explicitly defines that value.

function compile(ruleset, dest, type, globalOpts) {
  globalOpts = globalOpts || {};

  ruleset = ruleset.map(function(r) {
    r = (r instanceof Rule) ? r.clone() : new Rule(r);
    for(var k in globalOpts)
      r.opts[k] = (r.opts[k] === undefined) ? globalOpts[k] : r.opts[k];
    return r;
  });

  if(type === 'watch') {
    return function () {
      ruleset.forEach(function(rule) {
        watch(rule.files, rule.opts)
          .pipe(through.obj(function(file, enc, cb) {
            if(rule.opts.recompileAll) {
              var mstream = this;
              var fstream = gulp.src(rule.files, rule.opts);
              fstream.on('data', function(f) { mstream.push(f); });
              fstream.on('end', function() { cb(); });
            } else {
                this.push(file);
                cb();
            }
          }))
          .pipe(rule.createPrePipeline())
          .pipe(gulp.dest(rule.opts.dest ? dest + '/' + rule.opts.dest : dest))
          .pipe(rule.createPostPipeline())
          .pipe(vutil.drain()); //FIXME
      });
    };
  }

  return buildRuleSet.bind({}, ruleset, dest);
}


module.exports = {
  Rule: Rule,
  compile: compile
};
