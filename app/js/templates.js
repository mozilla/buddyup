(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["comment.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<div class=\"message vbox\">\n  <p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"content", env.autoesc), env.autoesc);
output += "</p>\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"updated", env.autoesc)) {
output += "\n    <p class=\"hbox\">\n      <span class=\"comment-meta fit\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"created", env.autoesc), env.autoesc);
output += " &ndash; ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"author", env.autoesc), env.autoesc);
output += "</span>\n      ";
output += "\n      ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"question", env.autoesc) && !runtime.contextOrFrameLookup(context, frame, "is_my_question")) {
output += "\n        <button class=\"js-vote vote\" data-icon=\"feedback\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"num_helpful_votes", env.autoesc), env.autoesc);
output += "</button>\n      ";
;
}
output += "\n    </p>\n    ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"id", env.autoesc) == runtime.contextOrFrameLookup(context, frame, "solution_id")) {
output += "\n      <p class=\"is_solution\">Solution ✓</p>\n    ";
;
}
else {
output += "\n      ";
if(runtime.contextOrFrameLookup(context, frame, "is_my_question") && runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username", env.autoesc) != runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "comment")),"creator", env.autoesc)),"username", env.autoesc)) {
output += "\n        <button class=\"js-solve\">Mark question as resolved</button>\n      ";
;
}
output += "\n    ";
;
}
output += "\n  ";
;
}
else {
output += "\n    <span>Sending…</span>\n  ";
;
}
output += "\n</div>\n";
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
output += "<li class=\"list-item\">\n  <a href=\"kb.html?slug=";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "kb_item")),"slug", env.autoesc), env.autoesc);
output += "\">\n    <p class=\"li__title ellipsis\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "kb_item")),"title", env.autoesc), env.autoesc);
output += "</p>\n    <div class=\"hbox\">\n      <span class=\"li__subtitle ellipsis\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "kb_item")),"summary", env.autoesc), env.autoesc);
output += "</span>\n    </div>\n  </a>\n</li>\n";
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
output += "<form name=\"profile\" id=\"profile\" class=\"profile\" method=\"get\">\n  <fieldset class=\"user\">\n    <p>\n      <label for=\"display_name\" class=\"visuallyhidden\">Your Display Name</label>\n      <input type=\"text\" name=\"display_name\" id=\"display_name\" value=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"display_name", env.autoesc), env.autoesc);
output += "\" required />\n      <button type=\"reset\">Clear</button>\n    </p>\n    ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n      <ul class=\"achievements\">\n        <li>\n          <span class=\"count\" data-icon=\"tick\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"solution_count", env.autoesc), env.autoesc);
output += "</span> Questions Answered\n        </li>\n        <li>\n          <span class=\"count\" data-icon=\"feedback\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"helpfulness", env.autoesc), env.autoesc);
output += "</span> Helpful Upvotes\n        </li>\n      </ul>\n    ";
;
}
output += "\n  </fieldset>\n\n  <fieldset class=\"notifications\">\n    <h2>Notifications</h2>\n    <ul>\n      <li>\n        <label for=\"new_comment_notify\" class=\"pack-switch\">\n          <input type=\"checkbox\" id=\"new_comment_notify\" name=\"new_comment_notify\"\n            ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"new_comment_notify", env.autoesc)) {
output += "checked=\"checked\"";
;
}
output += " />\n          <span>New Comments</span>\n        </label>\n      </li>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n        <li>\n          <label for=\"buddyup_reminder\" class=\"pack-switch\">\n            <input type=\"checkbox\" id=\"buddyup_reminder\" name=\"buddyup_reminder\"\n              ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"buddyup_reminder", env.autoesc)) {
output += "checked=\"checked\"";
;
}
output += " />\n            <span>BuddyUp Reminder</span>\n          </label>\n        </li>\n      ";
;
}
output += "\n\n    </ul>\n  </fieldset>\n\n  ";
if(runtime.contextOrFrameLookup(context, frame, "is_helper")) {
output += "\n\n    <fieldset class=\"question-filters\">\n      <h2>Answer A Question Filter</h2>\n      <section>\n        <p>The unanswered questions list will be filtered based on the setting below.</p>\n\n        <label for=\"locale\">Language</label>\n        <span class=\"button icon icon-dialog\">\n          <select id=\"locale\">\n            ";
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
output += "\n              <option ";
if(t_4 == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"locale", env.autoesc)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_4, env.autoesc);
output += "</option>\n            ";
;
}
}
frame = frame.pop();
output += "\n          </select>\n        </span>\n\n        <label for=\"handset_type\">Handset Type</label>\n        <select id=\"handset_type\" multiple=\"true\">\n          ";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"handset_type", env.autoesc)),0, env.autoesc) == "All") {
output += "\n            <option selected=\"selected\">All</option>\n          ";
;
}
output += "\n          ";
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
output += "\n            <option ";
if((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"handset_type", env.autoesc).indexOf(t_8) !== -1)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_8, env.autoesc);
output += "</option>\n          ";
;
}
}
frame = frame.pop();
output += "\n        </select>\n\n        <label for=\"operator\">Operator</label>\n        <select id=\"operator\">\n          ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"operator", env.autoesc) == "All") {
output += "\n            <option selected=\"selected\">All</option>\n          ";
;
}
output += "\n          ";
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
output += "\n            <option ";
if(t_12 == runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"operator", env.autoesc)) {
output += "selected=\"selected\"";
;
}
output += ">";
output += runtime.suppressValue(t_12, env.autoesc);
output += "</option>\n          ";
;
}
}
frame = frame.pop();
output += "\n        </select>\n      </section>\n    </fieldset>\n  ";
;
}
else {
output += "\n    <section>\n      <h2>Answer questions</h2>\n      <p>Sign in to answer support questions from the Mozilla community.</p>\n      <a href=\"authentication.html\" class=\"button-blue\">Create account or sign in</a>\n    </section>\n  ";
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
output += "<li class=\"list-item\">\n  <a href=\"question.html?id=";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"id", env.autoesc), env.autoesc);
output += "\">\n    <p class=\"li__title ellipsis\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"title", env.autoesc), env.autoesc);
output += "</p>\n    <div class=\"hbox\">\n      <span class=\"li__subtitle fit\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"updated", env.autoesc), env.autoesc);
output += "</span>\n      <span class=\"li__comments\" data-icon=\"messages\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "question")),"num_answers", env.autoesc), env.autoesc);
output += "</span>\n    </div>\n  </a>\n</li>\n";
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
output += "<section>\n  ";
if(runtime.contextOrFrameLookup(context, frame, "results")) {
output += "\n    ";
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
output += "\n  ";
;
}
else {
output += "\n    <p class=\"no-data\">";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "message"), env.autoesc);
output += "</p>\n  ";
;
}
output += "\n</section>\n";
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
output += "\"\n  ";
if(runtime.memberLookup((t_4),"author", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "author")) {
output += "class=\"helper-comment\"";
;
}
output += ">\n    ";
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
output += "<h3 class=\"question-cat\">\n  ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "date_posted"), env.autoesc);
output += " - ";
if(runtime.contextOrFrameLookup(context, frame, "handset_type")) {
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "handset_type"), env.autoesc);
output += ", ";
;
}
output += " ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "author"), env.autoesc);
output += "\n</h3>\n";
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
output += "\n    <li>\n      <img src=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"avatar", env.autoesc), env.autoesc);
output += "\" title=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"display_name", env.autoesc), env.autoesc);
output += "\" alt=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"display_name", env.autoesc), env.autoesc);
output += "\" />\n    </li>\n  ";
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
