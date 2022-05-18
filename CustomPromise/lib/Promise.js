(function (window){
    const PENDING = 'pending'
    const RESOLVED = 'resolved'
    const REJECTED = 'rejected'
    // Promise constructor
    function Promise(excutor){
        console.log('create new promise object')
        // 将当前的promise对象保存起来
        const self = this
        self.status = PENDING //给promise对象指定status属性，初始值为pending
        self.data = undefined   //给promise对象指定一个用于存储结果数据的属性
        self.callbacks = []  //每个元素的结构：{onResolved（）{}， onRejected（）{}}

        function resolve(value){
            console.log('call resolve')
            //如果当前状态不是pending，直接结束
            if(self.status!==PENDING)
                return
            //将状态改为resolved
            self.status = RESOLVED
            //保存value数据
            self.data = value

            //如果有待执行callback函数，立即异步执行回调onResolved
            if (self.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行所有成功的回调
                    self.callbacks.forEach(callbacksobj=>{
                        callbacksobj.onResolved(value)
                    })
                })
            }
        }

        function reject(reason){
            console.log('call reject')
            //如果当前状态不是pending，直接结束
            if(self.status!==PENDING)
                return
            //将状态改为rejected
            self.status = REJECTED
            //保存value数据
            self.data = reason

            //如果有待执行callback函数，立即异步执行回调onReject
            if (self.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行所有成功的回调
                    self.callbacks.forEach(callbacksobj=>{
                        callbacksobj.onRejected(reason)
                    })
                })
            }
        }

        try{

            //立即同步执行执行器函数
            excutor(resolve, reject)
        }
        catch(error){
            reject(error) //如果执行器抛异常，promise对象变成rejected
        }

    }

    // promise prototype function .then()
    //指定成功和失败的回调函数
    //返回一个新的promise对象
    Promise.prototype.then = function (onResolved, onRejected){

        //指定默认的失败的回调（实现错误、异常穿透的关键点）,必须是函数
        onResolved = typeof onResolved==='function'? onResolved: value=>value
        onRejected = typeof onRejected==='function'? onRejected: reason=>{throw reason} 
        const self = this
        
        return new Promise((resolve, reject)=>{

            //调用指定回调函数处理
            function handle(callback){
                try{
                    const result = callback(self.data) 
                    if (result instanceof Promise){
                        // 如果回调函数返回是promise，return的promise结果就是这个promise的结果
                        // result.then(
                        //     value=>{resolve(value)}, //当result成功时，让return的promise也成功
                        //     reason=>{reject(reason)} //当result失败时，让return的promise也失败
                        // )
                        result.then(resolve, reject)//上面版本的简洁写法
                    }else{
                        // 如果回调函数返回不是promise，return的promise就会成功，value就是返回的值
                        resolve(result)
                    }
                }
                catch(error){
                    // 如果抛出异常，return的promise就会失败，reason就是error
                    reject(error)
                }
            }

            if (self.status === PENDING){
                // 写入两个方法，同时修改status
                console.log('push functions')
                self.callbacks.push({
                    onResolved(value){ 
                        handle(onResolved);
                    },
                    onRejected(reason){ 
                        handle(onRejected);
                    },
                })
            } else if (self.status === RESOLVED){
                setTimeout(() => {
                    handle(onResolved);
                });
            } else {
                setTimeout(() => {
                    handle(onRejected);
                });
            }
        })
    }

    // promise prototype function .catch()
    //指定失败的回调函数
    //返回一个新的promise对象
    Promise.prototype.catch = function (onRejected){
        return this.then(undefined, onRejected);
    }

    //promise function .resolve()
    //返回一个指定结果的成功的promise对象
    Promise.resolve = function (value){
        //返回一个成功/失败的promise对象
        return new Promise((resolve, reject)=>{
            //value是promise
             if(value instanceof Promise){
                value.then(resolve, reject)
             }else{
                resolve(value) //value不是promise
             }
            
        })
    }

    //promise function .reject()
   //返回一个指定reason的失败的promise对象
    Promise.reject = function (reason){
        return new Promise((resolve, reject)=>{
            reject(reason) 
        })
    }

    //promise function .all()
    //返回一个promise对象，只有当所有promise都成功时才成功，否则只要有一个失败就失败
    Promise.all = function (promises){
        // 用来保存所有成功value的数组
        const values = new Array(promises.length)
        // 用来保存成功promise的数量
        let resolvedCount = 0;

        return new Promise((resolve, reject)=>{
            promises.forEach((p, index)=>{
                //如果p不是promise，就把它包装为promise， Promise.resolve(p)
                Promise.resolve(p).then(
                    value=>{
                        resolvedCount ++
                        //values.push(value)， 不可以用因为promise的执行速度不同会导致结果秩序不对
                        values[index] = value
                        if (resolvedCount === promises.length){
                            resolve(values)
                        }
                    },
                    reason=>{
                        reject(reason)
                    })
            })
        })
    }

    //promise function .all()
    //返回一个promise对象，结果由第一个完成的promise决定
    Promise.race = function (promises){
        return new Promise((resolve, reject)=>{
            promises.forEach((p, index)=>{
                //如果p不是promise，就把它包装为promise， Promise.resolve(p)
                Promise.resolve(p).then(
                    value=>{
                        resolve(value)
                    },
                    reason=>{
                        reject(reason)
                    })
            })
        })
    }

    //返回一个promise对象，它在指定的时间后才确定结果
    Promise.resolveDelay = function (value, time){
        //返回一个成功/失败的promise对象
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
              //value是promise
             if(value instanceof Promise){
                value.then(resolve, reject)
             }else{
                resolve(value) //value不是promise
             }
            }, time);
            
        })
    }

    //返回一个promise对象，它在指定的时间后才失败
    Promise.rejectDelay = function (reason, time){
        return new Promise((resolve, reject)=>{
            setTimeout(() => {
                reject(reason) 
            }, time);
        })
    }


    window.Promise = Promise
})(window)