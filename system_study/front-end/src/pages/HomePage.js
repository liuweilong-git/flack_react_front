import React from 'react';
import { Layout, Table, Button, Modal, message, Icon } from 'antd';
import InfoDialog from './InfoDialog'
import AccountDialog from './AccountDialog'
import HttpUtil from '../Utils/HttpUtil';
import ApiUtil from '../Utils/ApiUtil';

const { Header, Content } = Layout;

var columns = [
    {
      title: '业务',  //新开，续卡
      dataIndex: 'service',
      width:"80px",
    },
    {
      title: '金额',
      dataIndex: 'money',
      width:"80px",
    },
    {
      title: '卡号',
      dataIndex: 'card_number',
      width:"100px",
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width:"80px",
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        width:"120px",
    },
    {
        title: '项目',
        dataIndex: 'project',
        width:"80px",
    },
    {
        title: '导购员',
        dataIndex: 'shop_guide',
        width:"80px",
    },
    {
        title: '老师',
        dataIndex: 'teacher',
        width:"80px",
    },
    {
        title: '财务情况',
        dataIndex: 'financial',
    },
    {
        title: '备注1',
        dataIndex: 'remarks1',
    },
    {
        title: '收钱吧详情',
        dataIndex: 'collect_money',
    },
    {
        title: '备注2',
        dataIndex: 'remarks2',
    },
];
const columns1 = columns.slice(0);

// let tmp = {service:'新开', money:'1200', card_number:'1002886', name:'王小二', phone:'18066668888', 
//     project:'散打', shop_guide:'江小白', teacher:'王大锤', financial:'图片1', remarks1:'B6A9B5A5BAC5B2E9D1AF',
//     collect_money:'图片2', remarks2:'B6A9B5A5BAC5B2E9D1AF'};

class HomePage extends React.Component{
    mAllData = [];
    columns2 = []; //定义
    state = {
        showInfoDialog: false, //显示添加对话框
        editingItem: null, //对话框编辑的内容
        mData: [], //table里的数据
        showAdmin: false, //是否为管理员
        my_columns:[], //列名
        show_back: "none", //是否显示“back”
        show_account: false, //显示输入账号对话框
        my_password: [], //账号，密码信息
    }
    
    admin_item = {
        title: '操作',
        // dataIndex: 'operate',  //千万不能加，否则获取不到数据
        render: (staff)=>(
            <span>
                <Icon type="edit" onClick={()=>this.showUpdateDialog(staff)}/>
                <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft:12}} onClick={() => this.deleteConfirm(staff)} />
            </span>
        ),
    };

    getMyColumns(){
        // console.log("getMyColumns:",this.state.showAdmin);
        if(this.state.showAdmin===true){
            this.setState({
                my_columns: this.columns2,
            });
        }else{
            this.setState({
                my_columns: columns1,
                // my_columns: this.columns2,
            });
        }
    }

    componentDidMount() {
        columns.push(this.admin_item); //加了一列的
        this.columns2 = columns;

        this.getData(); //初始化，获取数据并显示
        this.getMyColumns(); //获取列名
    }

    
    getData(){
        HttpUtil.get(ApiUtil.API_STAFF_LIST) //获取所有数据
            .then(
                staffList =>{
                    this.mAllData = staffList;
                    this.setState({
                        mData: staffList,
                        showInfoDialog: false,
                    });
                }
            ).catch(error=>{
                message.error(error.message);
            });
    }
    handleInfoDialogClose = (staff)=>{
        if(staff){
            if(staff.id){
                //修改
                let datas = [...this.state.mData];
                for(let i=0;i<datas.length;i++){
                    if(datas[i].id === staff.id){
                        //如果相等，表示更新该条数据
                        datas[i] = staff;
                        this.setState({
                            mData: datas,
                            showInfoDialog: false,
                        });
                        break; //找到了，就不必后面的了
                    }
                }
            }else{
                //新增 staff.id为0
                console.log("新增数据");
                this.getData();
            }
        }else{
            //删除
            this.getData();
        }
    }
    handlePasswordChecked = ()=>{
        //确认验证成功后
        this.setState({
            showAdmin: true, //显示"操作"列
            show_account:false, //可以关闭账号的对话框了
            show_back: "block",  //增加一个链接 返回普通用户
        },function(){ //立马可以获取新的state值
            this.getMyColumns(); //重新获取列名
        }
        );
    }
    gotoAdmin = ()=>{
        //点击后，应该进入管理员模式
        console.log("进入管理员模式");
        this.setState({
            show_account: true,
        });
    }
    onBack = ()=>{
        this.setState({
            showAdmin: false, //隐藏只有管理员可见的列
            show_back: "none", //隐藏"返回"
        },function(){
            this.getMyColumns();
        });
    }
    showUpdateDialog(item){  //稍微一点细节错误，就整个错了
        if(item===undefined){
            //如果item未定义，则表示新增
            item = {};
        }

        this.setState({
            //如果有数据，则把该条数据复制，显示在对话框中，可供修改
            showInfoDialog: true,
            editingItem: item, 
        });
    }
    deleteConfirm = (staff)=>{
        var that = this;  // 下面的内嵌对象里面，this就改变了，这里在外面存一下。
        const modal = Modal.confirm({
            title: '确认',
            content: '确定要删除这条记录吗？',
            okText: '确认',
            cancelText:'取消',
            onOk(){
                that.removeData(staff.id);
                modal.destroy();
            },
            onCancel(){},
        });
    }
    removeData(id){
        HttpUtil.get(ApiUtil.API_STAFF_DELETE + id)
            .then(
                x =>{console.log('删除了');
                    this.getData();}
            )
    }
    exportToFile = ()=>{
        HttpUtil.get(ApiUtil.API_EXPORT_TO_FILE)
            .then(
                res =>{
                    message.info(res.message);
                }
            ).catch(error=>{
                message.error(error.message);
            });
    }

    render(){

        return (
                <Layout>
                    <Header>
                        <div style={{lineHeight:'64px', fontSize:"20px", color:"white",textAlign:"center"}}> 
                            拉布拉卡 - 卡片管理系统
                        </div>
                    </Header>

                    <Content >
                        <div style={{ background: '#fff', padding: 24, minHeight: 480 }}>
                            <Button style={{position:"absolute", right:"70px", top:"20px"}} onClick={()=>this.showUpdateDialog()}>添加</Button>
                            <Table 
                            columns={this.state.my_columns} 
                            dataSource={this.state.mData} 
                            rowKey={item=>item.id}
                            pagination={{ pageSize: 50 }} 
                            scroll={{ y: 340 }} />
                            
                            <InfoDialog
                                visible={this.state.showInfoDialog}
                                staff={this.state.editingItem}
                                afterClose={()=>{
                                    this.setState({showInfoDialog:false});
                                    this.getData();
                                }}
                                onDialogConfirm={this.handleInfoDialogClose} />

                            <AccountDialog 
                            visible={this.state.show_account}
                            onPasswordChecked={this.handlePasswordChecked}
                            />
                            
                            <div style={{position:"absolute", left:"10px", bottom:"10px"}}>
                                <a onClick={this.gotoAdmin}>管理员</a>
                            </div>
                            <div style={{position:"absolute", left:"70px", bottom:"10px", display:this.state.show_back}}>
                                <a onClick={this.onBack}>返回</a>
                            </div>
                            <div style={{position:"absolute", left:"120px", bottom:"10px", display:this.state.show_back}}>
                                <a onClick={this.exportToFile} >导出</a>
                            </div>
                        </div>
                    </Content>
                </Layout>
        );
    }
}

export default HomePage;