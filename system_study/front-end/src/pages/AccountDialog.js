import React from 'react';
import { Modal, Form, Icon, Input, message } from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';
import './account.css'

class AccountDialog extends React.Component {
    state = {
        visible: false, 
    }
    componentWillReceiveProps(newProps){
        //把父组件的变量传到子组件
        if(this.state.visible !== newProps.visible){
            this.setState({
                visible: newProps.visible,
            });
        }
    }
    handleCancel = ()=>{
        this.setState({
            visible: false,
        });
    }
    handleOK = ()=>{
        //点击“登录”后
        this.props.form.validateFields((err,values)=>{
            if(err){
                message.error('表单数据有误，请根据提示填写！');
            }else{
                // console.log(values); //{password: "2", username: "1"}
                HttpUtil.post(ApiUtil.API_CHECK_PASSWORD, values)
                    .then(
                        re=>{
                            message.info(re.message);
                            if(re.code===0){
                                //0才代表验证通过
                                this.setState({
                                    visible: false, //关闭对话框
                                })
                                this.props.onPasswordChecked();  //这才算验证通过
                            }else{
                                //1表示验证失败
                                console.log("请输入正确的账号和密码");
                            }
                        }
                    )
                    .catch(error=>{
                        message.error(error.message);
                    });
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        
        return(
            <Modal
            title="管理员登录"
            visible={this.state.visible} 
            onCancel={this.handleCancel}
            okText="登录"
            onOk={this.handleOK}
            cancelText="取消"
            width={300}
            >
                <div >
                    <Form className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username',{
                                rules:[{required:true, message:'请输入用户名！'}]
                            })(
                                <Input
                                prefix={<Icon type="user" style={{color:'rgba(0,0,0,.25'}}/>}
                                placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password',{
                                rules:[{required:true, message:'请输入密码！'}]
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{color:'rgba(0,0,0,.25'}}/> }
                                type="password"
                                placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

const AccountDialogForm = Form.create({ name: 'account_dialog' })(AccountDialog);

export default AccountDialogForm;