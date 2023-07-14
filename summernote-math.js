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
                    latexSpan.addEventListener('input', renderMath)

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
                    // mathVirtualKeyboard.layouts = ["numeric", "symbols"];
                    mathVirtualKeyboard.layouts = [
                        {
                            label: "Básico",
                            toolip: "Only the essential",
                            style: ".digit { background: blue; color: white }",
                            rows: [
                                ["[+]", "[-]", "[*]", "[/]", "[=]", "[.]", "[(]", "[)]", "\\sqrt{#0}", "#@^{#?}"],
                                ["[1]", "[2]", "[3]", "[4]", "[5]", "[6]", "[7]", "[8]", "[9]", "[0]"],
                                ["[hr]"], ["[shift]", "[undo]", "[redo]", "[separator]", "[separator]", "[separator]", "[left]", "[right]", 
                                {
                                    label: "[backspace]",
                                    class: "action hide-shift"
                                }, 
                                "[hide-keyboard]"]]
                          }, 
                          "greek"
                        ];
                    mathVirtualKeyboard.visible = true;
                });
            }

            self.hasMath = function (node) {
                return node && $(node).hasClass("note-math")
            }

            self.isOnMath = function (range) {
                const ancestor = $.summernote.dom.ancestor(range.sc, self.hasMath)
                return !!ancestor && ancestor === $.summernote.dom.ancestor(range.ec, self.hasMath)
            }

            self.update = function () {
                // Prevent focusing on editable when invoke('code') is executed
                if (!context.invoke("editor.hasFocus")) {
                    self.hide()
                    return
                }

                const rng = context.invoke("editor.getLastRange")
                if (rng.isCollapsed() && self.isOnMath(rng)) {
                    const node = $.summernote.dom.ancestor(rng.sc, self.hasMath)
                    const latex = $(node).find(".note-latex")

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
                self.$popover.hide()
            }

            self.destroy = function () {
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
                self.$dialog.find(".form-control:first").focus().select()
                self.$dialog.find("label").on("click", function () {
                    $(this).parent().find(".form-control:first").focus()
                })
            }

            self.show = function () {
                let $mathSpan = self.$dialog.find(".note-math-dialog")
                let $latexSpan = self.$dialog.find(".note-latex")
                let { $latexImg, latexString } = self.getSelectedMath()

                if (!latexString) {
                    // reset the dialog input and math
                    $mathSpan.empty();
                    $latexSpan.val("")
                } else {
                    // edit the selected math node
                    // get the hidden LaTeX markup from the selected math node
                    // let hiddenLatex = $selectedMathNode.find(".note-latex").text()
                    $latexSpan.val(latexString)
                }

                let mathInfo = {} // not used

                self.showMathDialog(mathInfo).then(function (mathInfo) {
                    ui.hideDialog(self.$dialog)
                    let $mathNodeClone = $latexSpan.clone() // $mathSpan.clone()
                    
                    // newEl.prepend($mathNodeClone[0])
                    const encodedLatex = encodeURIComponent($latexSpan.val().replaceAll('\\imaginaryI', "i"))
                        .replace(/\(/g, "%28")
                        .replace(/\)/g, "%29") + ".svg"
                    let newEl = $('<img>').attr("src", `https://math.vercel.app?from=${encodedLatex}&originalLatex=${$latexSpan.val()}`)
                    
                    // Add read-only attribute
                    // $mathNodeClone[0].readOnly = true;
                    // $mathNodeClone[0].style = ''
                    // $mathNodeClone[0].value = $latexSpan[0].value
                    // let $latexNode = $("<span>")
                    // $latexNode.addClass("note-latex").css("display", "none").text($latexSpan.val()).appendTo($mathNodeClone)

                    // So we don't pick up the dialog node when selecting math nodes in the editor
                    $mathNodeClone.removeClass("note-math-dialog").addClass("note-math")

                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke("editor.restoreRange")
                    context.invoke("editor.focus")

                    if (latexString === null) context.invoke("editor.insertNode", newEl[0])
                    else {
                        // if we are editing an existing mathNode, just replace the contents:
                        $latexImg[0].replaceWith(newEl[0])
                    }
                })
            }

            self.showMathDialog = function (editorInfo) {
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
                let selection = null
                try {
                    selection = window.getSelection()?.getRangeAt(0)?.endContainer
                } catch (error) {
                    return {$latexImg: null, latexString: null}
                }
                
                if (selection) {
                    let $latexImg = $(selection).find('img')
                    if (!$latexImg[0]) return {$latexImg: null, latexString: null}

                    let src = $latexImg.attr('src')
                    let latexString = src.split('originalLatex=')[1]

                    return {$latexImg, latexString}
                }
            }
        },
    })
})
