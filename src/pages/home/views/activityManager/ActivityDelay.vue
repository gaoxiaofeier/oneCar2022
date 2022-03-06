<template>
    <el-main>
        <div class="main_inner">
            <div style="padding:20px 20px 30px">
                <div class="search-wrap">
                    <el-form :model="search" label-width="70px" label-position="left">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item label="手机号：">
                                    <el-input v-model="search.phone" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" :offset="1">
                                <el-form-item label="昵称：">
                                    <el-input v-model="search.nickName" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2" :offset="2">
                                <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="table-wrap">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column prop="phone" label="手机号" width="110">
                        </el-table-column>
                        <el-table-column prop="nickname" label="昵称">
                        </el-table-column>
                        <el-table-column prop="trueName" label="真实姓名" style="">
                        </el-table-column>
                        <el-table-column prop="actName" label="参加活动">
                        </el-table-column>
                        <el-table-column prop="actTime" label="活动日期">
                            <template slot-scope="scope">
                                {{scope.row.actTime|timeFiltersTime}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="opTime" label="延期操作时间">
                        </el-table-column>
                        <el-table-column prop="remark" label="备注">
                            <template slot-scope="scope">
                                <div @click="changeH(scope.row)" type="text" size="small" style="min-height:50px;line-height:50px;cursor:pointer;">
                                  {{scope.row.remark}}
                                </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.native.prevent="deleteConform(scope.row)" style="color:red">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrap clearfix">
                        <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChangeSpecial" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="totalTr">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 确认删除弹框 -->
        <el-dialog :visible.sync="conformDeleteVisible" width="300px" center>
            <p style="text-align:center">确认删除？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible" size="small">取 消</el-button>
                <el-button type="primary" @click="deleteUser" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改备注弹窗 -->
        <el-dialog title="备注修改" :visible.sync="remarkVisible" width="380px">
            <el-form  >
              <el-form-item label="备注：" prop="hover" width="60px" style="margin-bottom: 18px;">
                <el-input type="textarea" v-model="remarkBox" style="width:260px"></el-input>
              </el-form-item>
              <div class="dialog-footer" style="text-align:center;">
                <el-button @click="resetRemark('form')">取 消</el-button>
                <el-button type="primary" @click="submitRemark()">确 定</el-button>
              </div>
            </el-form>
        </el-dialog>
    </el-main>
</template>

<script>
import util2 from '@/libs/util2'
/* eslint-disable */
export default {
    name: 'ActivityDelay',
    data() {
        return {
            search: {
                phone: '',
                nickName: '',
            },
            tableData: [],
             pagination: {
                pageNum: 1,
                pageSize: 20,
            },
            totalTr: 0, // 每次调用接口以后  用后台的total值 重新赋值
            conformDeleteVisible: false, //确认删除记录弹框
            remarkVisible:false, //备注弹窗
            remarkBox:'',  //备注弹窗input
            remarkId:Number, //备注弹窗传的id
        }
    },
    filters: {
        timeFiltersTime(date) {
            if (date) {
                let dateee = new Date(date).toJSON()
                let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
                    .toISOString()
                    .replace(/T/g, ' ')
                    .replace(/\.[\d]{3}Z/, '')
                return newDate.substring(0, 10)
            }
        }
    },
    created: function () {
        this.getTableData()
    },
    methods: {
        getSearchParams() {
            // 根据后台字段 对应修改
            // 最好是和后台保持一致
            let params = Object.assign(this.search, this.pagination)
            return params
        },
        getTableData() {
           var params = this.getSearchParams()
           let trackParams = new URLSearchParams(params)
            // trackParams.append('actId', '')
            // trackParams.append('nickName', '')
            // trackParams.append('phone', '18621808690')
            // trackParams.append('userId', '')
            // trackParams.append('pageSize', 20)
            // trackParams.append('pageNum', 1)
            util2.ajax
                .get('delay?' + trackParams)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.tableData=res.data.data.data
                        this.totalTr=res.data.data.total
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
            
            
        },
        handleCurrentChangeSpecial(currentPage) {
            this.pagination.pageNum = currentPage
            // 调用接口
            this.getTableData()
        },
        deleteConform(row) {
            this.conformDeleteVisible = true
            this.deleteData = row
        },
        //关闭删除窗口
        deleteVisible() {
            this.conformDeleteVisible = false
        },
        //确认删除
        deleteUser() {
            util2.ajax
                .delete('delay/' + this.deleteData.id)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('删除成功')
                        this.conformDeleteVisible = false
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //点击备注修改
        changeH(row) {
          this.remarkVisible = true  //备注弹窗
          this.remarkId = row.id
          this.remarkBox = row.remark
        },
        resetRemark() {
          this.remarkVisible = false
        },
        submitRemark() {
            if(this.remarkBox){
                let params = {
                    delayId:this.remarkId,
                    remark:this.remarkBox
                }
                util2.ajax
                    .post('delay/remark', params) 
                    .then((res) => {
                       if (parseInt(res.data.code) == 200) {
                            this.remarkVisible = false
                            this.$message('备注修改成功')
                            this.getTableData()
                        }else if (res.data.code == 3003) {
                            this.$router.push('/Login')
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            }else{
                this.$message('备注信息不能为空')
            }
            
        }
    },
}
</script>

<style scoped>
.search {
    width: 30%;
    float: left;
    height: 50px;
}
.search_btn {
    width: 10%;
    float: right;
}
.s_lie {
    float: left;
    font-size: 14px;
    line-height: 32px;
}
.s_input {
    width: 90px;
    float: left;
}
.el-input__inner {
    height: 32px !important;
}
.main_inner {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding-bottom: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
}
.act_out {
    border-radius: 6px;
    width: 100%;
    height: 118px;
    background-color: #fff;
    padding: 10px 20px 0 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
}
.act_title {
    color: #333;
    font-size: 22px;
    height: 60px;
    line-height: 60px;
}
.inf_box {
    color: #666;
    font-size: 16px;
    line-height: 22px;
}

.inf_box .user_name {
    margin-right: 6px;
    font-size: 18px;
}
.ui_list {
    float: left;
    width: 30%;
}
.mi_title {
    color: #333;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
    padding-left: 4px;
}
.user_inf {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
}
.user_name {
    width: 55px;
    float: left;
}
.add_btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(24, 144, 255, 1);
    color: #fff;
    font-size: 14px;
    margin: 10px 30px 20px 0;
    float: left;
}
.add_btn:hover {
    cursor: pointer;
}
.hand_join {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(24, 144, 255, 1);
    color: #fff;
    font-size: 14px;
    margin: 10px 30px 20px 0;
    float: left;
}
.hand_join:hover {
    cursor: pointer;
}
.weather_change {
    width: 40px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(24, 144, 255, 1);
    color: #fff;
    font-size: 12px;
    margin: -6px 30px 20px 20px;
    float: left;
}
.weather_change:hover {
    cursor: pointer;
}
.el-form-item {
    margin-bottom: 10px;
}
.main_inner .el-pagination {
    float: right;
    margin-right: 40px;
}
.guan_lian {
    position: absolute;
    right: 0px;
    top: 1px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}
.inner_lian {
    display: block;
    float: left;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(24, 144, 255, 1);
    color: #fff;
    cursor: pointer;
    padding:0px 6px;
    margin-right: 12px;
}
</style>
