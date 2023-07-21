// Definição dos layouts do teclado virtual
const baseline = [
  ["[hr]"],
  ["[shift]", "[undo]", "[redo]", "[separator]", "[background-color]", "[foreground-color]", "[left]", "[right]",
    {
      label: "[backspace]",
      class: "action hide-shift"
    }
  ]
]
const basico = {
  label: "Matemática Básica",
  toolip: "Only the essential",
  style: ".digit { background: blue; color: white }",
  rows: [
    [
      {
        latex: "x",
        shift: "n",
        variants: ["y", "z", "t", "r", {
            latex: "f(#?)",
            class: "small"
        }, {
            latex: "g(#?)",
            class: "small"
        }, "x^2", "x^n", "x_n", "x_{n+1}", "x_i", "x_{i+1}"]
      }, 
      {
        latex: "y",
        shift: "z",
        variants: ["i", "j", "p", "k", "a", "u"]
      }, 
      "[separator-5]", "[7]", "[8]", "[9]", "[/]", "[separator-5]", 
      {
        latex: "e",
        shift: "\\ln",
        variants: ["\\exp", "\\times 10^{#?}", "\\ln", "\\log_{10}", "\\log"]
      }, {
    latex: "\\imaginaryI",
    variants: ["\\Re", "\\Im", "\\imaginaryJ", "\\Vert #0 \\Vert"]
      }, {
          latex: "\\pi",
          shift: "\\sin",
          variants: ["\\prod", {
              latex: "\\theta",
              aside: "theta"
          }, {
              latex: "\\rho",
              aside: "rho"
          }, {
              latex: "\\tau",
              aside: "tau"
          }, "\\sin", "\\cos", "\\tan"]
      }
    ], 
    [
      {
        latex: "a",
        shift: "\\alpha",
        variants: ["y", "z", "t", "r", {
            latex: "f(#?)",
            class: "small"
        }, {
            latex: "g(#?)",
            class: "small"
        }, "x^2", "x^n", "x_n", "x_{n+1}", "x_i", "x_{i+1}"]
      }, 
      {
        latex: "b",
        shift: "\\beta",
        variants: ["i", "j", "p", "k", "a", "u"]
      }, 
    "[separator-5]", 
    "[4]", "[5]", "[6]", "[*]", 
    "[separator-5]", 
    {
        latex: "#@^2",
        shift: "#@^3"
    }, {
        latex: "#@^{#0}}",
        class: "hide-shift",
        shift: "#@_{#?}"
    }, {
        class: "hide-shift",
        latex: "\\sqrt{#0}",
        shift: {
            latex: "\\sqrt[#0]{#?}}"
        }
    }], 
    [
      {
      latex: "<",
      shift: "\\leqslant"
    }, 
    {
      latex: ">",
      shift: "\\geqslant"
    },
    "[separator-5]", 
    "[1]", "[2]", "[3]", "[-]", 
    "[separator-5]", 
    {
      latex: "\\log#?",
      class: "hide-shift",
      shift: "\\log_{#?}#?"
    }, 
    {
      latex: "\\cdot"
    }, 
    "#@^{-1}"
  ], 
  [
    {
      latex: "(",
      shift: "["
    }, 
    {
      latex: ")",
      shift: "]"
    }, 
    "[separator-5]", 
    "[0]", "[.]", "[=]", "[+]", 
    "[separator-5]", 
    {label: 'sen', latex: "sen(#0)"}, {label: 'cos', latex: "cos(#0)"}, {label: 'tan', latex: "tan(#0)"}
  ],
    ...baseline
  ]
}
const fisicoquimica = {
  label: "Física/Química",
  toolip: "Utilitário básicos para física e química",
  rows: [
    ['\\mu', '\\rho ', '\\pi', "[separator-5]", "\\sqrt{#0}", '#@^2', '\\overrightarrow{#?}', "[separator-5]", "#@_{#?}", "#@^{#?}", "#@_2"],

    ['\\Delta', '\\theta', '\\omega', 
    "[separator-5]", 
    {label: 'sen', latex: "sen(#0)"}, {label: 'cos', latex: "cos(#0)"}, {label: 'tan', latex: "tan(#0)"}, 
    "[separator-5]", 
    "\\rightarrow","\\rightleftharpoons",  "\\leftarrow"],
                              
    
    ['\\alpha', '\\beta', '\\gamma', "[separator-5]", '[+]', '[-]', '[=]', "[separator-5]", "(s)", "(l)", "(g)"],

    ['\\tau', '\\eta', '\\lambda', 
    "[separator-5]", 
    '[/]', '\\cdot', '\\neq', 
    "[separator-5]", 
    {latex: "^{#?}_{#?}#@^{#?}", aside: 'Isótopo'}, "(#0)", {latex: "[#@]^{#?}", aside: "Íon"}],
    ...baseline
  ]
}
const conjuntos = {
  label: "Conjuntos/Utilitários",
  toolip: "Conjuntos, Lógica e utilitários",
  rows: [
    [
      {
        latex: `
          \\begin{bmatrix}
          #?   &   #? \\\\
          #?   &   #?
          \\end{bmatrix}
        `, 
        label: "Matrizes",
        aside: "Segure para opções",
        width: 2,
        variants: [
          {
            latex: `
              \\begin{bmatrix}
              #?   &   #?
              \\end{bmatrix}
            `, 
            label: "1x2"
          },
          {
            latex: `
              \\begin{bmatrix}
              #?   &   #? \\\\
              #?   &   #?
              \\end{bmatrix}
            `, 
            label: "1x3"
          },
          {
            latex: `
              \\begin{bmatrix}
              #?   \\\\
              #?
              \\end{bmatrix}
            `, 
            label: "2x1"
          },
          {
            latex: `
              \\begin{bmatrix}
              #?   &   #? \\\\
              #?   &   #?
              \\end{bmatrix}
            `, 
            label: "2x2"
          },
          {
            latex: `
              \\begin{bmatrix}
              #? & #? & #?   \\\\
              #? & #? & #?
              \\end{bmatrix}
            `, 
            label: "2x3"
          },
          {
            latex: `
              \\begin{bmatrix}
              #?   \\\\
              #?   \\\\
              #?
              \\end{bmatrix}
            `, 
            label: "3x1"
          },
          {
            latex: `
              \\begin{bmatrix}
              #? & #?   \\\\
              #? & #?    \\\\
              #? & #? 
              \\end{bmatrix}
            `, 
            label: "3x2"
          },
          {
            latex: `
              \\begin{bmatrix}
              #?   &   #? &   #? \\\\
              #?   &   #? &   #? \\\\
              #?   &   #? &   #?
              \\end{bmatrix}
            `, 
            label: "3x3"
          },
        ]
      },
      "[separator-10]", 
      {
        latex: '\\N', 
        label: '<span class="fs-6 one-liner">Conjuntos Numéricos</span>',
        aside: "Segure para opções",
        width: 2,
        variants: [
          {
            latex: '\\N',
            aside: 'Naturais'
          },
          {
            latex: '\\Z',
            aside: 'Inteiros'
          },
          {
            latex: '\\Q',
            aside: 'Racionais'
          },
          {
            latex: '\\R',
            aside: 'Reais'
          },
          {
            latex: '\\C',
            aside: 'Complexos'
          }
        ]
      }, 
      {
        latex: '\\varnothing'
      }, 
      "[separator-10]", 
      {latex: "\\overline{#?}", shift: "\\overleftrightarrow{#?}"}, {latex: "\\angle", shift: '\\measuredangle'}, {latex: "\\triangle", shift: '\\square'}
    ],

    [
      {
        latex: `
          \\begin{gather}
          #? \\\\
          #? 
          \\end{gather}
        `, 
        label: "Multilinhas",
        aside: "Segure para opções",
        width: 2,
        variants: [
          {
            latex: `
              \\begin{gather}
              #? \\\\
              #? 
              \\end{gather}
            `, 
            label: "2",
          },
          {
            latex: `
              \\begin{gather}
              #? \\\\
              #? \\\\
              #? 
              \\end{gather}
            `, 
            label: "3",
          },
          {
            latex: `
              \\begin{gather}
              #? \\\\
              #? \\\\
              #? \\\\
              #? 
              \\end{gather}
            `, 
            label: "4",
          },
          {
            latex: `
              \\begin{gather}
              #? \\\\
              #? \\\\
              #? \\\\
              #? \\\\
              #? 
              \\end{gather}
            `, 
            label: "5",
          }
        ]
      }, 
      "[separator-10]", 
      {latex: "\\in", shift: '\\notin'}, {latex: "\\ni", shift: '\\exists'}, {latex: "\\subset", shift: "\\supset"}, 
      "[separator-10]", 
      "\\theta","\\alpha",  "\\beta"
    ],
        

    [      
      {
        latex: `
          \\begin{cases}
          #? \\\\
          #? 
          \\end{cases}
        `, 
        label: "Sistema",
        aside: "Segure para opções",
        width: 2,
        variants: [
          {
            latex: `
              \\begin{cases}
              #? \\\\
              #? 
              \\end{cases}
            `, 
            label: "2",
          },
          {
            latex: `
              \\begin{cases}
              #? \\\\
              #? \\\\
              #? 
              \\end{cases}
            `, 
            label: "3",
          },
          {
            latex: `
              \\begin{cases}
              #? \\\\
              #? \\\\
              #? \\\\
              #? 
              \\end{cases}
            `, 
            label: "4",
          },
          {
            latex: `
              \\begin{cases}
              #? \\\\
              #? \\\\
              #? \\\\
              #? \\\\
              #? 
              \\end{cases}
            `, 
            label: "5",
          }
        ]
      }, 
      "[separator-10]", 
      {latex: "\\cup", shift: '\\forall'}, {latex: "\\cap", shift: '\\nexists'}, {latex: "\\setminus"}, 
      "[separator-10]", 
      {latex: "\\cong", shift: '\\ncong'}, {latex: "\\sim", shift: '\\nsim'},  {latex: "\\|", shift: '\\perp'}, 
    ],

    ["[separator-20]", 
    "[separator-10]", 
    {latex: "\\Leftarrow", shift: '\\Longleftarrow'}, {latex: '\\Leftrightarrow', shift: "\\iff"}, {latex: "\\Rightarrow", shift: '\\implies'}, 
    "[separator-10]", 
    "#@°", "\\widehat{#@}", "\\overbrace{#@}^{#?}"],

    ...baseline
  ]
}

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
                dialogTitle: "Inserir Equações",
                tooltip: "Inserir Equações",
                pluginTitle: "Equações",
                ok: "Inserir",
                cancel: "Cancelar",
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
            var $editable=context.layoutInfo.editable;
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

            context.memo("button.math", function (actualContext) {
                let button = ui.button({
                    contents: options.math.icon,
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

                let body = `<div class="form-group d-flex justify-content-center align-items-center flex-column">

                    <p class="note-modal-title fs-6 mb-2">Digite a equação aqui:</p>
                    
                    <p class="mb-0" style="min-width:40%">
                        <math-field class="note-latex form-control fs-3"
                        style="width: fit-content;min-width: 250px" />
                    </p>

                    </div>`
                self.$dialog = ui
                    .dialog({
                        title: lang.math.dialogTitle,
                        body: body,
                        footer: '<button class="note-math-btn btn btn-primary note-btn note-btn-primary note-image-btn">' + lang.math.ok + "</button>",
                    })
                    .render()
                    .appendTo($container)
                //ok button
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
                $('math-field').on('focus', e => {
                    mathVirtualKeyboard.layouts = [
                      basico,
                      conjuntos,
                      fisicoquimica
                    ];
                    mathVirtualKeyboard.visible = true;
                    mathVirtualKeyboard.executeCommand('selectAll')
              
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
                    let $mathNodeClone = $latexSpan.clone()
                    
                    const largeLatex = `\\mathup{\\Large{${$latexSpan.val()}}}`
                    const encodedLatex = encodeURIComponent(largeLatex.replaceAll('\\imaginaryI', "i"))
                        .replace(/\(/g, "%28")
                        .replace(/\)/g, "%29") + ".svg"
                        
                    let imgEl = $('<img>').attr("src", `https://math.vercel.app?color=%234c4c4c&from=${encodedLatex}&originalLatex=${$latexSpan.val()}`)
                        .addClass('inline')

                    // So we don't pick up the dialog node when selecting math nodes in the editor
                    $mathNodeClone.removeClass("note-math-dialog").addClass("note-math")

                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke("editor.restoreRange")
                    context.invoke("editor.focus")

                    if (latexString === null) context.invoke("editor.insertNode", imgEl[0])
                    else {
                        // if we are editing an existing mathNode, just replace the contents:
                        $latexImg[0].src = imgEl[0].src
                    }
                })
            }

            self.showMathDialog = function () {
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
                let $latexImg = $($editable.data("target"))

                if (!$latexImg[0]) return { $latexImg: null, latexString: null }

                let src = $latexImg.attr('src')

                if (!src.includes('originalLatex')) return { $latexImg: null, latexString: null }

                let latexString = decodeURIComponent(src.split('originalLatex=')[1])

                return {$latexImg, latexString}
            }
        },
    })
})
