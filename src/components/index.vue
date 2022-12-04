<template>
<div class="index">

  <el-card >
    <template #header>
      <div class="card-header">
        <h1>20201497-黄文耀-编译原理实验</h1>
      </div>
    </template>
    <div class="shiyan">
      <h1>实验一  入口</h1>
      <el-button @click="toCifa" type="primary" size="large">词法分析器
      </el-button>
    </div>
    <div class="shiyan">
      <h1>实验二  入口</h1>
      <el-button @click="toShiyan02" type="primary" size="large">语法分析器
      </el-button>
    </div>
    <div class="shiyan">
      <h1>实验三  入口</h1>
      <el-button @click="toShiyan03" type="primary" size="large">语法分析器
      </el-button>
    </div>
    <div class="shiyan">
      <h1>实验四  入口</h1>
      <el-button @click="toShiyan04" type="primary" size="large">LR分析程序
      </el-button>
    </div>
    <div class="shiyan">
      <h1>实验五  入口</h1>
      <el-button @click="toShiyan05" type="primary" size="large">语义分析程序
      </el-button>
    </div>
  </el-card>
</div>
</template>

<script>

export default {
  name: "index",
  methods:{
    toCifa(){
      this.$router.push('/shiyan01')
    },
    toShiyan02(){
      this.$router.push('/shiyan02')
    },
    toShiyan03(){
      this.$router.push('/shiyan03')
    },
    toShiyan04(){
      this.$router.push('/shiyan04')
    }
    ,
    toShiyan05(){
      this.$router.push('/shiyan05')
    }

  }
}
</script>

<style scoped>
.index{
  margin-top: 100px;
}
.shiyan{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.shiyan h1{
  margin-right: 150px;
}

</style>
