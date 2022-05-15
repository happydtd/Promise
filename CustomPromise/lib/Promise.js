(function (window){
    // Promise constructor
    function Promise(excutor){
        this,status = 'pending' //给promise对象指定status属性，初始值为pending
        this.data = undefined   //给promise对象指定一个用于存储结果数据的属性
        this.callback = []  //每个元素的结构：{onResolved（）{}， onRejected（）{}}

        function resolve(value){
            //如果当前状态不是pending，直接结束
            if(this.status!=='pending')
                return
            //将状态改为resolved
            this.status = 'resolved'
            //保存value数据
            this.data = value

            //如果有待执行callback函数，立即异步执行回调onResolved
            if (this.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行所有成功的回调
                    this.callbacks.forEach(callbacksobj=>{
                        callbacksobj.onResolved(value)
                    })
                })
            }
        }

        function reject(reason){
            //如果当前状态不是pending，直接结束
            if(this.status!=='pending')
                return
            //将状态改为rejected
            this.status = 'rejected'
            //保存value数据
            this.data = reason

            //如果有待执行callback函数，立即异步执行回调onReject
            if (this.callbacks.length>0){
                setTimeout(()=>{ //放入队列中执行所有成功的回调
                    this.callbacks.forEach(callbacksobj=>{
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

    }

    // promise prototype function .catch()
    //指定失败的回调函数
    //返回一个新的promise对象
    Promise.prototype.catch = function (onRejected){

    }

    //promise function .resolve()
    //返回一个指定结果的成功的promise对象
    Promise.resolve = function (value){

    }

    //promise function .reject()
   //返回一个指定reason的失败的promise对象
    Promise.reject = function (reason){
    
    }

    //promise function .all()
    //返回一个promise对象，只有当所有promise都成功时才成功，否则只要有一个失败就失败
    Promise.all = function (promises){
        
    }

    //promise function .all()
    //返回一个promise对象，结果由第一个完成的promise决定
    Promise.race = function (promises){
    
    }

    window.Promise = Promise
})(window)