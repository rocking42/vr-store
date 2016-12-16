// process.argv.forEach(function(val, index) {
//   console.log(index + ':' + val );
// });
// console.log('start');
// // doesn't execute on the first loop but does on the next loop round
// process.nextTick(function() {
//   console.log('nextTick callback');
// });
// console.log('schechuled');
var globalFoo;
var main = [1,2,3,4];
var next = { mine: 42};
exports.setFoo = function(val) {
  globalFoo = val;
};

exports.returnFoo = function() {
  return globalFoo;
};

exports.includeFoo = function() {
  return next;
};

exports.main = next;
exports.thow = main;
