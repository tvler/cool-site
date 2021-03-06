function Style(s) {

   // Variables

   var style = Object.assign({}, s)

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

      for (var rule in style) {
         value = typeof style[rule] === 'function' ? style[rule](style) : style[rule]
         cssText += `--${rule}: ${value};`
      }

      return cssText
   }

   // Public object

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