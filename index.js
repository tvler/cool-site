---
---

{% include_relative Card.js %}

document.querySelectorAll('a').forEach(function(a) {
   a.addEventListener('touchstart', function(){})
})

document.querySelectorAll('.card-container').forEach(function(cardContainer) {
   new Card(cardContainer)
})