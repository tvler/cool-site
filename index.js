---
---

(function() {
   function loadMedia(t,e,n){"use strict";var r=[];function i(){o(t)}document.readyState!=="loading"?i():document.addEventListener("DOMContentLoaded",i);function A(t,n,i){var A=t.getBoundingClientRect(),o=300;if(A.bottom>=-o&&A.top-window.innerHeight<o&&(A.right>=-o&&A.left-window.innerWidth<o)){clearInterval(r[n]);t.onload=e;i&&(t.srcset=i);t.src=n}}function o(t){var i,o,l,d,a,c=0,s="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";if(t==null||typeof t==="string"){t=document.body.querySelectorAll(t||"noscript")}else if(!t.length){t=[t]}while(i=t[c++]){o=document.importNode((new DOMParser).parseFromString(i.textContent,"text/html").body.firstChild,true);a=i.parentElement;if(n){l=o.getAttribute("src");d=o.getAttribute("srcset");o.src=s;o.removeAttribute("srcset");a.replaceChild(o,i);r[l]=setInterval(A,100,o,l,d)}else{o.onload=e;a.replaceChild(o,i)}}}}

   {% include_relative Card.js %}

   function init() {
      document.querySelectorAll('a').forEach(function(a) {
         a.addEventListener('touchstart', function(){})
      })

      document.querySelectorAll('.card-container').forEach(function(cardContainer) {
         new Card(cardContainer)
      })

      loadMedia('.lazyload')
   }

   document.readyState !== 'loading' ? init() :
    document.addEventListener('DOMContentLoaded', init);
})()