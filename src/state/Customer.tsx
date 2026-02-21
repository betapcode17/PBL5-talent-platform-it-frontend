import React, { Component } from 'react'

interface CustomerProps {
  info: {
    name: string
    email: string
  }
}

interface CustomerState {
  name: string
  email: string
}

export class Customer extends Component<CustomerProps, CustomerState> {
  constructor(props: CustomerProps) {
    super(props)
    this.state = {
      name: props.info.name,
      email: props.info.email
    }
  }

  ChangeInfo = () => {
    this.setState({
      name: 'Dat Tran',
      email: 'quocdat@gmail.com'
    })
  }

  render() {
    const { name, email } = this.state

    return (
      <div>
        <h1>Name: {name}</h1>
        <h1>Email: {email}</h1>
        <button onClick={this.ChangeInfo}>Update Customer</button>
      </div>
    )
  }
}

export default Customer
