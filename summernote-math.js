;(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory)
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"))
    } else {
        factory(window.jQuery)
    }
})(function ($) {
    $.extend(true, $.summernote.lang, {
        "en-US": {
            /* English */
            math: {
                dialogTitle: "Insert Math",
                tooltip: "Insert Math",
                pluginTitle: "Insert math",
                ok: "Insert",
                cancel: "Cancel",
            },
        },
    })
    $.extend($.summernote.options, {
        math: {
            icon: "<b>&sum;</b>",
        },
    })
    $.extend($.summernote.plugins, {
        math: function (context) {
            var self = this
            var ui = $.summernote.ui
            //var $note=context.layoutInfo.note;
            var $editor = context.layoutInfo.editor
            //var $editable=context.layoutInfo.editable;
            var options = context.options
            var lang = options.langInfo

            self.events = {
                "summernote.keyup summernote.mouseup summernote.change summernote.scroll": () => {
                    self.update()
                },
                "summernote.disable summernote.dialog.shown": () => {
                    self.hide()
                },
            }

            context.memo("button.math", function () {
                let button = ui.button({
                    contents: options.math.icon,
                    // container: false,
                    tooltip: lang.math.tooltip,
                    click: function (e) {
                        // Cursor position must be saved because is lost when popup is opened.
                        context.invoke("editor.saveRange")
                        context.invoke("math.show")
                    },
                })
                return button.render()
            })

            self.initialize = function () {
                let $container = options.dialogsInBody ? $(document.body) : $editor

                let body = `<div class="form-group">

                    <p>Type <a href="https://khan.github.io/KaTeX/function-support.html" target=_blank">LaTeX markup</a> here:
                    
                    <p style="width:100%">
                        <math-field class="note-latex form-control" style="height: 40px;width:100%">f(x) = \\sin(x+\\pi)</math-field>
                    </p>
                    <p>Preview: </p>
                    <div style="min-height:20px;"><span class="note-math-dialog"></span>
                    </div>
                    <script>
                    var $mathElement = $('.note-math-dialog'); //responsavel pela div preview
                    var mathSpan = $mathElement;
                    var latexSpan = document.getElementsByClassName('note-latex')[0];
                    latexSpan.addEventListener('keyup', renderMath);

                    function renderMath(){
                        let oldMath = latexSpan;
                        let latexString = katex.renderToString(latexSpan.value)
                        mathSpan[0].innerHTML = latexString
                    }

                    </script>

                    </div>`
                self.$dialog = ui
                    .dialog({
                        title: lang.math.dialogTitle,
                        body: body,
                        footer: '<button class="btn btn-primary note-math-btn">' + lang.math.ok + "</button>",
                    })
                    .render()
                    .appendTo($container)
                //ok

                self.$popover = ui
                    .popover({
                        className: "note-math-popover",
                    })
                    .render()
                    .appendTo(options.container)
                const $content = self.$popover.find(".popover-content,.note-popover-content")
                context.invoke("buttons.build", $content, ["math"])

                                
                // Math virtual keyboard personalization
                document.body.style.setProperty("--keyboard-zindex", "1051");
                document.querySelector('math-field').addEventListener('focus', () => {
                    mathVirtualKeyboard.visible = true;
                });
            }

            self.hasMath = function (node) {
                console.log("hasMath")
                return node && $(node).hasClass("note-math")
            }

            self.isOnMath = function (range) {
                console.log("isOnMath")
                const ancestor = $.summernote.dom.ancestor(range.sc, self.hasMath)
                return !!ancestor && ancestor === $.summernote.dom.ancestor(range.ec, self.hasMath)
            }

            self.update = function () {
                console.log('update')
                // Prevent focusing on editable when invoke('code') is executed
                if (!context.invoke("editor.hasFocus")) {
                    self.hide()
                    return
                }

                const rng = context.invoke("editor.getLastRange")
                if (rng.isCollapsed() && self.isOnMath(rng)) {
                    const node = $.summernote.dom.ancestor(rng.sc, self.hasMath)
                    const latex = $(node).find(".note-latex")
                    console.log("🚀 ~ file: summernote-math.js:138 ~ latex:", latex)

                    if (latex.text().length !== 0) {
                        self.$popover.find("button").html(latex.text())
                        const pos = $.summernote.dom.posFromPlaceholder(node)
                        self.$popover.css({
                            display: "block",
                            left: pos.left,
                            top: pos.top,
                        })
                    } else {
                        self.hide()
                    }
                } else {
                    self.hide()
                }
            }

            self.hide = function () {
                console.log("hide")
                self.$popover.hide()
            }

            self.destroy = function () {
                console.log("destroy")
                ui.hideDialog(this.$dialog)
                self.$dialog.remove()
                self.$popover.remove()
            }

            self.bindEnterKey = function ($input, $btn) {
                $input.on("keypress", function (event) {
                    if (event.keyCode === 13) $btn.trigger("click")
                })
            }

            self.bindLabels = function () {
                console.log("bindLabels")
                self.$dialog.find(".form-control:first").focus().select()
                self.$dialog.find("label").on("click", function () {
                    $(this).parent().find(".form-control:first").focus()
                })
            }

            self.show = function () {
                console.log("show")
                let $mathSpan = self.$dialog.find(".note-math-dialog")
                console.log("🚀 ~ file: summernote-math.js:196 ~ $mathSpan:", $mathSpan)
                let $latexSpan = self.$dialog.find(".note-latex")
                console.log("🚀 ~ file: summernote-math.js:198 ~ $latexSpan:", $latexSpan)
                let $selectedMathNode = self.getSelectedMath()
                console.log("🚀 ~ file: summernote-math.js:200 ~ $selectedMathNode:", $selectedMathNode)

                if (!$selectedMathNode) {
                    // reset the dialog input and math
                    $mathSpan.empty();
                    $latexSpan.val("")
                } else {
                    // edit the selected math node
                    // get the hidden LaTeX markup from the selected math node
                    let hiddenLatex = $selectedMathNode.find(".note-latex").text()
                    $latexSpan.val(hiddenLatex)
                }

                let mathInfo = {} // not used

                self.showMathDialog(mathInfo).then(function (mathInfo) {
                    console.log("Insert the text")
                    ui.hideDialog(self.$dialog)
                    let $mathNodeClone = $latexSpan.clone() // $mathSpan.clone()
                    let newEl = $('<div>')
                    newEl.prepend($mathNodeClone[0])
                    console.log("🚀 ~ file: summernote-math.js:209 ~ newEl:", newEl)


                    // Add read-only attribute
                    $mathNodeClone[0].readOnly = true;
                    $mathNodeClone[0].style = ''
                    $mathNodeClone[0].value = $latexSpan[0].value
                    console.log("🚀 ~ file: summernote-math.js:207 ~ $mathSpan:", $mathSpan)
                    console.log("🚀 ~ file: summernote-math.js:207 ~ $mathNodeClone:", $mathNodeClone)
                    let $latexNode = $("<span>")
                    $latexNode.addClass("note-latex").css("display", "none").text($latexSpan.val()).appendTo($mathNodeClone)

                    // So we don't pick up the dialog node when selecting math nodes in the editor
                    $mathNodeClone.removeClass("note-math-dialog").addClass("note-math")

                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke("editor.restoreRange")
                    context.invoke("editor.focus")

                    console.log("🚀 ~ file: summernote-math.js:218 ~ $mathNodeClone:", $mathNodeClone)
                    if ($selectedMathNode === null) context.invoke("editor.insertNode", $('div'))
                    else {
                        // if we are editing an existing mathNode, just replace the contents:
                        if ($.trim($latexNode.html()) == "") {
                            // unless there's nothing there, then delete the node
                            $selectedMathNode.remove()
                        } else {
                            $selectedMathNode.html($mathNodeClone.html())
                        }
                    }
                })
            }

            self.showMathDialog = function (editorInfo) {
                console.log("showMathDialog")
                return $.Deferred(function (deferred) {
                    let $editBtn = self.$dialog.find(".note-math-btn")
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent("dialog.shown")
                        $editBtn.click(function (e) {
                            e.preventDefault()
                            deferred.resolve({})
                        })
                        self.bindEnterKey($editBtn)
                        self.bindLabels()
                    })
                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off("click")
                        if (deferred.state() === "pending") deferred.reject()
                    })
                    ui.showDialog(self.$dialog)
                })
            }

            self.getSelectedMath = function () {
                console.log("getSelectedMath")
                let selection = window.getSelection().getRangeAt(0).endContainer
                // console.log("🚀 ~ file: summernote-math.js:263 ~ selection:", selection)
                if (selection) {
                    let selectedMathNode = null
                    
                    if (selection.className == "note-math") {
                        selectedMathNode = selection
                    } else {
                        // Verify if selection is child of any .note-math
                        let $mathParent = $(selection).parents(".note-math")
                        if ($mathParent.length > 0) {
                            selectedMathNode = $mathParent[0]
                        }
                    }
                    console.log("🚀 ~ file: summernote-math.js:256 ~ selectedMathNode:", selectedMathNode)
                    // // get all math nodes
                    // let $mathNodes = $(selection).children(".note-math")
                    // // let $mathNodes = $(".note-math")
                    // $mathNodes.each(function () {
                    //     console.log("Found math node:", this)
                    //     // grab first math node in the selection (including partial).
                    //     // if (selection.containsNode(this, true)) {
                    //     selectedMathNode = $(this)
                    //     // selection = $(this)
                    //     // }
                    // })
                    return selectedMathNode ? $(selectedMathNode) : null
                }
            }
        },
    })
})
