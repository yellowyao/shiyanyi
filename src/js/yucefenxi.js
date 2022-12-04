import cifa from "@/js/cifa";


let chars = [];
let strArray = [];

//预测分析
function yucefenxi_(inputStr, yucebiao) {
    console.log(inputStr)
    strArray = inputStr;
    //开始符号压栈
    chars.push("#")
    chars.push("E")
    let i = 0;
    //开始分析
    while (true) {
        let tempChar = chars.pop()
        let tempStr = strArray[i]
        if (isVt(tempChar)) {
            if (tempChar === tempStr) {
                if (tempChar === "#") {
                    chars = [];
                    strArray = [];
                    return {flag: true, msg: "语法正确"}
                }
                i++
                continue
            } else {
                chars = [];
                strArray = [];
                return {flag: false, msg:tempStr }
            }
        }

        let tempCharNum = synToNum(tempChar)
        let tempStrNum = synToNum(tempStr)
        let temp = yucebiao[tempCharNum][tempStrNum]
        if (temp === "" || temp === undefined) {
            chars = [];
            strArray = [];
            return {flag: false, msg: tempStr}
        } else if (temp === "ε") {
            continue
        } else {
            for (let i = temp.length - 1; i >= 0; i--) {
                let tempChar = temp.charAt(i)
                if (tempChar === "'") {
                    chars.push(temp.charAt(i - 1) + tempChar)
                    i--
                } else if (tempChar === "符") {
                    chars.push(temp.charAt(i - 2) + temp.charAt(i - 1) + tempChar)
                    i -= 2
                } else {
                    chars.push(temp[i])
                }
            }

        }
    }
}

//将符号转换为数字
function synToNum(syn) {
    switch (syn) {
        case "E":
            return 0;
        case "E'":
            return 1;
        case "T":
            return 2;
        case "T'":
            return 3;
        case "F":
            return 4;
        case "(":
            return 0;
        case ")":
            return 1;
        case "+":
            return 2;
        case "-":
            return 3;
        case "*":
            return 4;
        case "/":
            return 5;
        case "标识符":
            return 6;
        case "#":
            return 7;
    }
}

//判断是否为终结符
function isVt(char) {
    return !(char === "E" || char === "E'" || char === "T" || char === "T'" || char === "F");

}

export default {
    yucefenxi_
}
