import cifa from "@/js/cifa";

let char;
let result=[];
let i = 0;

//语法分析
function main(str) {
    console.log(str)
/*    let map_cifa={};
    for (let i=0;i<data.length;i++){
        let datum = data[i];
        let c = datum["c"];
        let syn = datum["syn"];
        map_cifa[c]=syn
    }

    //转换词法分析的结果
    let result_CiFa = cifa.result(map_cifa,str);
    let map_yufa={};
    for (let i=0;i<data.length;i++){
        let datum = data[i];
        let syn = datum["syn"];
        let c = datum["c"];
        map_yufa[syn]=c
    }

    result.length = result_CiFa.length;
    for (let i = 0; i < result_CiFa.length; i++) {
        let resultElement = result_CiFa[i];
         resultElement= resultElement.split(",")
        resultElement= resultElement[0]
        let i1=resultElement.substring(1,resultElement.length)
        result[i] = map_yufa[i1];
    }
    console.log(result);
    console.log(map_yufa);*/
    //
    // result= cifa.result_yufa(data, str).msg
    //将字符串转换为数组
    result = str;

    char = result[0];
    try {
        S();
        i = 0;
        result.length = 0;
        char = "";
        return {flag: true, msg: "语法正确"};
    }catch (e) {
        let error = i;
        console.log(i)
        let msg = result[error];
        i = 0;
        result.length = 0;
        char = "";
        return {flag: false, msg: msg};
    }


}


function getNextChar() {
    i++;
    return result[i];
}


function S() {
    B();
    A();
}


function B() {
    D();
    if (char === "标识符") {
        char = getNextChar();
        if (char === "(") {
            char = getNextChar();
            B_();
        } else {
            throw "error";
        }
    } else {
        throw "error";
    }
}

function B_() {
    if (char === "int" || char === "float") {
        C();
        if (char === ")") {
            char = getNextChar();
        } else {
            throw "error";
        }
    } else if (char === ")") {
        char = getNextChar();
    } else {
        throw "error";
    }
}

function C() {
    D();
    if (char === "标识符") {
        char = getNextChar();
        C_();
    } else {
        throw "error";
    }
}

function C_() {
    if (char === ")") {
    } else if (char === ",") {
        char = getNextChar();
        C();
    } else {
        throw "error";
    }

}

function A() {
    if (char === "{") {
        char = getNextChar();
        M();
        N();
        if (char === "}") {
            char = getNextChar();
        } else {
            throw "error";
        }
    } else {
        throw "error";
    }
}

function M() {
    if (char === "int" || char === "float") {
        P();
        M();
    } else if (char === "标识符") {

    } else {
        throw "error";
    }
}

function P() {
    D();
    if (char === "标识符") {
        char = getNextChar();
        if (char === ";") {
            char = getNextChar();
        }else {
            throw "error";
        }
    } else {
        throw "error";
    }
}

function D() {
    if (char === "int" || char === "float") {
        char = getNextChar();
    } else {
        throw "error";
    }
}

function N() {
    if (char === "}") {

    } else if (char === "标识符") {
        Q();
        N();
    } else {
        throw "error";
    }
}

function Q() {
    if (char === "标识符") {
        char = getNextChar();
        if (char === "=") {
            char = getNextChar();
            E();
            if (char === ";") {
                char = getNextChar();
            } else {
                throw "error";
            }
        } else {
            throw "error";
        }
    } else {
        throw "error";
    }
}

function E() {
    T();
    E_();
}

function E_() {
    if (char === "+") {
        char = getNextChar();
        T();
        E_();
    } else if (char === "-") {
        char = getNextChar();
        T();
        E_();
    } else if (char === ";" || char === ")") {

    } else {
        throw "error";
    }
}

function T() {
    F();
    T_();
}

function T_() {
    if (char === "*") {
        char = getNextChar();
        F();
        T_();
    } else if (char === "/") {
        char = getNextChar();
        F();
        T_();
    } else if (char === "+" || char === "-") {

    }
}

function F() {
    if (char === "标识符") {
        char = getNextChar();
    } else if (char === "(") {
        char = getNextChar();
        E();
        if (char === ")") {
            char = getNextChar();
        } else {
            throw "error";
        }
    } else if (char === "i") {
        char = getNextChar();
    } else {
        throw "error";
    }
}
export default {
    main
}
