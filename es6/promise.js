/*
一、 promise概念
promise本质上是一个函数返回的对象，我们可以在这个对象上绑定回调函数，这样就不需要一开始就把回调函数传入了
*/

// 成功的回调函数
function successCallback(result) {
  console.log("音频文件创建成功: " + result);
}
// 失败的回调函数
function failureCallback(error) {
  console.log("音频文件创建失败: " + error);
}
// 传统写法:创建音频文件的函数
function createAudioFile(audioSettings, successCallback, failureCallback) {
  if (audioSettings === "ok") {
    successCallback("success");
  } else {
    failureCallback("failure");
  }
}
createAudioFile("not_ok", successCallback, failureCallback)

// promise写法
const createAudioFileAsync = (audioSettings) => new Promise((resolve, reject) => {
  if (audioSettings === "ok") {
    resolve("async success");
  } else {
    reject("failure");
  }
});
createAudioFileAsync("ok").then(successCallback, failureCallback);


// 多重异步操作，回调地狱
doSomething(function (result) {
  doSomethingElse(result, function (newResult) {
    doThirdThing(newResult, function (finalResult) {
      console.log('Got the final result: ' + finalResult);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);

// 使用Promise链解决
doSomething().then(function (result) {
  return doSomethingElse(result);
}).then(function (newResult) {
  return doThirdThing(newResult);
}).then(function (finalResult) {
  console.log('Got the final result: ' + finalResult);
}).catch(failureCallback); // .catch(failureCallback)相当于 .then(null, failureCallback);

// 也可以用箭头函数简写为
doSomething().then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => {
    console.log(`Got the final result: ${finalResult}`);
  }).catch(failureCallback);

/*
二、 错误处理
通过catch，可以将多次的failureCallback失败回调改善为只在尾部调用一次
*/

new Promise((resolve, reject) => {
  console.log('Initial');
  resolve();
}).then(() => {
  throw new Error('Something failed');
  console.log('Do this');    // 不会输出
}).catch(() => {
  console.error('Do that');
}).then(() => {
  console.log('Do this, no matter what happened before');
});


doSomething()
  .then(result => doSomethingElse(value))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => console.log(`Got the final result: ${finalResult}`))
  .catch(failureCallback);
// 相当于：
try {
  let result = syncDoSomething();
  let newResult = syncDoSomethingElse(result);
  let finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch (error) {
  failureCallback(error);
}
