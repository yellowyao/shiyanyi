<template>
  <h1>20201497-黄文耀-实验四LR分析程序</h1>
  <div id="main">
    <el-card>
      <el-table :data="data" class="el-table" height="700">
        <el-table-column prop="c" label="单词符号" width="100"/>
        <el-table-column prop="syn" label="单词种别码" width="100"/>
      </el-table>
      <el-button type="primary" @click="dialogVisible=true">导入单词种别编码</el-button>
      <el-button type="primary" @click="exportExcel">生成导入模板导</el-button>
    </el-card>
    <el-card style="flex-grow:1 ;margin-left: 5px">
      <h2 style="margin-top: 0;">LR分析表</h2>
      <el-table :data="LRTable" style="width: 100%" border :row-style="table_style" :header-row-style="table_style"
                max-height="700">
        <el-table-column prop="status" label="状态" width="80"/>
        <el-table-column prop="i" label="i" width="80"/>
        <el-table-column prop="+" label="+"/>
        <el-table-column prop="-" label="-"/>
        <el-table-column prop="*" label="*"/>
        <el-table-column prop="/" label="/"/>
        <el-table-column prop="(" label="("/>
        <el-table-column prop=")" label=")"/>
        <el-table-column prop="#" label="#"/>
        <el-table-column prop="E" label="E"/>
        <el-table-column prop="T" label="T"/>
        <el-table-column prop="F" label="F"/>
      </el-table>
    </el-card>
    <el-dialog
        v-model="dialogVisible"
        title="导入模板"
        width="30%"
        :before-close="handleClose"
    >
      <el-upload class="upload-demo" action='' drag :auto-upload="false" :on-change="uploadChange" :limit="1">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="generateData()"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
  <div class="input_result">
    <el-card>
      <h3 style="margin-top: 0;">输入源码</h3>
      <el-input type="textarea" v-model="inputStr" :autosize="{ minRows: 10, maxRows: 50 }"/>
      <el-button style="margin: 15px" @click="fenxi2" type="primary">LR分析</el-button>
      <el-button style="margin: 15px" type="primary">导入源码</el-button>
      <el-button style="margin: 15px" type="primary">保存结果</el-button>
    </el-card>
    <el-card style="flex-grow:1 ;margin-left: 5px">
      <el-table :data="result" style="width: 100%" border :row-style="table_style" :header-row-style="table_style">
        <el-table-column prop="步骤" label="步骤" width="70"/>
        <el-table-column prop="状态栈" label="状态栈"/>
        <el-table-column prop="符号栈" label="符号栈"/>
        <el-table-column prop="输入串" label="输入串"/>
        <el-table-column prop="动作" label="动作" width="80"/>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import cifa from "../js/cifa";
import * as xlsx from "xlsx";
import * as XLSX from "xlsx";
import {readFile} from "../js/file";
import {saveAs} from 'file-saver';
import shiyan04 from "../js/shiyan04";
export default {
  name: "shiyan04",
  data() {
    return {
      //导入的目标数据
      xlsxData: [],
      //种别编码
      data: [
        {
          c: '(',
          syn: '0',
        },
        {
          c: ')',
          syn: '1',
        },
        {
          c: '整数',
          syn: '4',
        }, {
          c: '/',
          syn: '8',
        }, {
          c: '*',
          syn: '10',
        },
        {
          c: '-',
          syn: '11',
        }, {
          c: '+',
          syn: '12',
        }, {
          c: '错误符号',
          syn: '100',
        }
      ],
      dialogVisible: false,
      //源程序
      inputStr: "",
      //结果
      result: [],
      isEnable: false,
      LRTable: [],
      table_style: {
        'font-weight': 'bold',
        'font-size': '20px',
      },
      step: [],
      actionTable: [],
      gotoTable: [],
      production: [],
    }
  },
  created() {
    //初始化LR分析表
    let production_ = [
      "E'->E",
      "E->E+T",
      "E->E-T",
      "E->T",
      "T->T*F",
      "T->T/F",
      "T->F",
      "F->(E)",
      "F->i",
    ]
    let actionTable = [
      ["i", "+", "-", "*", "/", "(", ")", "#"],
      ["s5", "", "", "", "", "s4", "", ""],
      ["", "s6", "s12", "", "", "", "", "acc"],
      ["", "r3", "r3", "s7", "s13", "", "r3", "r3"],
      ["", "r6", "r6", "r6", "r6", "", "r6", "r6"],
      ["s5", "", "", "", "", "s4", "", ""],
      ["", "r8", "r8", "r8", "r8", "", "r8", "r8"],
      ["s5", "", "", "", "", "s4", "", ""],
      ["s5", "", "", "", "", "s4", "", ""],
      ["", "s6", "s12", "", "", "", "s11", ""],
      ["", "r1", "r1", "s7", "s13", "", "r1", "r1"],
      ["", "r4", "r4", "r4", "r4", "", "r4", "r4"],
      ["", "r7", "r7", "r7", "r7", "", "r7", "r7"],
      ["s5", "", "", "", "", "s4", "", ""],
      ["s5", "", "", "", "", "s4", "", ""],
      ["", "r2", "r2", "s7", "s13", "", "r2", "r2"],
      ["", "r5", "r5", "r5", "r5", "", "r5", "r5"],
    ];//动作表
    let gotoTable = [
      ["E", "T", "F"],
      ["1", "2", "3"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["8", "2", "3"],
      ["", "", ""],
      ["", "9", "3"],
      ["", "", "10"],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
      ["", "14", "3"],
      ["", "", "15"],
      ["", "", ""],
      ["", "", ""],
    ];//转移表
    this.actionTable = actionTable;
    this.gotoTable = gotoTable;
    this.production = production_;
    let status = 0;//状态
    //转换结果展示
    for (let i = 1; i < actionTable.length; i++) {
      let obj = {
        status: status.toString(),
        i: actionTable[i][0],
        '+': actionTable[i][1],
        '-': actionTable[i][2],
        '*': actionTable[i][3],
        '/': actionTable[i][4],
        '(': actionTable[i][5],
        ')': actionTable[i][6],
        '#': actionTable[i][7],
        E: gotoTable[i][0],
        T: gotoTable[i][1],
        F: gotoTable[i][2],
      };
      this.LRTable.push(obj);
      status++;
    }
  },
  methods: {
    //读取模板文件
    async uploadChange(file) {
      let dataBinary = await readFile(file.raw)
      let workBook = xlsx.read(dataBinary, {type: 'binary', cellDates: true})
      let workSheet = workBook.Sheets[workBook.SheetNames[0]]
      this.xlsxData = xlsx.utils.sheet_to_json(workSheet)
    },
    //导入模板数据，生成种别编码
    generateData() {
      let xlsxData_ = this.xlsxData;
      this.data = []
      for (let i = 0; i < xlsxData_.length; i++) {
        let syn = xlsxData_[i];
        console.log(syn)
        let object = {
          c: syn["单词符号"],
          syn: syn["单词种别"]
        }
        this.data.push(object)
      }
      this.dialogVisible = false
    },
    /**
     * 导出 Excel 表格
     */
    exportExcel() {
      let tableData = [
        ["单词符号", "单词种别"],
        [")", "0"],
        ["(", "1"],
        ["int", "2"],
        ["float", "3"],
        ["double", "4"],
        ["boolean", "5"],
        ["string", "6"],
        ["if", "7"],
        ["else", "8"],
        ["break", "9"],
        ["continue", "10"],
        ["for", "11"],
        ["while", "12"],
        ["num", "13"],
        ["标识符", "14"],
        ["{", "15"],
        ["}", "16"],
        ["", "", "注意,整型变量单词符号应为 整数,标识符单词符号应为'标识符'"]
      ]
      // 以下部分才是生成 Excel 的重点
      let aoaToSheet = XLSX.utils.aoa_to_sheet(tableData)
      let bookNew = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(bookNew, aoaToSheet, "模板") // 工作簿名称
      XLSX.writeFile(bookNew, '模板.xlsx') // 保存的文件名
    },
    //分析词法
    fenxi() {
      let map = {};
      let data = this.data
      for (let i = 0; i < data.length; i++) {
        let datum = data[i];
        let c = datum["c"];
        map[c] = datum["syn"]
      }
      let str = this.inputStr
      str = str.replace(/\r\n/g, " ")
      str = str.replace(/\n/g, " ");
      this.result = []
      return cifa.result_yufa(map, str)
    },
    //分析语法
    fenxi2() {
      //获取词法分析结果
      let cifaResult = this.fenxi()
      if (cifaResult.flag){
        let str=cifaResult.msg
        //初始化str
        str.push("#")
        let result = shiyan04.executeFenXi(str, this.actionTable, this.gotoTable,this.production)
        let step = result.step;
        for (let i = 1; i < step.length; i++) {
          let obj = {
            "步骤": step[i][0],
            "状态栈": step[i][1],
            "符号栈": step[i][2],
            "输入串": step[i][3],
            "动作": step[i][4],
          }
          this.result.push(obj)
        }
        if (result.flag) {
          let obj = {
            "步骤": "",
            "状态栈":"",
            "符号栈":"",
            "输入串":"",
            "动作": "分析成功",
          }
          this.result.push(obj)
        }else {
          let obj = {
            "步骤": "",
            "状态栈":"",
            "符号栈":"",
            "输入串":"",
            "动作": "分析失败,错误位置:"+result.msg,
          }
          this.result.push(obj)
        }
      }


    },
    //导出text文件
    exportText(Data, fileName) {
      let str = new Blob([Data], {type: 'text/plain;charset=utf-8'})
      saveAs(str, fileName)
    },
    //保存结果
    save01() {
      let str = "";
      for (let i = 0; i < this.result.length; i++) {
        str = str + this.result[i] + "\n"
      }
      this.exportText(str, "结果")
    },
    //保存源码
    save02() {
      this.exportText(this.result, "结果")
    }
  }
}
</script>

<style>
#main {
  display: flex;
  height: 800px;

  width: 1400px;
  flex-direction: row;;
  justify-content: center
}

.el-table {
  margin-bottom: 20px;
}

.input_result {
  display: flex;

  margin-top: 10px;
  width: 1400px;
  flex-direction: row;;
  justify-content: center
}
</style>
