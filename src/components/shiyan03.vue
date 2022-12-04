<template>
  <h1>20201497-黄文耀-实验三预测分析程序</h1>
  <div id="main">
    <el-card>
      <el-table :data="data" class="el-table" height="580">
        <el-table-column prop="c" label="单词符号" width="180"/>
        <el-table-column prop="syn" label="单词种别码" width="180"/>
      </el-table>
      <el-button type="primary" @click="dialogVisible=true">导入单词种别编码</el-button>
      <el-button type="primary" @click="exportExcel">生成导入模板导</el-button>
    </el-card>
    <el-card>
      <h3>预测分析表</h3>
      <el-table :data="yucebiaoData" border :row-style="row_style" :header-row-style="row_style">
        <el-table-column prop="0" label=" " width="90"/>
        <el-table-column prop="(" label="(" width="90"/>
        <el-table-column prop=")" label=")" width="90"/>
        <el-table-column prop="+" label="+" width="90"/>
        <el-table-column prop="-" label="-" width="90"/>
        <el-table-column prop="*" label="*" width="90"/>
        <el-table-column prop="/" label="/" width="90"/>
        <el-table-column prop="i" label="i" width="90"/>
        <el-table-column prop="#" label="#" width="90"/>
      </el-table>
      <h3>输入源程序</h3>
      <el-form label-position="top">
        <el-form-item>
          <el-input type="textarea" v-model="inputStr" :autosize="{ minRows: 10, maxRows: 10 }"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fenxi">语法分析</el-button>
          <el-button type="primary" @click="dialogVisible_text=true">导入源文件</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="width: 300px;">
      <template #header>
        <div class="card-header">
          <span>语法分析结果</span>
        </div>
      </template>
      <el-input type="textarea" v-model="resultStr" :autosize="{ minRows: 10, maxRows: 40 }" disabled
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
import {readFile} from "../js/file";
import * as XLSX from "xlsx";
import {saveAs} from 'file-saver';
import yucefenxi from '../js/yucefenxi'

export default {
  name: "shiyan03",
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
          c: '标识符',
          syn: '3',
        }, {
          c: '+',
          syn: '12',
        },
        {
          c: '-',
          syn: '13',
        },
        {
          c: '*',
          syn: '14',
        },
        {
          c: '/',
          syn: '15',
        }, {
          c: '错误符号',
          syn: '100',
        }
      ],
      dialogVisible: false,
      dialogVisible_text:false,
      //源程序
      inputStr: "",
      //结果
      result: [],
      isEnable: false,
      //  预测表数据
      yucebiaoData: [
        {
          0: 'E',
          "(": "E->TE'",
          "i": "E->TE'",
        }, {
          0: "E'",
          ")": "E'->Ɛ",
          "+": "E'->+TE'",
          "-": "E'->-TE'",
          "#": "E'->Ɛ",
        }, {
          0: "T",
          "(": "T->FT'",
          "i": "T->FT'",
        }, {
          0: "T'",
          ")": "T'->Ɛ",
          "+": "T'->Ɛ",
          "-": "T'->Ɛ",
          "*": "T'->*FT'",
          "/": "T'->/FT'",
          "#": "T'->Ɛ",
        }, {
          0: "F",
          "(": "F->(E)",
          "i": "F->i",
        }
      ],
      row_style: {
        fontWeight: 'bold',
      },
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
        ["整数", "13"],
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
      //预测分析
      let yuceResult = this.yucefenxi(cifa.result_yufa(map, str).msg)
      if (yuceResult.flag) {
        this.resultStr = yuceResult.msg
      } else {
        this.resultStr = "语法错误:" + yuceResult.msg
      }
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
    //预测分析
    yucefenxi(result) {
      let yucebiao = [
        ["TE'", "", "", "", "", "", "TE'", ""],
        ["", "ε", "+TE'", "-TE'", "", "", "", "ε"],
        ["FT'", "", "", "", "", "", "FT'", ""],
        ["", "ε", "ε", "ε", "*FT'", "/FT'", "", "ε"],
        ["(E)", "", "", "", "", "", "标识符", ""],
      ]
      result.push("#")
      return yucefenxi.yucefenxi_(result, yucebiao)
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
#main {
  display: flex;
  height: 670px;
  margin-top: 10px;
  width: 1600px;
  flex-direction: row;;

}

.el-table {
  margin-bottom: 20px;
}
</style>
