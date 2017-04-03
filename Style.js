function Style(s) {

   // Variables

   var style = Object.assign({}, {
      perspectiveOriginX: 0,
      perspectiveOriginY: 0,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      opacity: 0,
      spritesheetTranslateX: 0,
      spritesheetTranslateY: 0
   }, s)

   var units = {
      perspectiveOriginX: '%',
      perspectiveOriginY: '%',
      rotateX: 'deg',
      rotateY: 'deg',
      translateZ: 'px',
      opacity: '',
      spritesheetTranslateX: '%',
      spritesheetTranslateY: '%'
   }

   // Functions

   function clone() {
      return new Style(style)
   }

   function set(s) {
      return new Style(Object.assign({}, style, s))
   }

   function plus(s) {
      var value = null
      var returnStyle = new Style()

      for (rule in style) {
         value = s.style[rule]
         returnStyle.style[rule] = style[rule] + value
      }

      return returnStyle
   }

   function minus(s) {
      return(plus(s.times(-1)))
   }

   function times(value) {
      var returnStyle = new Style()

      for (rule in style) {
         returnStyle.style[rule] = style[rule] * value
      }

      return returnStyle
   }

   function getCssText() {
      var cssText = ``
      var value = null
      var unit = null

      for (rule in style) {
         value = style[rule]
         unit = units[rule]
         cssText += `--${rule}: ${value}${unit};`
      }

      return cssText
   }

   return {
      style: style,
      clone: clone,
      set: set,
      plus: plus,
      minus: minus,
      times: times,
      getCssText: getCssText
   }
}