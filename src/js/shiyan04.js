function executeFenXi(inputStr, actionTable, gotoTable, production_) {

    let statusStack = [];//状态栈
    let symbolStack = [];//符号栈
    //步骤存储
    let step = [["步骤", "状态栈", "符号栈", "输入串", "动作"], [1, "0", "#", inputStr, "初始化"]];
    //初始化
    let stepNum = 1;
    statusStack.push(0);
    symbolStack.push("#");
    while (true) {
        //拿出栈顶状态 和 输入串的第一个字符
        let status = parseInt(statusStack.pop());
        let symbol = inputStr[0];
        //根据状态和输入串的第一个字符 查动作表
        let symbol_index = actionTable[0].indexOf(symbol);
        //如果查不到获取到的动作
        let action = actionTable[status + 1][symbol_index];
        if (action === "acc") {
            console.log("分析成功");
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), inputStr, "acc"]);
            break;
        } else if (action.indexOf("s") !== -1) {
            //移进
            statusStack.push(status);
            statusStack.push(parseInt(action.replace("s", "")));
            symbolStack.push(symbol);
            inputStr.shift();
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), inputStr, action]);
        } else if (action.indexOf("r") !== -1) {
            //归约 拿到产生式
            let production = production_[parseInt(action.replace("r", ""))];
            //产生式通过箭头分割
            let temp = splitByArrow(production);
            //左部
            let left = temp.left;
            //右部
            let right = temp.right;
            //右部长度
            let length = right.length;
            let tempStatusStack = "";
            //弹出状态栈和符号栈
            for (let i = 0; i < length; i++) {
                //存储最后弹出的状态
                tempStatusStack = statusStack.pop();
                symbolStack.pop();
            }
            //根据最后弹出的状态和左部查goto表
            let goto_index = gotoTable[0].indexOf(left);
            //获取到的状态
            let newStatus = gotoTable[parseInt(tempStatusStack) + 1][goto_index];
            //将新状态压入状态栈
            statusStack.push(tempStatusStack)
            statusStack.push(newStatus);
            symbolStack.push(left);
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), inputStr, action]);
        } else {
            console.log("分析失败");
            return {
                flag: false,
                step: step,
                msg: symbolStack.pop()
            }
        }
    }
    return {
        flag: true,
        step: step
    };
}

//将产生式分割为左右两部分
function splitByArrow(production) {
    let temp = production.split("->");
    let left = temp[0];
    let right = temp[1];
    return {left, right};
}

export default {
    executeFenXi
}

