# maxia-summernote-plugins
Summernote plugins for [MathLive](https://cortexjs.io/mathlive/), [Cleaner](https://github.com/DiemenDesign/summernote-cleaner) (on steroids for image pasting) and Options (basically just a helper for max.ia usage).


### Usage
1. Summernote imports
```
<!-- Summernote Imports -->
<!-- include libraries(jQuery, bootstrap) -->
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
crossorigin="anonymous"></script>
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>

<!-- KaTeX -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js"></script>
```

2. Include mathlive and KaTex:
```
<!-- KaTeX -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js"></script>

<!-- MathLive -->
<script defer src="//unpkg.com/mathlive"></script>
```

3. Include the plugins you want:
```
<!-- Summernote Plugins -->
<script src="https://cdn.jsdelivr.net/gh/eduardo-maxia/maxia-summernote-plugins@1.0.0/summernote-math.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/eduardo-maxia/maxia-summernote-plugins@1.0.0/summernote-cleaner.js"></script>
<script src="https://cdn.jsdelivr.net/gh/eduardo-maxia/maxia-summernote-plugins@1.0.0/summernote-options.js"></script>
```

3.1 - Mathtype: add `math` to your toolbar somewhere:
```
 $('#summernote').summernote({
     toolbar: [
         ...
         ['insert', ['pitcure', 'link', 'math']],
     ]
 });
```
3.2 - Cleaner: just the include is enough, it will be called automatically.
3.3 - Options: include it so the summernote initialization function is attached to your window object. Call it once the DOM is ready.
*In React you should call it in the `componentDidMount(useEffect)` lifecycle method.*
```
<div class="summernote"></div>

<script>
$('document').ready(() => {
    // Function defined in summernote-options.js that should be called once the node is ready
    window.initializeSummernote();
})
</script>
```
