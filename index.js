---
---

(function() {
   {% include_relative Card.js %}

   function init() {
      document.querySelectorAll('a').forEach(function(a) {
         a.addEventListener('touchstart', function(){})
      })

      document.querySelectorAll('.card-container').forEach(function(cardContainer) {
         new Card(cardContainer)
      })
   }

   document.readyState !== 'loading' ? init() :
    document.addEventListener('DOMContentLoaded', init);
})()