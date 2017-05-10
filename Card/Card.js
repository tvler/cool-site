function Card(el) {

   'use strict'

   {% include_relative submodule/lazy-progressive-enhancement/lazy-progressive-enhancement.min.js %}
   {% include_relative Card/Pointer.js %}
   {% include_relative Card/Style.js %}

   // Variables

   var cardElement = el
   var cardElementImageInactive = getCardElement().querySelector('.card-image-inactive .lazyload')
   var cardElementImageActive = getCardElement().querySelector('.card-image-active .lazyload')
   var cardElementStyleNode = getCardElement().style
   var cardElementRect = null
   var cardInitialStyle = new Style({
      frame: 0,
      state: 0,
      pointerX: .5,
      pointerY: .5,
      width: getCardStyleWidth,
      frameTranslateX: getCardStyleFrameTranslateX,
      frameTranslateY: getCardStyleFrameTranslateY,
   })
   var cardStyle = getCardInitialStyle()
   var cardRenderStyle = getCardInitialStyle()
   var cardPointer = new Pointer(0, 0)
   var cardIsPointerdown = false
   var cardRequestActivatePromise = null
   var cardIsActive = false
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

   function getCardPointer() { return cardPointer }
   function setCardPointer(pointer) { cardPointer = pointer }

   function getCardIsPointerdown() { return cardIsPointerdown }
   function setCardIsPointerdown(boolean) { cardIsPointerdown = boolean }

   function getCardRequestActivatePromise() { return cardRequestActivatePromise }
   function setCardRequestActivatePromise(promise) { cardRequestActivatePromise = promise }

   function getCardIsActive() { return cardIsActive }
   function setCardIsActive(boolean) { cardIsActive = boolean }

   function getCardPointerdownlongTimeout() { return cardPointerdownlongTimeout }
   function setCardPointerdownlongTimeout(int) { cardPointerdownlongTimeout = int }

   function getCardSpritesheetRows() { return cardSpritesheetRows }

   function getCardSpritesheetColumns() { return cardSpritesheetColumns }

   function getCardSpritesheetFrames() { return cardSpritesheetFrames }

   function getCardStyleWithPointer(p) {
      var dampenedPointer = Pointer.dampen(p, getCardElementRect())
      var amountFromLeft = (dampenedPointer.clientX - getCardElementRect().left) / getCardElementRect().width
      var amountFromTop = (dampenedPointer.clientY - getCardElementRect().top) / getCardElementRect().height

      var frame = Math.min(
         Math.max(getCardSpritesheetFrames() * (1 - amountFromTop), 0),
         getCardSpritesheetFrames() - 1
      )

      return getCardStyle().set({
         state: 1,
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

   // Functions

   function cardInitialize() {
      loadMedia(getCardElementImageInactive())
      getCardElement().oncontextmenu = function(ev) { return false }
      getCardElement().addEventListener('touchstart', cardPointerdown)
      getCardElement().addEventListener('mousedown', cardPointerdown)
      window.addEventListener('mousemove', cardPointermove)
      getCardElement().addEventListener('touchmove', cardPointermove)
      getCardElement().addEventListener('touchend', cardPointerup)
      getCardElement().addEventListener('mouseenter', cardMouseEnter)
      window.addEventListener('mouseup', cardPointerup)
   }

   function cardRequestActivate() {
      if (getCardRequestActivatePromise() === null) {
         setCardRequestActivatePromise(new Promise(function(resolve) {
            loadMedia(getCardElementImageActive(), resolve)
         }))
      }

      cardHintActivate()

      return getCardRequestActivatePromise()
   }

   function cardHintActivate() {
      document.querySelectorAll('.card-container-hint-active').forEach(function(hintedCardElement) {
         if (hintedCardElement !== getCardElement()) {
            hintedCardElement.classList.remove('card-container-hint-active')
         }
      })

      getCardElement().classList.add('card-container-hint-active')
   }

   function cardActivate() {
      if (!getCardIsActive()) {
         setCardIsActive(true)
         Card.isAnyCardActive = true

         requestAnimationFrame(function() {
            getCardElement().classList.add('card-container-active')

            requestAnimationFrame(function() {
               document.body.offsetWidth

               requestAnimationFrame(function() {
                  setCardElementRect(getCardElement().getBoundingClientRect())
                  requestCardAnimationFrame()
               })
            })
         })
      }
   }

   function cardDeactivate() {
      setCardIsActive(false)
      Card.isAnyCardActive = false
      getCardElement().classList.remove('card-container-active')
   }

   function requestCardAnimationFrame() {
      requestAnimationFrame(cardAnimate)
   }

   function cardAnimate() {
      var style = getCardIsPointerdown() ?
       getCardStyleWithPointer(getCardPointer()) : getCardInitialStyle()

      setCardStyle(style)

      var state = getCardStyle().style.state
      var renderState = getCardRenderStyle().style.state
      var deltaState = state - renderState
      var direction = deltaState === 0 ? 0 : deltaState / Math.abs(deltaState)
      var newRenderState = Math.min(
         Math.max(renderState + direction / Card.default.ANIMATION_FRAMES, 0),
         1
      )

      setCardRenderStyle(getCardStyleWithPointer(getCardPointer())
         .minus(getCardInitialStyle())
         .times(newRenderState)
         .plus(getCardInitialStyle())
      )
      cardRender()

      if (newRenderState === 0) {
         cardDeactivate()
      } else {
         requestCardAnimationFrame()
      }
   }

   function cardRender() {
      getCardElementStyleNode().cssText = getCardRenderStyle().getCssText()
   }

   // Listeners

   function cardPointerdown(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      if (Pointer.isEventMouseEvent(ev)) {
         ev.preventDefault()
      }

      cardRequestActivate()
      setCardPointer(Pointer.getPointerFromMouseOrTouchEvent(ev))

      setCardPointerdownlongTimeout(setTimeout(function() {
         ev.preventDefault()

         setCardIsPointerdown(true)
         cardRequestActivate().then(cardActivate)
      }, Card.default.POINTER_DOWN_LONG_DURATION))
   }

   function cardPointermove(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      if (getCardIsPointerdown()) {
         ev.preventDefault()

         setCardPointer(Pointer.getPointerFromMouseOrTouchEvent(ev))
      }
   }

   function cardPointerup(ev) {
      clearTimeout(getCardPointerdownlongTimeout())

      if (getCardIsPointerdown()) {
         ev.preventDefault()

         setCardIsPointerdown(false)
      }
   }

   function cardMouseEnter(ev) {
      if (!Card.isAnyCardActive) {
         cardRequestActivate()
      }
   }

   // Initialize

   cardInitialize()

   // Public object

   return {}
}

Card.default = {
   POINTER_DOWN_LONG_DURATION: 75,
   ANIMATION_FRAMES: 10
}

Card.isAnyCardActive = false