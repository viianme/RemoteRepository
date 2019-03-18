
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (InputMethodTool == null) var InputMethodTool = {};
//InputMethodTool._path = '/WebIme/webime_dwr';
InputMethodTool._path = dwr.engine._defaultPath;
InputMethodTool.getInputMethodInfo = function(callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'getInputMethodInfo', callback);
}
InputMethodTool.getInputMethods = function(callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'getInputMethods', callback);
}
InputMethodTool.getInputMethod = function(p0, callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'getInputMethod', p0, callback);
}
InputMethodTool.getPageCodeMap = function(callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'getPageCodeMap', callback);
}
InputMethodTool.subset = function(p0, p1, callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'subset', p0, p1, callback);
}
InputMethodTool.match = function(p0, p1, p2, p3, p4, callback) {
  dwr.engine._execute(InputMethodTool._path, 'InputMethodTool', 'match', p0, p1, p2, p3, p4, callback);
}
