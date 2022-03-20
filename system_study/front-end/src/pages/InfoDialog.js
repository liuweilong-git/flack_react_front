import React from 'react';
import { Modal, Form, Row, Input, Col, Select, Button, message } from 'antd';
import ApiUtil from '../Utils/ApiUtil';
import HttpUtil from '../Utils/HttpUtil';

class InfoDialog extends React.Component {
    state = {
        visible: false,
        staff: {},
        can_shop_guide: true,  //是否可以选择“导购员”
    }
    componentWillReceiveProps(newProps) {
        //可以把父组件值传递进来
        if (this.state.visible !== newProps.visible) {
          this.setState({
            visible: newProps.visible
          });
        }
        // if (newProps.staff && this.state.staff.id !== newProps.staff.id){
        //     // console.log("newProps.staff:",newProps.staff);
        //     this.setState({
        //         visible: true,
        //         staff: newProps.staff,
        //     })
        // }
    }
    handleOK = ()=>{
        this.props.form.validateFields((err,values)=>{
            if(err){
                message.error('表单数据有误，请根据提示填写！')
            }else{
                // console.log("填写正确！");
                HttpUtil.post(ApiUtil.API_STAFF_UPDATE, values)
                    .then(
                        re=>{
                            message.info(re.message);
                        }
                    )
                    .catch(error=>{
                        message.error(error.message);
                    });
                    
                this.setState({
                    visible: false,
                });

                this.props.onDialogConfirm(values);
            }
        })
    }
    handleCancel = ()=>{
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit");
    }

    searchItems = {};

    handleTextChange = (e)=>{
        let attr = e.target.getAttribute('item');
        if(attr){
            this.searchItems[attr] = e.target.value;
            // console.log(attr +':'+ e.target.value);
        }
    }
    handleSearch = ()=>{
        // console.log("hi",this.searchItems);
        let where = JSON.stringify(this.searchItems);
        let url = ApiUtil.API_STAFF_SEARCH_3 + "?where=" + encodeURI(where);
        HttpUtil.get(url)
            .then(
                res =>{
                    // console.log(res); // ["2", "2", "2"]  ("card_number", "name", "phone")
                    var tmp;
                    if(res!==null){
                        tmp = res;
                    }else{
                        tmp = ["", "", ""];
                    }
                    this.props.form.setFieldsValue({card_number:tmp[0], name: tmp[1], phone: tmp[2]}); 
                }
            )
    }
    
    render(){
        const {visible } = this.state;
        const {
            getFieldDecorator
        } = this.props.form;

        return(
            <Modal 
            title="信息编辑"
            okText="保存"
            style={{top:20}}
            width={500}
            afterClose={this.props.afterClose}
            onCancel={this.handleCancel}
            cancelText="取消"
            visible={visible}
            onOk={this.handleOK}
            >
                <div>
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <Form.Item {...styles.formItem2Col}>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>

                        <Form.Item label="业务" {...styles.formItem2Col}>
                            {getFieldDecorator('service',{
                                rules: [{ required: true, message: '请选择业务!' }],
                            })(
                                // onChange={value => console.log(value)}
                                <Select style={{ width: 140 }} onChange={
                                    value =>{
                                        var tmp;
                                        if(value==="新开")
                                        {tmp=true;}
                                        else
                                        {tmp=false;} //续卡不能填
                                        this.setState({
                                            can_shop_guide: tmp,
                                        });
                                    }
                                }>   
                                {service_choice.map((item) => <Select.Option value={item.name} key={item.id}>{item.name}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label="金额" {...styles.formItem2Col}>
                            {getFieldDecorator('money',{
                                rules: [{required: true, message:"请填写金额！"}]
                            })(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="卡号" {...styles.my_card}>
                            <Row gutter={20}>
                                <Col span={22}>
                                    {getFieldDecorator('card_number', {
                                    rules: [{required: true, message:"请填写卡号！"}]
                                    })(
                                        <Input placeholder="" item="card_number" onChange={this.handleTextChange}/> 
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button shape="circle" icon="search" onClick={this.handleSearch}/>
                                </Col>
                            </Row>
                            
                        </Form.Item>

                        <Form.Item label="姓名" {...styles.my_name}> 
                                <Row gutter={20}>
                                    <Col span={13}>
                                        {getFieldDecorator('name',{
                                        rules: [{required: true, message:"请填写姓名！"}]
                                        })(
                                            <Input placeholder="" item="name" onChange={this.handleTextChange}/>
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <Button shape="circle" icon="search" onClick={this.handleSearch} />
                                    </Col>
                                </Row>
                        </Form.Item>

                        <Form.Item label="手机号" {...styles.my_name}>
                                <Row gutter={20}>
                                    <Col span={22}>
                                        {getFieldDecorator('phone', {
                                            rules: [{required: true, message:"请填写手机号！"}]
                                        })(
                                            <Input placeholder="" item="phone" onChange={this.handleTextChange}/>
                                        )}
                                    </Col>
                                    <Col span={2}>
                                        <Button shape="circle" icon="search" onClick={this.handleSearch} />
                                    </Col>
                                </Row>
                        </Form.Item>

                        <Form.Item label="项目" {...styles.formItem2Col}>
                            {getFieldDecorator('project')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="导购员" {...styles.formItem2Col}>
                            {getFieldDecorator('shop_guide')(
                                <Input placeholder={this.state.can_shop_guide?'':'不能输入'} disabled={this.state.can_shop_guide?false:true} /> 
                            )}
                        </Form.Item>

                        <Form.Item label="老师" {...styles.formItem2Col}>
                            {getFieldDecorator('teacher')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="财务情况" {...styles.formItem2Col}>
                            {getFieldDecorator('financial')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="备注1" {...styles.formItemLayout}>
                            {getFieldDecorator('remarks1')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="收钱吧详情" {...styles.formItem2Col}>
                            {getFieldDecorator('collect_money')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>

                        <Form.Item label="备注2" {...styles.formItemLayout}>
                            {getFieldDecorator('remarks2')(
                                <Input placeholder="" />
                            )}
                        </Form.Item>
                    </Form>
                </div>
        </Modal>
        );
    }
}

const styles = {
    formItemLayout:{
        labelCol: {span: 4},
        wrapperCol: {span: 15},
    },
    formItem2Col:{
        labelCol: {span: 4},
        wrapperCol: {span: 8},
    },
    my_name:{
        labelCol: {span:4},
        wrapperCol: {span:15},
    },
    my_card:{
        labelCol: {span: 4},
        wrapperCol: {span: 16},
    },
};

const service_choice = [
    {id: '1',name: '新开'},
    {id: '2',name: '续卡'}
]

const objToForm = (obj)=>{
    let target = {}
    for(let [key,value] of Object.entries(obj)){
        target[key] = Form.createFormField({value});
    }
    // console.log("target",target);
    return target
}

//数据进行传递
const InfoDialogForm = Form.create({ 
    name: 'information_dialog',
    mapPropsToFields(props){
        if(!props.staff){
            return ;
        }
        return objToForm(props.staff);
    }
})(InfoDialog);

export default InfoDialogForm;