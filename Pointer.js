function Pointer(x, y) {

   // Variables

   var clientX = x
   var clientY = y

   // Functions

   function clone() {
      return new Pointer(clientX, clientY)
   }

   // Public object

   return {
      clone: clone,
      clientX: clientX,
      clientY: clientY
   }
}

// Static

Pointer.getPointerFromMouseOrTouchEvent = function(ev) {
   var pointer = Pointer.isEventMouseEvent(ev) ? ev : ev.touches[0]
   return new Pointer(pointer.clientX, pointer.clientY)
}

Pointer.isEventMouseEvent = function(ev) {
   return ev instanceof MouseEvent
}

Pointer.dampen = function(pointer, elementRect) {
   var dampenedPointer = pointer.clone()

   function dampenSlope(pointerPosition, edge) {
      var slope = 0.07
      return slope * (pointerPosition - edge) + edge
   }

   if (dampenedPointer.clientY < elementRect.top) {
      dampenedPointer.clientY = dampenSlope(dampenedPointer.clientY, elementRect.top);
   } else if (dampenedPointer.clientY > elementRect.bottom) {
      dampenedPointer.clientY = dampenSlope(dampenedPointer.clientY, elementRect.bottom);
   }

   if (dampenedPointer.clientX < elementRect.left) {
      dampenedPointer.clientX = dampenSlope(dampenedPointer.clientX, elementRect.left);
   } else if (dampenedPointer.clientX > elementRect.right) {
      dampenedPointer.clientX = dampenSlope(dampenedPointer.clientX, elementRect.right);
   }

   return dampenedPointer
}