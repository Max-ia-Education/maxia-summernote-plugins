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
      // tooltip: 'Estilo do texto',
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

window.ResizeOneHalfButton = function (context) {
  var ui = $.summernote.ui;
  $editable = context.layoutInfo.editable
  

  const button = ui.button({
    contents: '<span class="note-fontsize-10">150%</span>',
    tooltip: 'Aumentar 50%',
    click: function(...e) {
      const img = $editable.data('target')
      img.style.width = 2 * img.clientWidth + 'px'
      // context.createInvokeHandler('editor.resize', '0.9')()
    }
  })

  return button.render();   // return button as jquery object
}

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
      ['image', ['math', 'resizeFull']],
      ['remove', ['removeMedia']]
    ]
  },
  buttons: {
    fontStyle: window.FontStyleButton,
    editMath: window.EditMathButton,
    resizeOneHalf: window.ResizeOneHalfButton
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