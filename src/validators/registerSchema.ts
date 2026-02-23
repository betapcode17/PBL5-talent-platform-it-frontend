import { z } from 'zod'

const passwordRequirements = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?\\~`]/
}

export const registerSchema =
  // Bước 1: Validate email
  // Bước 2: Validate họ tên - chỉ khi email hợp lệ
  z
    .object({
      email: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
      fullName: z.string()
    })
    .superRefine((data, ctx) => {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email không được để trống',
          path: ['email']
        })
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email không đúng định dạng',
          path: ['email']
        })
        return
      }
    })
    .superRefine((data, ctx) => {
      // Bỏ qua nếu email chưa hợp lệ
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return
      }

      if (!data.fullName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Họ tên không được để trống',
          path: ['fullName']
        })
        return
      }

      if (data.fullName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Họ tên phải có ít nhất 2 ký tự',
          path: ['fullName']
        })
        return
      }
    })
    // Bước 3: Validate mật khẩu - chỉ khi họ tên hợp lệ
    .superRefine((data, ctx) => {
      // Bỏ qua nếu email hoặc họ tên chưa hợp lệ
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.fullName || data.fullName.length < 2) {
        return
      }
      // Kiểm tra mật khẩu trống - SỬA LỖI Ở ĐÂY
      // Thêm trim() để tránh trường hợp chỉ có khoảng trắng và kiểm tra có giá trị thực sự
      if (!data.password || data.password.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu không được để trống',
          path: ['password']
        })
        return
      }
      // Kiểm tra độ dài mật khẩu
      if (data.password.length < passwordRequirements.minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Mật khẩu phải có ít nhất ${passwordRequirements.minLength} ký tự`,
          path: ['password']
        })
        return
      }

      // Kiểm tra chữ hoa
      if (!passwordRequirements.hasUppercase.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa',
          path: ['password']
        })
        return
      }
      // Kiểm tra chữ thường
      if (!passwordRequirements.hasLowercase.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu phải có ít nhất 1 chữ cái viết thường',
          path: ['password']
        })
        return
      }
      // Kiểm tra số
      if (!passwordRequirements.hasNumber.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu phải có ít nhất 1 số',
          path: ['password']
        })
        return
      }
      // Kiểm tra ký tự đặc biệt
      if (!passwordRequirements.hasSpecialChar.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt',
          path: ['password']
        })
        return
      }
    })
    // Bước 4: Validate xác nhận mật khẩu - chỉ khi mật khẩu hợp lệ
    .superRefine((data, ctx) => {
      // Điều kiện bỏ qua kiểm tra (tất cả các bước trước phải hợp lệ)
      if (
        !data.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        !data.fullName ||
        data.fullName.length < 2 ||
        !data.password ||
        data.password.length < passwordRequirements.minLength ||
        !passwordRequirements.hasUppercase.test(data.password) ||
        !passwordRequirements.hasLowercase.test(data.password) ||
        !passwordRequirements.hasNumber.test(data.password) ||
        !passwordRequirements.hasSpecialChar.test(data.password)
      ) {
        return
      }

      // Kiểm tra xác nhận mật khẩu trống
      if (!data.confirmPassword || data.confirmPassword.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng xác nhận mật khẩu',
          path: ['confirmPassword']
        })
        return
      }

      // Kiểm tra mật khẩu khớp
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mật khẩu không khớp',
          path: ['confirmPassword']
        })
        return
      }
    })
