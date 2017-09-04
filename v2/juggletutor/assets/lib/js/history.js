/*
 * history API JavaScript Library v3.2.2
 *
 * Support: IE6+, FF3+, Opera 9+, Safari, Chrome, Firefox and other
 *
 * Copyright 2011-2013, Dmitriy Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 16-01-2013
 */
(function(e,v,q,n,G){function H(a,b,g){var d=2===a?e.onhashchange:e.onpopstate,c=2===a?"hashchange":"popstate",f=w[c];r.createEvent?(a=r.createEvent("Events"),a.initEvent(c,q,q)):(a=r.createEventObject(),a.type=c);a.state=j.state;a.oldURL=b;a.newURL=g;d&&d.call(e,a);b=0;for(g=f.length;b<g;b++)f[b].call(e,a)}function P(a){return I?a?I.setItem("__hitoryapi__",J(a)):Q(I.getItem("__hitoryapi__"))||{}:{}}function R(a,b,g){var d=a,c,f=q;if(z||A)for(c in b){if(B.call(b,c))if(A)b[c].get&&A.call(a,c,b[c].get),
b[c].set&&Y.call(a,c,b[c].set);else if(z)try{z(a,c,b[c])}catch(h){if(g)return q;f=v;break}}else f=v;if(f&&x){g="StaticClass"+Z+x++;d=["Class "+g];"execVB"in e||execScript("Function execVB(c) ExecuteGlobal(c) End Function","VBScript");"VBCVal"in e||execScript("Function VBCVal(o,r) If IsObject(o) Then Set r=o Else r=o End If End Function","VBScript");for(c in a)d[d.length]="Public ["+c+"]";B.call(a,"toString")&&(a.propertyIsEnumerable("toString")||(d[d.length]="Public [toString]"),b["(toString)"]={get:function(){return this.toString.call(this)}});
for(c in b)if(B.call(b,c)&&(b[c].get&&(a["get "+c]=b[c].get,d.push("Public [get "+c+"]","Public "+("(toString)"===c?"Default ":"")+"Property Get ["+c+"]","Call VBCVal(me.[get "+c+"].call(me),["+c+"])","End Property")),b[c].set))a["set "+c]=b[c].set,d.push("Public [set "+c+"]","Public Property Let ["+c+"](v)","Call me.[set "+c+"].call(me,v)","End Property","Public Property Set ["+c+"](v)","Call me.[set "+c+"].call(me,v)","End Property");d.push("End Class","Function "+g+"Factory()","Set "+g+"Factory=New "+
g,"End Function");execVB(d.join("\n"));d=e[g+"Factory"]();for(c in a)d[c]=a[c];B.call(a,"toString")&&(d.toString=a.toString)}return d}var r=e.document,K=r.documentElement,s=e.history||{},f=e.location,m=!!s.pushState,$=m&&s.state===G,t=f.href,u=e.JSON||{},z=Object.defineProperty,A=Object.prototype.__defineGetter__,Y=Object.prototype.__defineSetter__,U=s.pushState,V=s.replaceState,I=e.sessionStorage,B=Object.prototype.hasOwnProperty,aa=Object.prototype.toString,L=+((e.eval&&eval("/*@cc_on 1;@*/")&&
/msie (\d+)/i.exec(navigator.userAgent)||[])[1]||0),Z=(new Date).getTime(),x=(z||A)&&(!L||8<L)?0:1,i=8>L?r.createElement("iframe"):q,y,C,D,E="",F=(y="addEventListener",e[y])||(y="attachEvent",E="on",e[y]),ba=(C="removeEventListener",e[C])||(C="detachEvent",e[C]),ca=(D="dispatchEvent",e[D])||(D="fireEvent",e[D]),M=[],W=[],S=0,w={onpopstate:M,popstate:M,onhashchange:W,hashchange:W},o=function(){var a,b,g,d={basepath:"/",redirect:0,type:"/"};g=r.getElementsByTagName("SCRIPT");for(a=0;g[a];a++)if(b=/(.*)\/(?:history|spike)(?:\.iegte8)?(?:-\d\.\d(?:\.\d)?\w?)?(?:\.min)?.js\?(.*)$/i.exec(g[a].src)||
a===g.length-1&&2===(b=g[a].src.split("?")).length&&(b[2]=b[1])&&b){a=0;for(g=b[2].split("&");g[a];)b=g[a++].split("="),d[b[0]]="true"==b[1]?v:"false"==b[1]?q:b[1]||"";d.basepath=d.basepath||"/";break}return d}(),k=function(a){var b,g,d,c,e,h,p,da=RegExp("^"+o.basepath,"i");return function(l,ea){if(l){if(!m||L)var N=k(),i=N.f,j=N.i,l=/^(?:[\w0-9]+\:)?\/\//.test(l)?0===l.indexOf("/")?j+l:l:j+"//"+N.h+(0===l.indexOf("/")?l:0===l.indexOf("?")?i+l:0===l.indexOf("#")?i+N.g+l:i.replace(/[^\/]+$/g,"")+l)}else if(l=
f.href,!m||ea)l=f.protocol+"//"+f.host+o.basepath+(l.replace(/^[^#]*/,"")||"#").replace(RegExp("^#[/]?(?:"+o.type+")?"),"");if(b!==l){a.href=b=l;h=a.port;e=a.host;p=a.pathname;if("http:"===a.protocol&&80==h||"https:"===a.protocol&&443==h)e=a.hostname,h="";p=0===p.indexOf("/")?p:"/"+p;g=p+a.search+a.hash;c=p.replace(da,o.type)+a.search;d=c+a.hash}return{a:a.protocol+"//"+e+g,i:a.protocol,h:e,j:a.hostname||f.hostname,k:h||f.port,f:p,g:a.search,b:a.hash,d:g,c:c,e:d}}}(r.createElement("a")),j=!x?s:{back:s.back,
forward:s.forward,go:s.go,pushState:n,replaceState:n,emulate:!m,toString:function(){return"[object History]"}},O={state:{get:function(){return i&&i.storage||P()[j.location.href]||n}},length:{get:function(){return s.length}},location:{set:function(a){e.location=a},get:function(){return m?f:T}}},T={assign:function(a){f.assign(m||0!==a.indexOf("#")?a:"#"+k().c+a)},reload:f.reload,replace:function(a){f.replace(m||0!==a.indexOf("#")?a:"#"+k().c+a)},toString:function(){return this.href}},fa={href:{set:function(a){f.href=
a},get:function(){return k().a}},protocol:{set:function(a){f.protocol=a},get:function(){return f.protocol}},host:{set:function(a){f.host=a},get:function(){return f.host}},hostname:{set:function(a){f.hostname=a},get:function(){return f.hostname}},port:{set:function(a){f.port=a},get:function(){return f.port}},pathname:{set:function(a){f.pathname=a},get:function(){return k().f}},search:{set:function(a){f.search=a},get:function(){return k().g}},hash:{set:function(a){var a=0===a.indexOf("#")?a:"#"+a,b=
k();i?a!=b.b&&(j.pushState(n,n,b.c+a),X({oldURL:b.a})):f.hash="#"+b.c+a},get:function(){return k().b}}},J=u.stringify||function(a){function b(d){var c,f,h;c=(typeof d).charCodeAt(2);if(114===c)d=e(d);else if(109===c)d=isFinite(d)?""+d:"null";else if(111===c||108===c)d=""+d;else if(106===c)if(d){f=(c="[object Array]"===aa.apply(d))?"[":"{";if(c)for(h=0;h<d.length;h++)f+=(0==h?"":",")+b(d[h]);else for(h in d)B.call(d,h)&&d[h]!==a&&(f+=(1==f.length?"":",")+e(h)+":"+b(d[h]));d=f+(c?"]":"}")}else d="null";
else d=a;return d}function e(a){var c=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,b={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};c.lastIndex=0;return c.test(a)?'"'+a.replace(c,function(a){var c=b[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}return b}(),Q=function(){var a=u.parse;return function(b){return b?a?a(b):(new Function("return "+
b))():n}}(),X=function(){function a(a){var b=k();if(S)return p=b.a,S=0;var d=a.oldURL||p,a=p=a.newURL||b.a,b=d.replace(/^.*?(#|$)/,""),e=a.replace(/^.*?(#|$)/,"");d!=a&&!c&&H();t=c=0;b!=e&&H(2,d,a)}function b(){if(t&&!(t=0)&&h.d!==o.basepath)clearInterval(i),setTimeout(H,10)}var g=e.onpopstate||n,d=e.onhashchange||n,c=0,i=n,h=k(),p=h.a;h.b.replace(/^#/,"");F(E+"hashchange",a,q);F(E+"popstate",function(){if(t===f.href)return t=0;t=0;H(c=1)},q);j.redirect=function(a,b){o.type=a===G?o.type:a;o.basepath=
b===G?o.basepath:b;if(e.top==e.self){var c=k(n,v).d,d=f.search,g=f.pathname,b=o.basepath;m?(c!=b&&RegExp("^"+b+"$","i").test(g)&&(f.href=c),RegExp("^"+b+"$","i").test(g+"/"))?f.href=b:RegExp("^"+b,"i").test(g)||(f.href=g.replace(/^\//,b)+d):g!=b&&(f.href=b+"#"+g.replace(RegExp("^"+b,"i"),o.type)+d+f.hash)}};j=R(j,x?O:s.state===G?{state:O.state,location:O.location}:{location:O.location});T=R(T,fa);e[y]=function(a,c,d){w[a]?(w[a].push(c),!m&&M===w[a]&&b()):3<arguments.length?F(a,c,d,arguments[3]):F(a,
c,d)};e[C]=function(a,b,c){var d=w[a];if(d)for(a=d.length;--a;){if(d[a]===b){d.splice(a,1);break}}else ba(a,b,c)};e[D]=function(a,b){var c=w[a],d=c===M?e.onpopstate:e.onhashchange;if(c){b=b||("string"==typeof a?e.event:a);try{b&&(b.target=e)}catch(f){try{b.srcElement=e}catch(g){}}d&&d.call(e,b);for(var d=0,h=c.length;d<h;d++)c[d].call(e,b);return v}return ca(a,b)};x&&execScript("Public history, onhashchange","VBScript");if((!z&&!A||!R(e,{onhashchange:{get:function(){return d},set:function(a){d=a||
n}},onpopstate:{get:function(){return g},set:function(a){(g=a||n)&&!m&&b()}}},1))&&!m)i=setInterval(function(){e.onpopstate&&b()},100);o.redirect&&j.redirect();if(!m)r[y](E+"click",function(a){var b=a||e.event,c=b.target||b.srcElement,a="defaultPrevented"in b?b.defaultPrevented:b.returnValue===q;if(c&&"A"===c.nodeName&&!a&&(a=k(c.getAttribute("href",2),v),a.b&&"#"!==a.b&&a.b===a.a.replace(k().a.split("#").shift(),""))){history.location.hash=a.b;a=a.b.replace(/^#/,"");if((c=r.getElementById(a))&&c.id===
a&&"A"===c.nodeName)c=c.getBoundingClientRect(),e.scrollTo(K.scrollLeft||0,c.top+(K.scrollTop||0)-(K.clientTop||0));b.preventDefault?b.preventDefault():b.returnValue=!1}},q);return a}();j.pushState=function(a,b,e,d){var c=P(),i=k().a,h=e&&k(e);t=0;e=h?h.a:i;d&&c[i]&&delete c[i];if((!m||$)&&I&&a)c[e]=a,P(c),a=n;U&&V?d?V.call(j,a,b,e):U.call(j,a,b,e):h&&h.d!=k().d&&(S=1,d?f.replace("#"+h.e):f.hash=h.e)};j.replaceState=function(a,b,e){j.pushState(a,b,e,1)};x?(e.history=j,function(a,b){if(i){var g,d,
c=function(){var a=k().a;b!=a&&X({oldURL:b,newURL:b=a})};d=setInterval(c,100);i.src="javascript:true;";i=K.firstChild.appendChild(i).contentWindow;j.pushState=g=function(a,e,j,l,m){var n=i.document,o=["<script>","lfirst=1;",,"storage="+J(a)+";","<\/script>"];if(j=j&&k(j)){m||clearInterval(d);if(l)i.lfirst?(history.back(),g(a,e,j.a,0,1)):(i.storage=a,f.replace("#"+j.e));else if(j.a!=b||m)i.lfirst||(i.lfirst=1,g(i.storage,e,b,0,1)),o[2]='parent.location.hash="'+j.e.replace(/"/g,'\\"')+'";',n.open(),
n.write(o.join("")),n.close();m||(b=k().a,d=setInterval(c,100))}else i.storage=a};F(E+"unload",function(){if(i.storage){var a={};a[k().a]=i.storage;r.cookie="_historyAPI="+escape(J(a))}clearInterval(d)},q);if(1<a.length){a=unescape(a.pop().split(";").shift());try{i.storage=Q(a)[k().a]}catch(m){}}!u.parse&&!u.stringify&&(u.parse=Q,u.stringify=J,e.JSON=u)}}(r.cookie.split("_historyAPI="),k().a)):e.history.emulate=!m})(window,!0,!1,null);
