function Card(el) {

   'use strict'

   {% include_relative submodule/lazy-progressive-enhancement/lazy-progressive-enhancement.min.js %}
   {% include_relative Pointer.js %}
   {% include_relative Style.js %}

   // Variables

   var cardElement = el
   var cardElementImageInactive = getCardElement().querySelector('.card-image-inactive .lazyload')
   var cardElementImageActive = getCardElement().querySelector('.card-image-active .lazyload')
   var cardElementStyleNode = getCardElement().style
   var cardElementRect = null
   var cardInitialStyle = new Style({
      frame: 0,
      stateAnimated: 0,
      pointerX: .5,
      pointerY: .5,
      width: getCardStyleWidth,
      frameTranslateX: getCardStyleFrameTranslateX,
      frameTranslateY: getCardStyleFrameTranslateY,
      state: getCardStyleState
   })
   var cardStyle = getCardInitialStyle()
   var cardRenderStyle = getCardInitialStyle()
   var cardAnimating = false
   var cardAnimateDuration = 250
   var cardAnimateFromStyle = getCardInitialStyle()
   var cardAnimateFromTime = null
   var cardIsPointerdown = false
   var cardPointerdownlongTimeout = 0
   var cardSpritesheetRows = getCardElement().dataset.spritesheetRows
   var cardSpritesheetColumns = getCardElement().dataset.spritesheetColumns
   var cardSpritesheetFrames = getCardElement().dataset.spritesheetFrames

   // Getters and setters

   function getCardElement() { return cardElement }

   function getCardElementImageInactive() { return cardElementImageInactive }

   function getCardElementImageActive() { return cardElementImageActive }

   function getCardElementStyleNode() { return cardElementStyleNode }

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

   function getCardPointerdownlongTimeout() { return cardPointerdownlongTimeout }
   function setCardPointerdownlongTimeout(int) { cardPointerdownlongTimeout = int }

   function getCardSpritesheetRows() { return cardSpritesheetRows }

   function getCardSpritesheetColumns() { return cardSpritesheetColumns }

   function getCardSpritesheetFrames() { return cardSpritesheetFrames }

   function getCardStyleWithPointer(p) {
      var dampenedPointer = p.dampen(getCardElementRect())
      var amountFromLeft = (dampenedPointer.clientX - getCardElementRect().left) / getCardElementRect().width
      var amountFromTop = (dampenedPointer.clientY - getCardElementRect().top) / getCardElementRect().height

      var frame = Math.min(
         Math.max(getCardSpritesheetFrames() * (1 - amountFromTop), 0),
         getCardSpritesheetFrames() - 1
      )

      return getCardStyle().set({
         pointerX: amountFromLeft,
         pointerY: amountFromTop,
         frame: frame
      })
   }

   function getCardStyleWidth(style) {
      return getCardElementRect().width
   }

   function getCardStyleFrameTranslateX(style) {
      return -((Math.round(style.frame) % getCardSpritesheetColumns()) * 100 / getCardSpritesheetColumns())
   }

   function getCardStyleFrameTranslateY(style) {
      return -(Math.floor(Math.round(style.frame) / getCardSpritesheetColumns()) * 100 / getCardSpritesheetRows())
   }

   function getCardStyleState(style) {
      return Math.ceil(style.stateAnimated)
   }

   // Functions

   function cardAnimate() {
      setCardAnimateFromTime(performance.now())
      setCardAnimateFromStyle(getCardRenderStyle())

      if (!getCardAnimating()) {
         setCardAnimating(true)
         cardAnimateLoop()
      }
   }

   function cardAnimateLoop() {
      requestAnimationFrame(function() {
         var fromStyle = getCardAnimateFromStyle()
         var fromTime = getCardAnimateFromTime()
         var duration = getCardAnimateDuration()
         var currentTime = Math.min(performance.now(), fromTime + duration)
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
      getCardElementStyleNode().cssText = getCardRenderStyle().getCssText()
   }

   function cardSetPointer(t) {
      setCardStyle(getCardStyleWithPointer(t))

      if (!getCardAnimating()) {
         setCardRenderStyle(getCardStyle())
         cardRender()
      }
   }

   function cardInitialize() {
      loadMedia(getCardElementImageInactive())
      loadMedia(getCardElementImageActive())
      getCardElement().oncontextmenu = function(ev) {
         return false
      }
   }

   function cardActivate() {
      setCardElementRect(getCardElement().getBoundingClientRect())
      setCardStyle(getCardStyle().set({stateAnimated: 1}))
      cardAnimate()
   }

   function cardDeactivate() {
      setCardStyle(getCardInitialStyle())
      cardAnimate()
   }

   // Listeners

   function cardPointerdown(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      setCardPointerdownlongTimeout(setTimeout(function() {
         ev.preventDefault()
         setCardIsPointerdown(true)
         cardActivate()
         cardSetPointer(Pointer.getPointerFromMouseOrPointerEvent(ev))
      }, 100))
   }

   function cardPointermove(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      if (getCardIsPointerdown()) {
         ev.preventDefault()
         cardSetPointer(Pointer.getPointerFromMouseOrPointerEvent(ev))
      }
   }

   function cardPointerup(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      if (getCardIsPointerdown()) {
         ev.preventDefault()
         setCardIsPointerdown(false)
         cardDeactivate()
      }
   }

   getCardElement().addEventListener('touchstart', cardPointerdown)
   getCardElement().addEventListener('mousedown', cardPointerdown)
   window.addEventListener('mousemove', cardPointermove)
   getCardElement().addEventListener('touchmove', cardPointermove)
   getCardElement().addEventListener('touchend', cardPointerup)
   window.addEventListener('mouseup', cardPointerup)

   // Initialize
   cardInitialize()

   // Public object

   return {}
}