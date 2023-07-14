window.FontStyleButton = function (context) {
  var ui = $.summernote.ui;
  var options = $.summernote.options;

  const bold = ui.button({
    className: 'note-btn-bold',
    contents: ui.icon(options.icons.bold),
    click: context.createInvokeHandlerAndUpdateState('editor.bold')
  })
  const italic = ui.button({
    className: 'note-btn-italic',
    contents: ui.icon(options.icons.italic),
    click: context.createInvokeHandlerAndUpdateState('editor.italic')
  })
  const underline = ui.button({
    className: 'note-btn-underline',
    contents: ui.icon(options.icons.underline),
    click: context.createInvokeHandlerAndUpdateState('editor.underline')
  })
  const clear = ui.button({
    contents: ui.icon(options.icons.eraser),
    click: context.createInvokeHandler('editor.removeFormat')
  })

  const superscript = ui.button({
    className: 'note-btn-superscript',
    contents: ui.icon(options.icons.superscript),
    click: context.createInvokeHandlerAndUpdateState('editor.superscript')
  })

  const subscript = ui.button({
    className: 'note-btn-subscript',
    contents: ui.icon(options.icons.subscript),
    click: context.createInvokeHandlerAndUpdateState('editor.subscript')
  });

  // create button
  let button = ui.buttonGroup([
    ui.button({
      className: 'dropdown-toggle',
      contents: ui.dropdownButtonContents(ui.icon(options.icons.font), options),
      tooltip: 'Estilo do texto',
      data: {
        toggle: 'dropdown'
      }
    }),
    ui.dropdown([ui.buttonGroup({
      className: 'note-align',
      children: [bold, italic, underline, superscript, subscript, clear]
    })])
  ])

  return button.render();   // return button as jquery object
}

// window.EditMathButton = function (context) {
//   var ui = $.summernote.ui;
//   var options = $.summernote.options;

//   let button = ui.button({
//     contents: options.math.icon,
//     // container: false,
//     tooltip: 'Editar equação',
//     click: function (e) {
//         // Cursor position must be saved because is lost when popup is opened.
//         context.invoke("editor.saveRange")
//         context.invoke("math.show")
//     },
//   })
//   return button.render()
// }

window.summernoteOptions = {
  inheritPlaceholder: true,
  //essa parte é a api que renderiza a barra do summernote
  toolbar: [
    ['style', ['style', 'fontStyle']],
    ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
    ['table', ['table']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['insert', ['picture', 'math']],
    ["misc", ['undo', 'redo']]
  ],
  styleTags: [
    { title: 'Título', tag: 'h2', value: 'h2' },
    { title: 'Texto', tag: 'p', value: 'p' },
    { title: 'Legenda', tag: 'h6', value: 'h6' }
  ],

  popover: {
    image: [
      ['image', ['resizeHalf', 'resizeQuarter', 'math', 'resizeNone']],
      ['remove', ['removeMedia']]
    ]
  },
  buttons: {
    fontStyle: window.FontStyleButton,
    editMath: window.EditMathButton
  },
  icons: {
    magic: 'note-icon-pencil'
  },
  // Don't let the user clear all the tags (allways be in <p>, <h2> or <h6>)
  callbacks: {
    onChange: function(contents) {
      if (contents.length === 0) {
        $(this).summernote('undo')
      }
      $(this)[0].onchange && $(this)[0].onchange()
    }
  }
}

window.initializeSummernote = function () {
  $(".summernote").summernote(window.summernoteOptions)
}