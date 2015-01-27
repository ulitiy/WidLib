# Отдельный файл-компилятор для ноды
# отдельный файл-компилятор для браузера
# СМ. Q

root=@
if typeof exports != 'undefined'
  if typeof module != 'undefined' && module.exports
    `exports = module.exports = Widlib`
  # exports.Widlib = Widlib
else
  root.Widlib = Widlib
if window?
  window.Widlib = Widlib # make standalone in browserify
  window._ = _
  window.Q = Q
