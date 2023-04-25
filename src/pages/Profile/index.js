import { Button, message, Space } from 'antd'
import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import { useSelector } from 'react-redux'
import { user$ } from 'src/redux/selectors'
import FishdomToken from '../../constants/contracts/token/FishdomToken.sol/FishdomToken.json'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { user } from 'src/redux/actions'

const CustomFormItem = ({ data }) => {
  return (
    <div class="ant-form-item">
      <div class="ant-row ant-form-item-row">
        <div class="ant-col ant-form-item-label">
          <label for={data.name} class="" title={data.label}>
            {data.label}
          </label>
        </div>
        <div class="ant-col ant-form-item-control">
          <div class="ant-form-item-control-input">
            <div class="ant-form-item-control-input-content">
              <input width="100%" class="ant-input ant-input-lg custom-input" id={data.name} disabled="" type="text" value={data.value}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Profile() {
  const userData = useSelector(user$)
  const { account, library } = useWeb3React()

  const RIGHT_CONTENT = [
    {
      name: 'walletAddress',
      label: 'Wallet',
      value: userData.walletAddress
    },
    {
      name: 'pointBalance',
      label: 'Point Balance',
      value: userData.balance
    },
    {
      name: 'fdtBalance',
      label: 'FDT Balance',
      value: '0'
    }
  ]

  useEffect(() => {
    async function getUserFDT() {
      const contract = new ethers.Contract(
        FishdomToken.networks[process.env.REACT_APP_NETWORK_ID].address, 
        FishdomToken.abi, 
        await library.getSigner(account)
      )

      const balance = ethers.utils.formatEther(
        await contract.balanceOf(account)
      )
      const inputEle = document.getElementById('fdtBalance')
      if (inputEle) {
        inputEle.value = balance
      }
    }
    getUserFDT()
  }, [])

  const onUpdateUserData = (values) => {
    const newData = {
      email: values.email ?? undefined,
      fullName: values.fullName ?? undefined
    }
    axios.post(
      process.env.REACT_APP_API_URL + '/AppUsers/updateUserData',
      newData,
			{
				headers: {
					Authorization: `Bearer ${userData.token}`
				}
			}
    ).then((res) => {
      if (res?.data?.statusCode === 200) {
        message.success('Update information successfully!')
        user.setUser(newData)
      } else {
        message.error('Something went wrong!')
      }
    })
  }

  return (
		<section className="page-container section">
      <h2 className="module-header text-center custom-no-margin">Profile</h2>
      <Space direction="vertical" size={40}>
        <div className='profile'>
          <div>
            <Form 
              initialValues={userData}
              layout='vertical'
              onFinish={onUpdateUserData}
            >
              <Form.Item 
                name={'fullName'} 
                label="Full Name"
              >
                <Input
                  width="100%"
                  className="custom-input"
                  min={0}
                  size='large'
                  placeholder="Your name"
                />
              </Form.Item>
              <Form.Item 
                name={'email'} 
                label="Email" 
                rules={[{ type: 'email' }]}
              >
                <Input
                  width="100%"
                  className="custom-input"
                  min={0}
                  size='large'
                  placeholder="Your email"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  htmlType='submit'
                >
                  <span className="text-sub">Submit</span>
                </Button>
              </Form.Item>
            </Form>        
          </div>
          <div className='divider'/>
          <div className='ant-form ant-form-vertical'>
            {
              RIGHT_CONTENT.map(_ele => {
                return (
                  <CustomFormItem data={_ele} />
                )
              }) 
            }   
          </div>
        </div>
      </Space>
    </section>
  )
}

export default Profile