function Style(s) {

   // Variables

   var style = Object.assign({}, {
      perspective: 0,
      translateZ: 0,
      opacity: 0,
      frame: 0,
      pointerX: .5,
      pointerY: .5
   }, s)

   var units = {
      perspective: 'px',
      translateZ: 'px',
      opacity: '',
      frame: '',
      frameTranslateX: '%',
      frameTranslateY: '%',
      opacityCeil: '',
      pointerX: '',
      pointerY: ''
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

      for (var rule in style) {
         value = s.style[rule]
         returnStyle.style[rule] = typeof style[rule] === 'function' ? style[rule] : style[rule] + value
      }

      return returnStyle
   }

   function minus(s) {
      return(plus(s.times(-1)))
   }

   function times(value) {
      var returnStyle = new Style()

      for (var rule in style) {
         returnStyle.style[rule] = typeof style[rule] === 'function' ? style[rule] : style[rule] * value
      }

      return returnStyle
   }

   function getCssText() {
      var cssText = ``
      var value = null
      var unit = null

      for (var rule in style) {
         value = typeof style[rule] === 'function' ? style[rule](style) : style[rule]
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