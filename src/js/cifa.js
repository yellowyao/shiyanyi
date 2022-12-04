let i = 0;

//分析获取结果 map为单词种别码 形式为 {关键字：种别码}  str为输入的字符串
// str为输入的字符串
function result(map, str) {
    let result = [];
    let length = str.length
    while (i < length) {
        let c = str.charAt(i);
        if (c === " ") {
            i++;
        } else if (isNum(c)) {
            let num = getNum(str);
            let syn = map["整数"];
            result.push("(" + syn + ",'" + num + "')")
        } else if (isLetter(c)) {
            let IdentifierOrKeywords = getIdentifierOrKeywords(str)
            let syn = map[IdentifierOrKeywords]
            if (syn === undefined) {
                syn = map["标识符"];
            }
            result.push("(" + syn + ",'" + IdentifierOrKeywords + "')")
        } else {
            let syn = map[c]
            if (syn === undefined) {
                syn = map["错误符号"]
            }
            result.push("(" + syn + ",'" + c + "')")
            i++;
        }
    }
    i = 0
    return result
}


//    获取标识符或者关键字
function getIdentifierOrKeywords(str) {
    let getIdentifierOrKeywords = ""
    while (true) {
        if (!isNum(str[i]) && !isLetter(str[i])) {
            return getIdentifierOrKeywords
        }
        getIdentifierOrKeywords = getIdentifierOrKeywords + str[i]
        i++;
        if (i === str.length) {
            break;
        }
    }
    return getIdentifierOrKeywords
}

//获取数字字符串
function getNum(str) {
    let num = ""
    while (true) {
        if (!isNum(str[i])) {
            return num
        }
        num = num + str[i]
        i++;
        if (i === str.length) {
            break;
        }
    }
    return num
}

//    是否数字
function isNum(c) {
    if (c === " ") {
        return false
    }
    let n = Number(c);
    return !isNaN(n);
}

//    是否为字母
function isLetter(c) {
    return /^[a-zA-Z]*$/.test(c);
}


/*function result_yufa(map, str) {
    let result_ = "";
    let length = str.length
    while (i < length) {
        let c = str.charAt(i);
        if (c === " ") {
            i++;
        } else if (isNum(c)) {
            getNum(str);
            result_ = result_ + "i"
        } else if (isLetter(c)) {
            let IdentifierOrKeywords = getIdentifierOrKeywords(str)
            let syn = map[IdentifierOrKeywords]
            if (syn === undefined) {
                syn = map["标识符"];
            }
            result_ = result_ + IdentifierOrKeywords
        } else {
            let syn = map[c]
            if (syn === undefined) {
                syn = map["错误符号"]
                return {flag: false, msg: "错误符号"};
            }
            result_ = result_ + c
            i++;
        }
    }
    i = 0
    return {flag: true, msg: result_};
}*/

//   处理词法分析结果为语法分析所需要的结果  如 155+66; =>i+i;   i代表整数
function result_yufa(map, str) {
    let result_cifa = result(map, str);
    let result_yufa = [];
    //将map 翻转为 {种别码：关键字} 形式
    let map_ = {};
    for (let key in map) {
        map_[map[key]] = key;
    }
    for (let j = 0; j < result_cifa.length; j++) {
        let temp = result_cifa[j].split(",");
        temp[0] = temp[0].substring(1, temp[0].length);
        if (map_[temp[0]] === "整数") {
            result_yufa.push("i");
        } else if (map_[temp[0]] === "错误符号") {
            return {flag: false, msg: "错误符号"};
        } else {
           result_yufa.push(map_[temp[0]]);
        }
    }
    return {flag: true, msg: result_yufa};
}

/*function result_yuyi(map, str) {
    let result_cifa = "";
    let result_input = [];
    let length = str.length
    while (i < length) {
        let c = str.charAt(i);
        if (c === " ") {
            i++;
        } else if (isNum(c)) {
            let num = getNum(str);
            let syn = map["整数"];
            result_cifa = result_cifa + "i"
            result_input.push(num)
        } else if (isLetter(c)) {
            let IdentifierOrKeywords = getIdentifierOrKeywords(str)
            let syn = map[IdentifierOrKeywords]
            if (syn === undefined) {
                syn = map["标识符"];
            }
            result_cifa = result_cifa + IdentifierOrKeywords
            result_input.push(IdentifierOrKeywords)
        } else {
            let syn = map[c]
            if (syn === undefined) {
                syn = map["错误符号"]
                return {flag: false, msg: "错误符号"};
            }
            result_cifa = result_cifa + c
            result_input.push(c)
            i++;
        }
    }
    i = 0
    return {flag: true, msg: {result_cifa: result_cifa, result_input: result_input}};
}*/


//   处理词法分析结果为语义分析所需要的结果   i代表整数
//  result_input 为输入的字符串数组 例如[11,+,22,*,33]
//  result_cifa 为词法分析结果 例如：i+i
function result_yuyi(map, str) {
    let result_cifa = result(map, str);
    let result_yuyi = result_yufa(map, str);
    let result_inputArray = [];
    for (let j = 0; j < result_cifa.length; j++) {
        let temp = result_cifa[j].split(",");
        temp[1] = (temp[1].substring(0, temp[1].length - 1))[1];
        result_inputArray.push(temp[1]);
    }
    if (result_yuyi.flag) {
        return {flag: true, msg: {result_cifa: result_yuyi.msg, result_input: result_inputArray}};
    }else {
        return {flag: false, msg: "错误符号"};
    }
}
export default {
    result,
    result_yufa,
    result_yuyi
}

