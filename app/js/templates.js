(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["comment.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"Comment-content\">\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"title", env.autoesc)) {
output += "\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"title", env.autoesc), env.autoesc);
output += "\n  ";
;
}
else {
output += "\n    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"content", env.autoesc)), env.autoesc);
output += "\n  ";
;
}
output += "\n</div>\n\n<div class=\"Comment-meta hbox\">\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"updated", env.autoesc)) {
output += "\n    <span class=\"fit ellipsis\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"created", env.autoesc), env.autoesc);
output += " &ndash; ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"author", env.autoesc), env.autoesc);
output += "</span>\n    ";
output += "\n    ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"question", env.autoesc) && !runtime.contextOrFrameLookup(context, frame, "is_my_question")) {
output += "\n      <a href=\"#\" role=\"button\" class=\"js-vote Comment-vote\" data-icon=\"feedback\">\n      ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"num_helpful_votes", env.autoesc), env.autoesc);
output += "\n      </a>\n    ";
;
}
output += "\n  ";
;
}
else {
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"failed", env.autoesc)) {
output += "\n    <span>";
output += runtime.suppressValue((lineno = 18, colno = 12, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Failed"])), env.autoesc);
output += "</span>\n  ";
;
}
else {
output += "\n    <span>";
output += runtime.suppressValue((lineno = 20, colno = 12, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Sending…"])), env.autoesc);
output += "</span>\n  ";
;
}
;
}
output += "\n</div>\n\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"updated", env.autoesc)) {
output += "\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"id", env.autoesc) == runtime.contextOrFrameLookup(context, frame, "solution_id")) {
output += "\n    <p class=\"Comment-solution Comment-solutionBox\">";
output += runtime.suppressValue((lineno = 26, colno = 54, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Solution ✓"])), env.autoesc);
output += "</p>\n  ";
;
}
else {
output += "\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_my_question") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username", env.autoesc) != runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"creator", env.autoesc)),"username", env.autoesc)) {
output += "\n      <a class=\"js-solve Comment-markSolution Comment-solutionBox\">";
output += runtime.suppressValue((lineno = 29, colno = 69, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["This solved my question"])), env.autoesc);
output += "</a>\n    ";
;
}
output += "\n  ";
;
}
output += "\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["generic_error.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<form id=\"generic_error\" role=\"dialog\" data-type=\"confirm\">\n  <section>\n    <h1>";
output += runtime.suppressValue((lineno = 2, colno = 10, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Whoops!"])), env.autoesc);
output += "</h1>\n    <p>";
output += runtime.suppressValue((lineno = 3, colno = 9, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["There was a problem with Buddy Up, please try again."])), env.autoesc);
output += "</p>\n  </section>\n  <menu>\n    <button class=\"recommend\">";
output += runtime.suppressValue((lineno = 6, colno = 32, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["OK"])), env.autoesc);
output += "</button>\n  </menu>\n</form>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["helper_profile.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<img class=\"ProfileDetails-avatar\" src=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"avatar", env.autoesc), env.autoesc);
output += "\" alt=\"\">\n<div class=\"hbox ProfileDetails-stats\">\n  <div class=\"fit vbox\">\n    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, (lineno = 3, colno = 12, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_plural"), "_plural", ["<div {countattr}>{n}</div><div {textattr}> question solved</div>","<div {countattr}>{n}</div><div {textattr}> questions solved</div>",runtime.makeKeywordArgs({"countattr": "class=\"ProfileDetails-statcounts\"","textattr": "data-icon=\"tick\"","n": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"solution_count", env.autoesc)})]))), env.autoesc);
output += "\n  </div>\n  <div class=\"fit vbox\">\n    ";
output += runtime.suppressValue(env.getFilter("safe").call(context, (lineno = 11, colno = 12, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_plural"), "_plural", ["<div {countattr}>{n}</div><div {textattr}> helpful vote</div>","<div {countattr}>{n}</div><div {textattr}> helpful votes</div>",runtime.makeKeywordArgs({"countattr": "class=\"ProfileDetails-statcounts\"","textattr": "data-icon=\"feedback\"","n": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"helpfulness", env.autoesc)})]))), env.autoesc);
output += "\n  </div>\n</div>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["kb_item.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<li>\n  <a href=\"kb.html?slug=";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "kb_item")),"slug", env.autoesc), env.autoesc);
output += "\" class=\"ListItem\">\n    <div class=\"ListItem-inside\">\n      <p class=\"li__title\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "kb_item")),"title", env.autoesc), env.autoesc);
output += "</p>\n    </div>\n  </a>\n</li>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["my-profile.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<form name=\"profile\" id=\"profile\">\n  <div class=\"hbox SettingsInfo ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "is-helper";
;
}
output += "\">\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n      <img class=\"SettingsInfo-avatar\" src=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"avatar", env.autoesc), env.autoesc);
output += "\" alt=\"\">\n    ";
;
}
output += "\n    <div class=\"fit vbox\">\n      <input type=\"text\" name=\"display_name\" id=\"display_name\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"display_name", env.autoesc), env.autoesc);
output += "\" class=\"SettingsInfo-name\" required />\n      ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n        <ul class=\"SettingsInfo-achievements\">\n          <li data-icon=\"tick\">\n            ";
output += runtime.suppressValue((lineno = 10, colno = 20, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_plural"), "_plural", ["{n} question solved","{n} questions solved",runtime.makeKeywordArgs({"n": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"solution_count", env.autoesc)})])), env.autoesc);
output += "\n          </li>\n          <li data-icon=\"feedback\">\n            ";
output += runtime.suppressValue((lineno = 13, colno = 20, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_plural"), "_plural", ["{n} helpful vote","{n} helpful votes",runtime.makeKeywordArgs({"n": runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"helpfulness", env.autoesc)})])), env.autoesc);
output += "\n          </li>\n        </ul>\n      ";
;
}
output += "\n    </div>\n  </div>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n\n    <fieldset>\n      <header>\n        <h2>";
output += runtime.suppressValue((lineno = 24, colno = 14, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["My preferences"])), env.autoesc);
output += "</h2>\n      </header>\n      <section class=\"QuestionFilters\">\n        <p class=\"QuestionFilters-description\">\n          ";
output += runtime.suppressValue((lineno = 28, colno = 12, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Too many questions? Use the settings below to narrow down the \"Answer a Question\" list."])), env.autoesc);
output += "\n        </p>\n\n        <ul>\n          <li>\n            <label class=\"QuestionFilters-label\" for=\"locale\">Language</label>\n            <div class=\"button\" data-icon=\"expand\">\n              <select id=\"locale\">\n              ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "locales");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("locale", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n                <option ";
if(t_4 == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"locale", env.autoesc)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_4, env.autoesc);
output += "</option>\n              ";
;
}
}
frame = frame.pop();
output += "\n              </select>\n            </div>\n          </li>\n\n          <li>\n            <label class=\"QuestionFilters-label\" for=\"handset_type\">Device</label>\n            <div class=\"button\" data-icon=\"expand\">\n              <select id=\"handset_type\"> ";
output += "\n                ";
frame = frame.push();
var t_7 = runtime.contextOrFrameLookup(context, frame, "handsets");
if(t_7) {var t_6 = t_7.length;
for(var t_5=0; t_5 < t_7.length; t_5++) {
var t_8 = t_7[t_5];
frame.set("handset", t_8);
frame.set("loop.index", t_5 + 1);
frame.set("loop.index0", t_5);
frame.set("loop.revindex", t_6 - t_5);
frame.set("loop.revindex0", t_6 - t_5 - 1);
frame.set("loop.first", t_5 === 0);
frame.set("loop.last", t_5 === t_6 - 1);
frame.set("loop.length", t_6);
output += "\n                  <option ";
if(t_8 == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"handset_type", env.autoesc)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_8, env.autoesc);
output += "</option>\n                ";
;
}
}
frame = frame.pop();
output += "\n              </select>\n            </div>\n          </li>\n\n          <li>\n            <label class=\"QuestionFilters-label\" for=\"operator\">Operator</label>\n            <div class=\"button\" data-icon=\"expand\">\n              <select id=\"operator\">\n                ";
frame = frame.push();
var t_11 = runtime.contextOrFrameLookup(context, frame, "operators");
if(t_11) {var t_10 = t_11.length;
for(var t_9=0; t_9 < t_11.length; t_9++) {
var t_12 = t_11[t_9];
frame.set("operator", t_12);
frame.set("loop.index", t_9 + 1);
frame.set("loop.index0", t_9);
frame.set("loop.revindex", t_10 - t_9);
frame.set("loop.revindex0", t_10 - t_9 - 1);
frame.set("loop.first", t_9 === 0);
frame.set("loop.last", t_9 === t_10 - 1);
frame.set("loop.length", t_10);
output += "\n                  <option ";
if(t_12 == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"operator", env.autoesc)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_12, env.autoesc);
output += "</option>\n                ";
;
}
}
frame = frame.pop();
output += "\n              </select>\n            </div>\n          </li>\n        </ul>\n      </section>\n    </fieldset>\n  ";
;
}
else {
output += "\n    <header>\n      <h2>Answer questions</h2>\n    </header>\n    <section class=\"QuestionFilters\">\n      <p class=\"QuestionFilters-description\">\n        ";
output += runtime.suppressValue((lineno = 73, colno = 10, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Sign in to answer questions from the Mozilla community."])), env.autoesc);
output += "\n      </p>\n      <a href=\"authentication.html\" class=\"bb-button recommend\" data-modal=\"true\">\n        ";
output += runtime.suppressValue((lineno = 76, colno = 10, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Create account or sign in"])), env.autoesc);
output += "\n      </a>\n    </section>\n  ";
;
}
output += "\n\n</form>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["question.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<li>\n  <a href=\"question.html?id=";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"id", env.autoesc), env.autoesc);
output += "\" class=\"ListItem\">\n    <div class=\"ListItem-inside\">\n      <p class=\"li__title ellipsis\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"title", env.autoesc), env.autoesc);
output += "</p>\n      <div class=\"hbox\">\n        <span class=\"li__subtitle fit\">\n        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"handset_type", env.autoesc), env.autoesc);
output += "\n        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"os_version", env.autoesc), env.autoesc);
if((runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"handset_type", env.autoesc) || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"os_version", env.autoesc)) && runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"operator", env.autoesc)) {
output += ", ";
;
}
output += "\n        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"displayable_metadata", env.autoesc)),"operator", env.autoesc), env.autoesc);
output += "\n        </span>\n        <span class=\"li__comments\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"num_answers", env.autoesc), env.autoesc);
output += "</span>\n      </div>\n    </div>\n  </a>\n</li>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["question_list_day.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
if(runtime.contextOrFrameLookup(context, frame, "results")) {
output += "\n  <section>\n    ";
frame = frame.push();
var t_3 = env.getFilter("groupby").call(context, runtime.contextOrFrameLookup(context, frame, "results"),"updated_day");
if(t_3) {var t_1;
if(runtime.isArray(t_3)) {
var t_2 = t_3.length;
for(t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1][0]
frame.set("day", t_3[t_1][0]);
var t_5 = t_3[t_1][1]
frame.set("questions", t_3[t_1][1]);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n      <h1 class=\"list-day\">";
output += runtime.suppressValue(t_4, env.autoesc);
output += "</h1>\n      <ul>\n      ";
frame = frame.push();
var t_8 = t_5;
if(t_8) {var t_7 = t_8.length;
for(var t_6=0; t_6 < t_8.length; t_6++) {
var t_9 = t_8[t_6];
frame.set("question", t_9);
frame.set("loop.index", t_6 + 1);
frame.set("loop.index0", t_6);
frame.set("loop.revindex", t_7 - t_6);
frame.set("loop.revindex0", t_7 - t_6 - 1);
frame.set("loop.first", t_6 === 0);
frame.set("loop.last", t_6 === t_7 - 1);
frame.set("loop.length", t_7);
output += "\n        ";
env.getTemplate("question.html", function(t_12,t_10) {
if(t_12) { cb(t_12); return; }
t_10.render(context.getVariables(), frame.push(), function(t_13,t_11) {
if(t_13) { cb(t_13); return; }
output += t_11
output += "\n      ";
})});
}
}
frame = frame.pop();
output += "\n      </ul>\n    ";
;
}
} else {
t_1 = -1;
var t_2 = runtime.keys(t_3).length;
for(var t_14 in t_3) {
t_1++;
var t_15 = t_3[t_14];
frame.set("day", t_14);
frame.set("questions", t_15);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n      <h1 class=\"list-day\">";
output += runtime.suppressValue(t_14, env.autoesc);
output += "</h1>\n      <ul>\n      ";
frame = frame.push();
var t_18 = t_15;
if(t_18) {var t_17 = t_18.length;
for(var t_16=0; t_16 < t_18.length; t_16++) {
var t_19 = t_18[t_16];
frame.set("question", t_19);
frame.set("loop.index", t_16 + 1);
frame.set("loop.index0", t_16);
frame.set("loop.revindex", t_17 - t_16);
frame.set("loop.revindex0", t_17 - t_16 - 1);
frame.set("loop.first", t_16 === 0);
frame.set("loop.last", t_16 === t_17 - 1);
frame.set("loop.length", t_17);
output += "\n        ";
env.getTemplate("question.html", function(t_22,t_20) {
if(t_22) { cb(t_22); return; }
t_20.render(context.getVariables(), frame.push(), function(t_23,t_21) {
if(t_23) { cb(t_23); return; }
output += t_21
output += "\n      ";
})});
}
}
frame = frame.pop();
output += "\n      </ul>\n    ";
;
}
}
}
frame = frame.pop();
output += "\n  </section>\n";
;
}
else {
output += "\n  ";
if(runtime.contextOrFrameLookup(context, frame, "message")) {
output += "\n    <p class=\"margin-10\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "message"), env.autoesc);
output += "</p>\n  ";
;
}
else {
output += "\n    <section class=\"NoQuestionsMessage vbox fit\">\n      <strong>";
output += runtime.suppressValue((lineno = 16, colno = 16, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["No active questions"])), env.autoesc);
output += "</strong>\n      ";
output += runtime.suppressValue((lineno = 17, colno = 8, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "_"), "_", ["Go to the New tab to answer some questions. We'll keep track of them here."])), env.autoesc);
output += "\n    </section>\n  ";
;
}
output += "\n";
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
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "results");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("comment", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n  <li\n  data-id=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id", env.autoesc), env.autoesc);
output += "\"\n  class=\"Comment vbox\n  ";
if(runtime.memberLookup((t_4),"author", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "author")) {
output += "\n    Comment--helper\n  ";
;
}
else {
output += "\n    Comment--helpee\n  ";
;
}
output += "\">\n    ";
env.getTemplate("comment.html", function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
t_5.render(context.getVariables(), frame.push(), function(t_8,t_6) {
if(t_8) { cb(t_8); return; }
output += t_6
output += "\n  </li>\n";
})});
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
root: root
};
})();
})();
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["thread_header.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"QuestionThread-meta\">\n  ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"handset_type", env.autoesc), env.autoesc);
output += "\n  ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"os_version", env.autoesc), env.autoesc);
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"handset_type", env.autoesc) || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"os_version", env.autoesc)) && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"operator", env.autoesc)) {
output += ",\n    ";
output += "\n  ";
;
}
output += "\n  <span class=\"text-blue\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "displayable_metadata")),"operator", env.autoesc), env.autoesc);
output += "</span>\n</div>\n<h3 class=\"QuestionThread-date text-blue\">\n  ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "date_posted"), env.autoesc);
output += "\n</h3>\n\n";
if(runtime.contextOrFrameLookup(context, frame, "viewer_is_helper")) {
output += "\n  ";
output += "\n  <ul>\n    <li>\n      <div class=\"button\" data-icon=\"forward\">\n        <select id=\"category_chooser\">\n        ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "categories");
if(t_3) {var t_1;
if(runtime.isArray(t_3)) {
var t_2 = t_3.length;
for(t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1][0]
frame.set("key", t_3[t_1][0]);
var t_5 = t_3[t_1][1]
frame.set("value", t_3[t_1][1]);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n          <option value=\"";
output += runtime.suppressValue(t_4, env.autoesc);
output += "\"\n            ";
if(runtime.contextOrFrameLookup(context, frame, "selected_category") == t_4) {
output += "selected";
;
}
output += ">\n            ";
output += runtime.suppressValue(t_5, env.autoesc);
output += "\n          </option>\n        ";
;
}
} else {
t_1 = -1;
var t_2 = runtime.keys(t_3).length;
for(var t_6 in t_3) {
t_1++;
var t_7 = t_3[t_6];
frame.set("key", t_6);
frame.set("value", t_7);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n          <option value=\"";
output += runtime.suppressValue(t_6, env.autoesc);
output += "\"\n            ";
if(runtime.contextOrFrameLookup(context, frame, "selected_category") == t_6) {
output += "selected";
;
}
output += ">\n            ";
output += runtime.suppressValue(t_7, env.autoesc);
output += "\n          </option>\n        ";
;
}
}
}
frame = frame.pop();
output += "\n        </select>\n      </div>\n    </li>\n  </ul>\n";
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
(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["users_list.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul>\n  ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "users");
if(t_3) {var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("user", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n    <li>\n      <a href=\"helper_profile.html?username=";
output += runtime.suppressValue(runtime.memberLookup((t_4),"username", env.autoesc), env.autoesc);
output += "\" data-modal=\"true\">\n        <img src=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"avatar", env.autoesc), env.autoesc);
output += "\" alt=\"\" />\n      </a>\n    </li>\n  ";
;
}
}
frame = frame.pop();
output += "\n</ul>\n";
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
