
function executeYuYiFenXi( inputStrArray, actionTable, gotoTable,production_,Semantic_rules) {
    let statusStack = [];//状态栈
    let symbolStack = [];//符号栈
    let valStack = [];//语义栈
    let placeStack = [];//中间代码栈
    let place = 0;//中间代码地址
    let placeTempStack = [];//当前状态
    //步骤存储
    let step = [["步骤", "状态栈", "符号栈", "语义栈", "输入串", "动作"], [1, "0", "#", "-", inputStrArray.join(""), "初始化"]];
    let stepNum = 1;
    statusStack.push(0);
    symbolStack.push("#");
    Semantic_rules.push("-");
    valStack.push("-");
    while (true) {
        let status = parseInt(statusStack.pop());
        let symbol = inputStrArray[0];
        let isNum = parseInt(symbol);
        let tempSymbol = symbol;
        if (!isNaN(isNum)) {
            tempSymbol = "i";
        }
        let symbol_index = actionTable[0].indexOf(tempSymbol);

        let action = actionTable[status + 1][symbol_index];
        if (action === "acc") {
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), valStack.join(""), inputStrArray.join(""), "acc"]);
            step.push(["", "", "", "值为：" + valStack.pop(), "", "分析成功"]);
            break;
        } else if (action.indexOf("s") !== -1) {
            //添加语义分析,移进动作，将占位符压入语义栈
            valStack.push("-");

            //-------------------
            statusStack.push(status);
            statusStack.push(parseInt(action.replace("s", "")));
            symbolStack.push(symbol);
            inputStrArray.shift();
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), valStack.join(""), inputStrArray.join(""), action]);
        } else if (action.indexOf("r") !== -1) {
            let production_number = parseInt(action.replace("r", ""));

            //------------------------
            let production = production_[production_number];
            //产生式通过箭头分割 E->E+T 结果：left=E,right=E+T
            let temp = splitByArrow(production);
            let left = temp.left;
            let right = temp.right;
            let length = right.length;
            //临时存储状态栈
            let tempStatusStack = "";

            //添加语义分析
            //获取对应的语义规则
            let SemanticRule = Semantic_rules[production_number];
            //解析语义规则
            let SemanticRuleArrays = SemanticRule.split(",");
            let SemanticRule_num1 = parseInt(SemanticRuleArrays[0]);
            let SemanticRule_num2 = parseInt(SemanticRuleArrays[2]);
            //存储语义栈中的值
            let valTemp1 = "";
            let valTemp2 = "";

            //弹出状态栈的同时，弹出语义栈的值，并将相对应的值存储到valTemp1和valTemp2中
            for (let i = 0; i < length; i++) {
                tempStatusStack = statusStack.pop();
                let symbol_temp = symbolStack.pop();
                let valTemp = valStack.pop();
                if (i === SemanticRule_num1) {
                    valTemp1 = valTemp;
                }
                if (i === SemanticRule_num2) {
                    valTemp2 = valTemp;

                }
                if (SemanticRule_num1 === -1) {
                    valTemp1 = symbol_temp;
                    valTemp2 = symbol_temp;
                    place++;
                    let placeName = "t" + place;
                    let placeTemp = placeName + ":=" + valTemp1;
                    placeStack.push(placeTemp);
                    placeTempStack.push(placeName);
                }
            }
            //获取语义规则的动作
            let Semantic_action = SemanticRuleArrays[1];
            //根据语义规则的动作，进行相应的操作
            let newVal = actionBySymbol(parseInt(valTemp1), Semantic_action, parseInt(valTemp2));
            //将新的值压入语义栈
            valStack.push(newVal);
            //中间代码
            if (Semantic_action !== "=") {
                let placeTemp1 = placeTempStack.pop();
                let placeTemp2 = placeTempStack.pop();
                place++;
                let placeName = "t" + place;
                let placeTemp = placeName + ":=" + placeTemp2 + Semantic_action + placeTemp1;
                placeStack.push(placeTemp);
                placeTempStack.push(placeName);
            }

            //------------------------

            let goto_index = gotoTable[0].indexOf(left);

            let newStatus = gotoTable[parseInt(tempStatusStack) + 1][goto_index];

            if (newStatus === "") {
                step.push(["", "", "", "", "", "分析失败,出错位置为" + inputStrArray[0]]);
                return {
                    flag: false,
                    step: step,
                    placeStack: placeStack
                }
            }
            statusStack.push(tempStatusStack)
            statusStack.push(newStatus);
            symbolStack.push(left);
            stepNum++;
            step.push([stepNum, statusStack.join(""), symbolStack.join(""), valStack.join(""), inputStrArray.join(""), action]);
        } else {
            step.push(["", "", "", "", "", "分析失败,出错位置为" + inputStrArray[0]]);
            return {
                flag: false,
                step: step,
                placeStack: placeStack
            }
        }
    }
    return {
        flag: true,
        step: step,
        placeStack: placeStack
    };
}
function actionBySymbol(num1, symbol, num2) {
    switch (symbol) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        case "=":
            return num2;
    }
}

//将产生式分割为左右两部分
function splitByArrow(production) {
    let temp = production.split("->");
    let left = temp[0];
    let right = temp[1];
    return {left, right};
}






export default {
    executeYuYiFenXi
}

