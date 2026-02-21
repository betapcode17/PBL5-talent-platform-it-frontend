import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
type FormError = {
  name: string
  email: string
  password: string
}
export const Form = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errors, setErrors] = useState<FormError>({} as FormError)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = {} as FormError
    if (!name) {
      error.name = 'Ten bat buoc phai nhap'
    }
    if (!email) {
      error.email = 'Email bat buoc phai nhap'
    }
    if (!password) {
      error.password = 'Email bat buoc phai nhap'
    }
    setErrors(error)
    console.log(name, email, password)
  }
  return (
    <div>
      <h1>Form Component</h1>
      <form action='' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            placeholder='name'
            id='name'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            placeholder='email'
            id='email'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            placeholder='password'
            id='password'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}
