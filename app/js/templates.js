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
output += "\n<a href=\"\" data-icon-after=\"forward\" class=\"button-gray my-favourites\">My Favourites</a>\n";
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
