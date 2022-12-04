<template>
  <h1>20201497-黄文耀-实验一词法分析器</h1>
  <div id="main">
    <el-card>
      <el-table :data="data" class="el-table" height="700">
        <el-table-column prop="c" label="单词符号" width="180"/>
        <el-table-column prop="syn" label="单词种别码" width="180"/>
      </el-table>
      <el-button type="primary" @click="dialogVisible=true">导入单词种别编码</el-button>
      <el-button type="primary" @click="exportExcel">生成导入模板导</el-button>
    </el-card>
    <el-card style="width: 500px;">
      <el-form label-position="top">
        <el-form-item label="输入源程序">
          <el-input type="textarea" v-model="inputStr" :autosize="{ minRows: 10, maxRows: 50 }"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fenxi">词法分析</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="width: 400px;">
      <el-table :data="result" class="el-table" height="500">
        <el-table-column prop="result" label="结果"/>
      </el-table>
      <el-button type="primary" @click="save01" :disabled="!isEnable">保存结果</el-button>
      <el-button type="primary" @click="save02" :disabled="!isEnable">保存源码</el-button>
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
</template>

<script>
import cifa from "../js/cifa";
import * as xlsx from "xlsx";
import {readFile} from "../js/file";
import * as XLSX from "xlsx";
import {saveAs} from 'file-saver';

export default {
  name: "index",
  data() {
    return {
      //导入的目标数据
      xlsxData: [],
      //初始种别编码
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
        },{
          c: '=',
          syn: '5',
        },{
          c: ';',
          syn: '6',
        },{
          c: '{',
          syn: '7',
        },{
          c: '}',
          syn: '8',
        },{
          c: '>',
          syn: '10',
        },
        {
          c: '<',
          syn: '11',
        },{
          c: '+',
          syn: '12',
        },{
          c: '错误符号',
          syn: '100',
        }
      ],
      dialogVisible: false,
      //源程序
      inputStr:"",
      //结果
      result:[],
      isEnable:false
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
      //模板数据
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
        ["","","注意,整型变量单词符号应为 整数,标识符单词符号应为'标识符'"]
      ]
      // 以下部分才是生成 Excel 的重点
      let aoaToSheet = XLSX.utils.aoa_to_sheet(tableData)
      let bookNew = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(bookNew, aoaToSheet, "种别码模板") // 工作簿名称
      XLSX.writeFile(bookNew,  '种别码模板.xlsx') // 保存的文件名
    },
    //分析词法
    fenxi(){
      let map={};
      //种别编码为map格式
      let data=this.data
      for (let i=0;i<data.length;i++){
        let datum = data[i];
        let c = datum["c"];
        let syn = datum["syn"];
        map[c]=syn
      }
      //处理源程序，去掉空格和换行
      let str=this.inputStr
      str = str.replace(/\r\n/g," ")
      str = str.replace(/\n/g," ");

      //分析词法
      this.result=[]
      let result = cifa.result(map,str)
      //处理结果，使其在表格中显示
      for (let i=0;i<result.length;i++){
          let resultElement = result[i];
          this.result.push({
            result:resultElement
          })
      }
      this.isEnable=true
    },
    //导出text文件
    exportText(Data,fileName){
      let str=new Blob([Data],{type:'text/plain;charset=utf-8'})
      saveAs(str,fileName)
    },
    //保存结果
    save01(){
      let str="";
      for (let i=0;i<this.result.length;i++){
        str=str+this.result[i]["result"]+"\n"
      }
      this.exportText(str,"结果")
    },
    //保存源码
    save02(){
      this.exportText(this.inputStr,"源码")
    }
  }
}
</script>

<style>
#main {
  display: flex;
  height: 600px;
  margin-top: 20px;
  width: 1200px;
  flex-direction: row;;

}

.el-table {
  margin-bottom: 20px;
}
</style>
