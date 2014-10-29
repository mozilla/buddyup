(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["comment.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
env.getTemplate("thread.html", true, function(t_2,parentTemplate) {
if(t_2) { cb(t_2); return; }
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
output += "\n";
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_comment(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "\n";
frame = frame.push();
var t_5 = runtime.contextOrFrameLookup(context, frame, "results");
if(t_5) {var t_4 = t_5.length;
for(var t_3=0; t_3 < t_5.length; t_3++) {
var t_6 = t_5[t_3];
frame.set("comment", t_6);
frame.set("loop.index", t_3 + 1);
frame.set("loop.index0", t_3);
frame.set("loop.revindex", t_4 - t_3);
frame.set("loop.revindex0", t_4 - t_3 - 1);
frame.set("loop.first", t_3 === 0);
frame.set("loop.last", t_3 === t_4 - 1);
frame.set("loop.length", t_4);
output += "\n  <li>\n    <p class=\"avatar\"><img src=\"media/icons/tmp.png\" width=\"30\" height=\"30\" alt=\"";
output += runtime.suppressValue(runtime.memberLookup((t_6),"creator", env.autoesc), env.autoesc);
output += "\" /></p>\n    <div class=\"message\">\n      <p>";
output += runtime.suppressValue(runtime.memberLookup((t_6),"content", env.autoesc), env.autoesc);
output += "</p>\n      <span class=\"comment-meta\">";
output += runtime.suppressValue(runtime.memberLookup((t_6),"updated", env.autoesc), env.autoesc);
output += " &ndash; ";
output += runtime.suppressValue(runtime.memberLookup((t_6),"creator", env.autoesc), env.autoesc);
output += "</span>\n      <span class=\"votes-total vote\" data-icon=\"feedback\">";
output += runtime.suppressValue(runtime.memberLookup((t_6),"num_votes_past_week", env.autoesc), env.autoesc);
output += "</span>\n    </div>\n  </li>\n";
;
}
}
frame = frame.pop();
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_comment: b_comment,
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["questions.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
if(!runtime.contextOrFrameLookup(context, frame, "all")) {
output += "\n<h2>My Questions</h2>\n";
;
}
output += "\n<ul data-type=\"budyup-list\">\n  ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "results");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("question", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n  <li>\n    <a href=\"question.html?id=";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id", env.autoesc), env.autoesc);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title", env.autoesc), env.autoesc);
output += "</a>\n    <ul class=\"interaction\">\n      <li class=\"comment-total\" data-icon-after=\"messages\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"num_answers", env.autoesc), env.autoesc);
output += "</li>\n      <li class=\"votes-total\" data-icon-after=\"feedback\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"num_votes_past_week", env.autoesc), env.autoesc);
output += "<li>\n    </ul>\n    <span class=\"last-activity\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"updated", env.autoesc), env.autoesc);
output += "</span>\n  </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n</ul>\n";
if(!runtime.contextOrFrameLookup(context, frame, "all")) {
output += "\n<a href=\"my_questions.html\" data-icon-after=\"forward\" class=\"button-gray\">All My Questions</a>\n";
;
}
output += "\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["thread.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<h3 class=\"question-cat\">Today - Flame, 2.1, Fido</h3>\n<ul class=\"discuss\">\n  ";
context.getBlock("comment")(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n</ul>\n";
cb(null, output);
});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_comment(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_comment: b_comment,
root: root
};
})();
})();
