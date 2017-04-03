function Card(el) {

   // Variables

   var cardElement = el
   var cardElementStyle = getCardElement().style
   var cardRotateDampener = 0.05
   var cardElementRect = null
   var cardInitialStyle = new Style({
      perspectiveOriginX: 50,
      perspectiveOriginY: 50,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      opacity: 0
   })
   var cardStyle = getCardInitialStyle()
   var cardRenderStyle = getCardInitialStyle()
   var cardAnimating = false
   var cardAnimateDuration = 200
   var cardAnimateFromStyle = getCardInitialStyle()
   var cardAnimateFromTime = null
   var cardIsPointerdown = false
   var cardSpritesheetRows = getCardElement().dataset.spritesheetRows
   var cardSpritesheetColumns = getCardElement().dataset.spritesheetColumns
   var cardSpritesheetFrames = getCardElement().dataset.spritesheetFrames

   // Getters and setters

   function getCardElement() { return cardElement }

   function getCardElementStyle() { return cardElementStyle }

   function getCardRotateDampener() { return cardRotateDampener }

   function getCardElementRect() { return cardElementRect }
   function setCardElementRect(rect) { cardElementRect = rect }

   function getCardInitialStyle() { return cardInitialStyle.clone() }

   function getCardStyle() { return cardStyle.clone() }
   function setCardStyle(s) { cardStyle = s }

   function getCardRenderStyle() { return cardRenderStyle.clone() }
   function setCardRenderStyle(s) { cardRenderStyle = s }

   function getCardAnimating() { return cardAnimating }
   function setCardAnimating(boolean) { cardAnimating = boolean }

   function getCardAnimateDuration() { return cardAnimateDuration }

   function getCardAnimateFromStyle() { return cardAnimateFromStyle.clone() }
   function setCardAnimateFromStyle(s) { cardAnimateFromStyle = s }

   function getCardAnimateFromTime() { return cardAnimateFromTime }
   function setCardAnimateFromTime(t) { cardAnimateFromTime = t }

   function getCardIsPointerdown() { return cardIsPointerdown }
   function setCardIsPointerdown(boolean) { cardIsPointerdown = boolean }

   function getCardSpritesheetRows() { return cardSpritesheetRows }

   function getCardSpritesheetColumns() { return cardSpritesheetColumns }

   function getCardSpritesheetFrames() { return cardSpritesheetFrames }

   // Functions

   function getCardStyleWithPointer(t) {
      var dampenedPointer = t.dampen(getCardElementRect())
      var amountFromLeft = (dampenedPointer.clientX - getCardElementRect().left) / getCardElementRect().width
      var amountFromTop = (dampenedPointer.clientY - getCardElementRect().top) / getCardElementRect().height

      var currentFrame = Math.min(
         Math.max(Math.round(getCardSpritesheetFrames() * (1 - amountFromTop)), 0),
         getCardSpritesheetFrames() - 1
      )

      var getCurrentSpritePositionX = function() {
         return (currentFrame % getCardSpritesheetColumns()) * 100 / getCardSpritesheetColumns();
      };

      var getCurrentSpritePositionY = function() {
         return Math.floor(currentFrame / getCardSpritesheetColumns()) * 100 / getCardSpritesheetRows();
      };

      var getAnimationCssString = function() {
         return 'translateX(-' + getCurrentSpritePositionX() + '%) translateY(-'
          + getCurrentSpritePositionY() +'%)';
      };

      console.log(getAnimationCssString())

      return getCardStyle().set({
         perspectiveOriginX: amountFromLeft * 100,
         perspectiveOriginY: amountFromTop * 100,
         rotateX: (2 * amountFromTop - 1) * getCardRotateDampener(),
         rotateY: -1 * (2 * amountFromLeft - 1) * getCardRotateDampener(),
         spritesheetTranslateX: -getCurrentSpritePositionX(),
         spritesheetTranslateY: -getCurrentSpritePositionY()
      })
   }

   function cardAnimate() {
      setCardAnimateFromTime(performance.now())
      setCardAnimateFromStyle(getCardRenderStyle())

      if (!getCardAnimating()) {
         setCardAnimating(true)
         cardAnimateLoop()
      }
   }

   function cardAnimateLoop() {
      requestAnimationFrame(function(t) {
         var fromStyle = getCardAnimateFromStyle()
         var fromTime = getCardAnimateFromTime()
         var duration = getCardAnimateDuration()
         var currentTime = Math.min(t, fromTime + duration)
         var amountCompleted = (currentTime - fromTime) / duration

         setCardRenderStyle(getCardStyle()
            .minus(fromStyle)
            .times(amountCompleted)
            .plus(fromStyle)
         )
         cardRender()

         if (amountCompleted < 1) {
            cardAnimateLoop()
         } else {
            setCardAnimating(false)
         }
      })
   }

   function cardRender() {
      getCardElementStyle().cssText = getCardRenderStyle().getCssText()
   }

   function cardSetPointer(t) {
      setCardStyle(getCardStyleWithPointer(t))

      if (!getCardAnimating()) {
         setCardRenderStyle(getCardStyle())
         cardRender()
      }
   }

   function cardActivate() {
      setCardElementRect(getCardElement().getBoundingClientRect())
      setCardStyle(getCardStyle().set({translateZ: 1, opacity: 1}))
      cardAnimate()
   }

   function cardDeactivate() {
      setCardStyle(getCardInitialStyle())
      cardAnimate()
   }

   // Listeners

   function cardPointerdown(ev) {
      ev.preventDefault()
      setCardIsPointerdown(true)
      cardActivate()
      cardSetPointer(Pointer.getPointerFromMouseOrPointerEvent(ev))
   }

   function cardPointermove(ev) {
      if (getCardIsPointerdown()) {
         ev.preventDefault()
         cardSetPointer(Pointer.getPointerFromMouseOrPointerEvent(ev))
      }
   }

   function cardPointerup(ev) {
      setCardIsPointerdown(false)
      cardDeactivate()
   }

   getCardElement().addEventListener('touchstart', cardPointerdown)
   getCardElement().addEventListener('mousedown', cardPointerdown)
   window.addEventListener('mousemove', cardPointermove)
   getCardElement().addEventListener('touchmove', cardPointermove)
   getCardElement().addEventListener('touchend', cardPointerup)
   window.addEventListener('mouseup', cardPointerup)

   // Public object

   return {}
}