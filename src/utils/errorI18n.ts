import i18n from '@/i18n'
import axios from 'axios'

export type SupportedLanguage = 'en' | 'vi'

export interface ErrorTranslation {
  en: string
  vi: string
}

export const ERROR_DICTIONARY: Record<string, ErrorTranslation> = {
  // Auth & Login
  'auth.invalid_credentials': {
    en: 'Invalid email or password',
    vi: 'Email hoặc mật khẩu không đúng'
  },
  'auth.account_locked': {
    en: 'Your account has been locked. Please contact administrator for details.',
    vi: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.'
  },
  'auth.login_failed': {
    en: 'Login failed. Please try again.',
    vi: 'Đăng nhập thất bại. Vui lòng thử lại.'
  },
  'auth.email_exists': {
    en: 'Email already exists.',
    vi: 'Email đã tồn tại.'
  },
  'auth.email_not_found': {
    en: 'Email does not exist in the system.',
    vi: 'Email không tồn tại trong hệ thống.'
  },
  'auth.email_required': {
    en: 'Email cannot be empty.',
    vi: 'Email không được để trống.'
  },
  'auth.email_invalid': {
    en: 'Invalid email address.',
    vi: 'Email không hợp lệ.'
  },
  'auth.fullname_required': {
    en: 'Full name cannot be empty.',
    vi: 'Họ tên không được để trống.'
  },
  'auth.fullname_min_length': {
    en: 'Full name must be at least 2 characters.',
    vi: 'Họ tên phải có ít nhất 2 ký tự.'
  },
  'auth.password_required': {
    en: 'Password cannot be empty.',
    vi: 'Mật khẩu không được để trống.'
  },
  'auth.password_min_length': {
    en: 'Password must be at least 6 characters.',
    vi: 'Mật khẩu tối thiểu 6 ký tự.'
  },
  'auth.password_reset_min_length': {
    en: 'Password must be at least 8 characters.',
    vi: 'Mật khẩu phải có ít nhất 8 ký tự.'
  },
  'auth.password_fields_required': {
    en: 'Please fill in all password fields.',
    vi: 'Vui lòng điền đầy đủ các trường mật khẩu.'
  },
  'auth.passwords_do_not_match': {
    en: 'Passwords do not match.',
    vi: 'Mật khẩu xác nhận không khớp.'
  },
  'auth.confirm_password_required': {
    en: 'Please confirm your password.',
    vi: 'Vui lòng xác nhận mật khẩu.'
  },
  'auth.invalid_reset_token': {
    en: 'Reset token is invalid or has expired.',
    vi: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'
  },
  'auth.reset_failed': {
    en: 'Unable to reset password.',
    vi: 'Không thể đặt lại mật khẩu.'
  },
  'auth.send_reset_failed': {
    en: 'Unable to send password reset email.',
    vi: 'Không thể gửi email đặt lại mật khẩu.'
  },
  'auth.unauthorized': {
    en: 'Session expired or unauthorized. Please log in again.',
    vi: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  },
  'auth.forbidden': {
    en: 'You do not have permission to perform this action.',
    vi: 'Bạn không có quyền thực hiện hành động này.'
  },
  'auth.token_invalid': {
    en: 'Authentication token is invalid.',
    vi: 'Mã xác thực không hợp lệ.'
  },
  'auth.token_expired': {
    en: 'Authentication token has expired.',
    vi: 'Mã xác thực đã hết hạn.'
  },
  'auth.google_failed': {
    en: 'Google authentication failed.',
    vi: 'Đăng nhập Google thất bại.'
  },
  'auth.github_failed': {
    en: 'GitHub authentication failed.',
    vi: 'Đăng nhập GitHub thất bại.'
  },
  'auth.facebook_failed': {
    en: 'Facebook authentication failed.',
    vi: 'Đăng nhập Facebook thất bại.'
  },
  'auth.employer_pending_approval': {
    en: 'This employer registration request is pending admin approval.',
    vi: 'Yêu cầu đăng ký nhà tuyển dụng này đang chờ admin phê duyệt.'
  },

  // Jobs & Browse
  'jobs.load_failed': {
    en: 'Unable to load jobs right now.',
    vi: 'Không thể tải danh sách việc làm lúc này.'
  },
  'jobs.detail_load_failed': {
    en: 'Something went wrong while loading the job detail page.',
    vi: 'Có lỗi xảy ra khi tải trang chi tiết công việc.'
  },
  'jobs.not_found': {
    en: 'Job post not found or no longer available.',
    vi: 'Công việc không tồn tại hoặc đã bị xóa.'
  },
  'jobs.already_deleted': {
    en: 'Job post was already deleted.',
    vi: 'Công việc đã được xóa trước đó.'
  },
  'jobs.invalid_salary_min': {
    en: 'Invalid minimum salary.',
    vi: 'Mức lương tối thiểu không hợp lệ.'
  },
  'jobs.invalid_salary_max': {
    en: 'Invalid maximum salary.',
    vi: 'Mức lương tối đa không hợp lệ.'
  },
  'jobs.salary_min_greater_than_max': {
    en: 'Minimum salary cannot exceed maximum salary.',
    vi: 'Mức lương tối thiểu không được lớn hơn mức lương tối đa.'
  },

  // Applications
  'applications.already_applied': {
    en: 'You have already applied for this job.',
    vi: 'Bạn đã ứng tuyển công việc này rồi.'
  },
  'applications.closed': {
    en: 'This job is no longer accepting applications.',
    vi: 'Công việc này hiện không còn nhận hồ sơ ứng tuyển.'
  },
  'applications.not_found': {
    en: 'Application does not exist.',
    vi: 'Hồ sơ ứng tuyển không tồn tại.'
  },
  'applications.cancel_failed': {
    en: 'Failed to cancel application. Please try again later.',
    vi: 'Hủy nộp hồ sơ thất bại. Vui lòng thử lại sau.'
  },
  'applications.upload_cv_failed': {
    en: 'Unable to upload CV at this time. Please try again later.',
    vi: 'Không thể tải lên CV lúc này. Vui lòng thử lại sau.'
  },
  'applications.submit_failed': {
    en: 'Unable to submit application at this time. Please try again later.',
    vi: 'Không thể nộp hồ sơ lúc này. Vui lòng thử lại sau.'
  },

  // Network & System
  'system.network_error': {
    en: 'Network connection error. Please check your internet connection.',
    vi: 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.'
  },
  'system.server_error': {
    en: 'Internal server error. Please try again later.',
    vi: 'Hệ thống máy chủ gặp sự cố. Vui lòng thử lại sau.'
  },
  'system.generic_error': {
    en: 'An error occurred. Please try again.',
    vi: 'Có lỗi xảy ra. Vui lòng thử lại.'
  }
}

const ERROR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  // Auth
  { pattern: /email hoặc mật khẩu không đúng|invalid.*password|invalid.*credentials/i, key: 'auth.invalid_credentials' },
  { pattern: /tài khoản.*đã bị khóa|account.*locked/i, key: 'auth.account_locked' },
  { pattern: /đăng nhập thất bại|login.*failed/i, key: 'auth.login_failed' },
  { pattern: /email.*đã tồn tại|email.*already exists/i, key: 'auth.email_exists' },
  { pattern: /email.*không tồn tại|email.*not exist/i, key: 'auth.email_not_found' },
  { pattern: /email không được để trống|vui lòng nhập email|please enter.*email|email is required/i, key: 'auth.email_required' },
  { pattern: /email không hợp lệ|email không đúng định dạng|invalid email/i, key: 'auth.email_invalid' },
  { pattern: /họ tên không được để trống|full name is required/i, key: 'auth.fullname_required' },
  { pattern: /họ tên phải có ít nhất 2 ký tự|full name must be at least 2/i, key: 'auth.fullname_min_length' },
  { pattern: /mật khẩu không được để trống|password.*cannot be empty|password is required/i, key: 'auth.password_required' },
  { pattern: /mật khẩu tối thiểu 6 ký tự|password.*at least 6/i, key: 'auth.password_min_length' },
  { pattern: /mật khẩu phải có ít nhất 8 ký tự|password.*at least 8/i, key: 'auth.password_reset_min_length' },
  { pattern: /điền đầy đủ các trường mật khẩu|fill in all password/i, key: 'auth.password_fields_required' },
  { pattern: /mật khẩu.*không khớp|passwords do not match/i, key: 'auth.passwords_do_not_match' },
  { pattern: /vui lòng xác nhận mật khẩu|confirm your password/i, key: 'auth.confirm_password_required' },
  { pattern: /token.*không hợp lệ|token.*invalid/i, key: 'auth.token_invalid' },
  { pattern: /token.*đã hết hạn|token.*expired/i, key: 'auth.token_expired' },
  { pattern: /token.*không tồn tại|reset token does not exist/i, key: 'auth.invalid_reset_token' },
  { pattern: /không thể đặt lại mật khẩu|unable to reset password/i, key: 'auth.reset_failed' },
  { pattern: /không thể gửi email đặt lại|unable to send password reset/i, key: 'auth.send_reset_failed' },
  { pattern: /đang chờ admin duyệt|pending admin approval/i, key: 'auth.employer_pending_approval' },

  // Jobs
  { pattern: /job khong ton tai|job không tồn tại|job not found/i, key: 'jobs.not_found' },
  { pattern: /da duoc xoa mem|already deleted/i, key: 'jobs.already_deleted' },
  { pattern: /salarymin khong hop le|invalid min.*salary/i, key: 'jobs.invalid_salary_min' },
  { pattern: /salarymax khong hop le|invalid max.*salary/i, key: 'jobs.invalid_salary_max' },
  { pattern: /salarymin khong duoc lon hon|salarymin.*greater than/i, key: 'jobs.salary_min_greater_than_max' },
  { pattern: /unable to load jobs|không thể tải danh sách/i, key: 'jobs.load_failed' },
  { pattern: /something went wrong while loading the job detail|lỗi.*trang chi tiết/i, key: 'jobs.detail_load_failed' },

  // Applications
  { pattern: /da ung tuyen.*roi|already applied/i, key: 'applications.already_applied' },
  { pattern: /khong con mo de ung tuyen|no longer accepting/i, key: 'applications.closed' },
  { pattern: /ung tuyen khong ton tai|application does not exist/i, key: 'applications.not_found' },
  { pattern: /failed to cancel application|hủy.*thất bại/i, key: 'applications.cancel_failed' },
  { pattern: /unable to upload cv|không thể tải.*cv/i, key: 'applications.upload_cv_failed' },
  { pattern: /unable to submit application|không thể nộp hồ sơ/i, key: 'applications.submit_failed' },

  // Network & System
  { pattern: /network error|err_network|err_connection_refused|failed to fetch/i, key: 'system.network_error' },
  { pattern: /server error|lỗi máy chủ|internal server error/i, key: 'system.server_error' }
]

export const getCurrentLanguage = (): SupportedLanguage => {
  const lang = i18n.language || 'en'
  return lang.startsWith('vi') ? 'vi' : 'en'
}

export const formatLocalizedError = (errorOrMessage: unknown, explicitLang?: SupportedLanguage): string => {
  const currentLang = explicitLang || getCurrentLanguage()

  let rawMessage = ''
  if (typeof errorOrMessage === 'string') {
    rawMessage = errorOrMessage
  } else if (axios.isAxiosError(errorOrMessage)) {
    const data = errorOrMessage.response?.data as { message?: string | string[] } | undefined
    if (data?.message) {
      rawMessage = Array.isArray(data.message) ? data.message.join('; ') : data.message
    } else {
      const status = errorOrMessage.response?.status
      if (status === 401) return ERROR_DICTIONARY['auth.unauthorized'][currentLang]
      if (status === 403) return ERROR_DICTIONARY['auth.forbidden'][currentLang]
      if (status && status >= 500) return ERROR_DICTIONARY['system.server_error'][currentLang]
      rawMessage = errorOrMessage.message || ''
    }
  } else if (errorOrMessage instanceof Error) {
    rawMessage = errorOrMessage.message
  }

  if (!rawMessage) {
    return ERROR_DICTIONARY['system.generic_error'][currentLang]
  }

  // 1. Direct key lookup
  if (ERROR_DICTIONARY[rawMessage]) {
    return ERROR_DICTIONARY[rawMessage][currentLang]
  }

  // 2. Pattern matching
  for (const { pattern, key } of ERROR_PATTERNS) {
    if (pattern.test(rawMessage)) {
      return ERROR_DICTIONARY[key][currentLang]
    }
  }

  return rawMessage
}

export const logLocalizedError = (context: string, error: unknown, level: 'error' | 'warn' | 'info' = 'error') => {
  const currentLang = getCurrentLanguage()
  const localizedMsg = formatLocalizedError(error, currentLang)

  const prefix = currentLang === 'vi' ? `[${context} - Lỗi]` : `[${context} - Error]`
  if (level === 'warn') {
    console.warn(`${prefix} ${localizedMsg}`, error)
  } else if (level === 'info') {
    console.info(`${prefix} ${localizedMsg}`)
  } else {
    console.error(`${prefix} ${localizedMsg}`, error)
  }
}
