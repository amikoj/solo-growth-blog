---
title: "Under the Hood: How bpmn-js Actually Works"
date: 2024-10-20T10:00:00+08:00
draft: false
tags: ["bpmn-js", "diagram-js", "javascript", "architecture", "frontend"]
categories: ["Technical Deep Dive"]
series: ["BPMN.js Mastery"]
description: "A deep dive into the core architecture of bpmn-js. We explore how its module system, event bus, and command stack work together to create a powerful workflow editor."
---

> **Editor's Note:**
> This article is an English rewrite and expansion of my previous notes on the internal principles of bpmn-js. I've added practical code examples to help you understand what's really happening when you drag a box on the screen.

If you've ever used **bpmn-js** to build a workflow editor, you know it feels like magic. You drag a task, it snaps into place, and suddenly you have a valid BPMN 2.0 XML file. But let's be real: that "magic" is actually a very clever piece of engineering.

In this post, we're going to tear down the engine and look at the "Big Three" principles that make bpmn-js tick. By the end, you'll stop guessing and start hacking it like a pro.

## 1. The Separation of Concerns (View vs. Model)

The first thing you need to understand is that bpmn-js isn't just one library. It's a "sandwich" of two major components:

*   **diagram-js**: The "Muscle." It handles the SVG rendering, zooming, and dragging. It doesn't know what a "User Task" is; it only knows about "Shapes" and "Connections."
*   **bpmn-moddle**: The "Brain." It knows everything about the BPMN 2.0 specification. It handles the XML parsing and ensures your data structure is valid.

When you move a task, `diagram-js` updates the position on the screen, and `bpmn-moddle` updates the underlying XML business object.

### Supporting Code: Accessing the Business Object
If you have an element and want to see its "Brain" (the BPMN data), you access its `businessObject`:

```javascript
const elementRegistry = modeler.get('elementRegistry');
const shape = elementRegistry.get('StartEvent_1');

// This is the diagram-js shape (View)
console.log(shape.x, shape.y); 

// This is the bpmn-moddle object (Model)
console.log(shape.businessObject.name); 
console.log(shape.businessObject.$type); // e.g., 'bpmn:StartEvent'
```

## 2. The Nervous System: EventBus

bpmn-js is **obsessively** event-driven. Almost every action—from clicking a button to importing an XML—fires an event on a central `eventBus`. 

This is how the library stays modular. Instead of hardcoding logic everywhere, different modules just listen for specific events.

### Supporting Code: Hooking into the Life Cycle
Want to trigger a validation when a shape is added? Just listen to the `eventBus`:

```javascript
const eventBus = modeler.get('eventBus');

// Priority (1000) ensures we catch it early
eventBus.on('shape.added', 1000, (event) => {
  const { element } = event;
  console.log('A new shape was born:', element.id);
  
  if (element.type === 'bpmn:Task' && !element.businessObject.name) {
    console.warn('Warning: This task has no name!');
  }
});
```

## 3. The Time Machine: CommandStack

Ever wondered how "Undo" (Ctrl+Z) works so smoothly? That's the **CommandStack**. 

In bpmn-js, you should **never** modify the model directly (like `shape.x = 100`). If you do, the system won't know it happened, and "Undo" will break. Instead, you use the `modeling` service, which creates "Commands" that the `commandStack` can track.

### Supporting Code: Playing by the Rules
Here is the **wrong** way and the **right** way to move an element:

```javascript
const modeling = modeler.get('modeling');
const shape = elementRegistry.get('Task_1');

// ❌ WRONG: The UI might update, but Undo/Redo is broken
// shape.x += 50; 

// ✅ RIGHT: This is tracked by the CommandStack
modeling.moveElements([shape], { x: 50, y: 0 });

// Now you can undo it programmatically!
const commandStack = modeler.get('commandStack');
commandStack.undo();
```

## 4. The Glue: Dependency Injection (didi)

How does a module get access to the `eventBus` or `modeling`? It uses a dependency injection container called **didi**. 

Every core component in bpmn-js is a "Service." When you define a custom module, you simply tell `didi` what services you need, and it injects them for you.

### Supporting Code: Creating a Custom Plugin
Here’s how you’d write a simple plugin that logs every click:

```javascript
function MyCustomLoggingPlugin(eventBus) {
  eventBus.on('element.click', (event) => {
    console.log('User clicked on:', event.element.id);
  });
}

// Tell didi to inject 'eventBus'
MyCustomLoggingPlugin.$inject = ['eventBus'];

// Register it with the modeler
const modeler = new BpmnModeler({
  container: '#canvas',
  additionalModules: [
    {
      __init__: ['myLoggingPlugin'],
      myLoggingPlugin: ['type', MyCustomLoggingPlugin]
    }
  ]
});
```

## Conclusion

Understanding bpmn-js isn't about memorizing the API; it's about understanding these patterns:
1.  **View vs. Model**: Shapes are views; `businessObject` is the model.
2.  **EventBus**: If it happened, there’s an event for it.
3.  **CommandStack**: Always use `modeling` to keep "Undo" working.
4.  **didi**: The glue that connects everything.

Once you master these, you're not just a user anymore—you're a contributor. Happy hacking!
