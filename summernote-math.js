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
                // "summernote.keyup summernote.mouseup summernote.change summernote.scroll": () => {
                //     self.update()
                // },
                "summernote.disable summernote.dialog.shown": () => {
                    self.hide()
                },
            }

            context.memo("button.math", function () {
                let button = ui.button({
                    contents: options.math.icon,
                    container: false,
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
                console.log("🚀 ~ file: summernote-math.js:62 ~ $container:", $container)
                let body = `<div class="form-group">

                    <p>Type <a href="https://khan.github.io/KaTeX/function-support.html" target=_blank">LaTeX markup</a> here:
                    
                    <p>
                        <math-field class="note-latex form-control" style="height: 40px">f(x) = \\sin(x+\\pi)</math-field>
                    </p>
                    <p>Preview: </p>
                    <div style="min-height:20px;"><div class="note-math-dialog"></div>
                    </div>
                    <script>
                    var $mathElement = $('.note-math-dialog'); //responsavel pela div preview
                    var mathSpan = $mathElement;
                    var latexSpan = document.getElementsByClassName('note-latex');
                    

                    if (latexSpan[0]) {
                        let keyBoardToggle = latexSpan[0].shadowRoot.querySelector(".ML__virtual-keyboard-toggle")
                        keyBoardToggle.onclick = function () {
                            let keyBoard = document.querySelector(".ML__keyboard")
                            keyBoard.addEventListener('click', renderMath)
                            keyBoard.style["z-index"] = 1051
                        }
                        
                    } 


                    for(let i=0;i<latexSpan.length;i++){
                        latexSpan[i].addEventListener('keyup', renderMath);
                    }

                    function renderMath(){
                        let oldMath = latexSpan;
                        console.log("🚀 ~ file: summernote-math.js:96 ~ renderMath ~ latexSpan:", latexSpan)
                        mathSpan[0].innerHTML = \`<math-field read-only>\${latexSpan[0].value}</math-field>\`
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

            // self.update = function () {
            //     console.log('update')
            //     // Prevent focusing on editable when invoke('code') is executed
            //     if (!context.invoke("editor.hasFocus")) {
            //         self.hide()
            //         return
            //     }

            //     const rng = context.invoke("editor.getLastRange")
            //     if (rng.isCollapsed() && self.isOnMath(rng)) {
            //         const node = $.summernote.dom.ancestor(rng.sc, self.hasMath)
            //         const latex = $(node).find(".note-latex")

            //         if (latex.text().length !== 0) {
            //             self.$popover.find("button").html(latex.text())
            //             const pos = $.summernote.dom.posFromPlaceholder(node)
            //             self.$popover.css({
            //                 display: "block",
            //                 left: pos.left,
            //                 top: pos.top,
            //             })
            //         } else {
            //             self.hide()
            //         }
            //     } else {
            //         self.hide()
            //     }
            // }

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

                if ($selectedMathNode === null) {
                    // reset the dialog input and math
                    //$mathSpan.empty();
                    $latexSpan.val("")
                } else {
                    // edit the selected math node
                    // get the hidden LaTeX markup from the selected math node
                    let hiddenLatex = $selectedMathNode.find(".note-latex").text()
                    $latexSpan.val(hiddenLatex)
                    katex.render(hiddenLatex, $mathSpan[0])
                }

                let mathInfo = {} // not used

                self.showMathDialog(mathInfo).then(function (mathInfo) {
                    ui.hideDialog(self.$dialog)
                    let $mathNodeClone = $mathSpan.clone()
                    let $latexNode = $("<span>")
                    $latexNode.addClass("note-latex").css("display", "none").text($latexSpan.val()).appendTo($mathNodeClone)

                    // So we don't pick up the dialog node when selecting math nodes in the editor
                    $mathNodeClone.removeClass("note-math-dialog").addClass("note-math")

                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke("editor.restoreRange")
                    context.invoke("editor.focus")

                    if ($selectedMathNode === null) context.invoke("editor.insertNode", $mathNodeClone[0])
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
                let selection = window.getSelection().anchorNode
                console.log("🚀 ~ file: summernote-math.js:263 ~ selection:", selection)
                if (selection) {
                    // get all math nodes
                    let $mathNodes = $(selection).children(".note-math")
                    let $selectedMathNode = null
                    // let $mathNodes = $(".note-math")
                    $mathNodes.each(function () {
                        console.log("Found math node:", this)
                        // grab first math node in the selection (including partial).
                        // if (selection.containsNode(this, true)) {
                        $selectedMathNode = $(this)
                        // selection = $(this)
                        // }
                    })
                    return $selectedMathNode
                }
            }
        },
    })
})
