<template>
  <h1>20201497-黄文耀-实验二递归下降分析程序</h1>
  <div id="shiyan02_timu">
    <el-card style="width: 100%">
      <el-collapse>
        <el-collapse-item>
          <template #title>
            <span style="font-size: 28px;font-weight: bold">实验二题目</span>
          </template>
          <el-image style="width: 1000px; " src="/src/assets/image/实验二题目.png" fit="fill"/>
        </el-collapse-item>
        <el-collapse-item>
          <template #title>
            <span style="font-size: 28px;font-weight: bold">实验二文法</span>
          </template>
          <el-image style="width: 1000px; " src="/src/assets/image/实验二文法.png" fit="fill"/>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
  <div id="main_02">
    <el-card style="width: 500px;  height: 800px;">
      <el-table :data="data" class="el-table" height="700">
        <el-table-column prop="c" label="单词符号"/>
        <el-table-column prop="syn" label="单词种别码"/>
      </el-table>
      <el-button type="primary" @click="dialogVisible=true">导入单词种别编码</el-button>
      <el-button type="primary" @click="exportExcel">生成导入模板导</el-button>
    </el-card>
    <el-card style="width: 500px; height: 800px;">
      <el-form label-position="top">
        <el-form-item label="输入源程序">
          <el-input type="textarea" v-model="inputStr" :autosize="{ minRows: 10, maxRows: 50 }"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fenxi">语法分析</el-button>
          <el-button type="primary" @click="getText">导入源文件</el-button>
        </el-form-item>
        <el-form-item>
          <el-table :data="result" class="el-table" height="390">
            <el-table-column prop="result" label="词法结果" width="400"/>
          </el-table>
          <el-button type="primary" @click="save01" :disabled="!isEnable">保存结果</el-button>
          <el-button type="primary" @click="save02" :disabled="!isEnable">保存源码</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="height: 800px;flex-grow: 1">
      <template #header>
        <div class="card-header">
          <span>语法分析结果</span>
        </div>
      </template>
      <el-input type="textarea" v-model="resultStr" :autosize="{ minRows: 10, maxRows: 50 }" disabled
                style="font-size: 22px"/>
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

    <el-dialog
        v-model="dialogVisible_text"
        title="导入源文件"
        width="30%"
        :before-close="handleClose"
    >
      <el-upload class="upload-demo" action='' drag :auto-upload="false" :on-change="uploadChange_text" :limit="1">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible_text = false">取消</el-button>
        <el-button type="primary" @click="generateData_text()"
        >确认</el-button
        >
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import cifa from "../js/cifa";
import * as xlsx from "xlsx";
import * as XLSX from "xlsx";
import {readFile} from "../js/file";
import {saveAs} from 'file-saver';
import yufa from "@/js/yufa";

export default {
  name: "index",
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
          c: 'int',
          syn: '2',
        },
        {
          c: '标识符',
          syn: '3',
        },
        {
          c: '整数',
          syn: '4',
        }, {
          c: '=',
          syn: '5',
        }, {
          c: ';',
          syn: '6',
        }, {
          c: '{',
          syn: '7',
        }, {
          c: '}',
          syn: '8',
        }, {
          c: '>',
          syn: '10',
        },
        {
          c: '<',
          syn: '11',
        }, {
          c: '+',
          syn: '12',
        }, {
          c: ',',
          syn: '13',
        }, {
          c: 'float',
          syn: '14',
        }, {
          c: '*',
          syn: '15',
        }, {
          c: '/',
          syn: '16',
        }, {
          c: '-',
          syn: '17',
        }, {
          c: '错误符号',
          syn: '100',
        }
      ],
      dialogVisible: false,
      dialogVisible_text: false,
      //源程序
      inputStr: "",
      //结果
      result: [],
      isEnable: false,
      resultStr: "",
    }
  },
  methods: {
    //读取模板文件
    async uploadChange(file) {
      let dataBinary = await readFile(file.raw)
      let workBook = xlsx.read(dataBinary, {type: 'binary', cellDates: true})
      let workSheet = workBook.Sheets[workBook.SheetNames[0]]
      this.xlsxData = xlsx.utils.sheet_to_json(workSheet)
      console.log(this.xlsxData)
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
     * 导出 Excel 模板表格
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
        let syn = datum["syn"];
        map[c] = syn
      }
      let str = this.inputStr
      str = str.replace(/\r\n/g, " ")
      str = str.replace(/\n/g, " ");
      this.result = []
      let result = cifa.result(map, str)
      for (let i = 0; i < result.length; i++) {
        let resultElement = result[i];
        this.result.push({
          result: resultElement
        })
      }
      this.yufafenxi(cifa.result_yufa(map, str).msg)
      this.isEnable = true
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
        str = str + this.result[i]["result"] + "\n"
      }
      this.exportText(str, "结果")
    },
    //保存源码
    save02() {
      this.exportText(this.inputStr, "源码")
    },
    //语法分析
    yufafenxi(str) {
      let resMes = yufa.main(str);
      if (resMes["flag"]) {
        this.resultStr = resMes["msg"]
      } else {
        this.resultStr = "语法错误:  " + resMes["msg"]
      }

    },
    //导入源码
    getText() {
      this.dialogVisible_text = true
    },
    //导入源码text文件，生成源码
    uploadChange_text(file) {
      let dataBinary = file.raw
      let reader = new FileReader();
      reader.readAsText(dataBinary, 'utf-8');
      reader.onload = (e) => {
        this.inputStr = e.target.result
      }
    },

    generateData_text() {
      this.fenxi()
      this.dialogVisible_text = false
    },

  }
}
</script>

<style>
#main_02 {
  display: flex;
  height: 500px;
  margin-top: 10px;
  width: 1500px;
  flex-direction: row;;

}

.el-table {
  margin-bottom: 20px;
  width: 100%;
}

#shiyan02_timu {
  display: flex;
  width: 1500px;
}

#shiyan02_timu .el-collapse {
  width: 100%;
}
</style>
