const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

const parseSalaryValue = (value: string) => {
  const normalized = value.toLowerCase().trim()
  const isMillionUnit = normalized.includes('m') || normalized.includes('trieu') || normalized.includes('triệu')
  const isThousandUnit = normalized.includes('k')
  const numericText = isMillionUnit || isThousandUnit
    ? normalized.match(/\d+(?:[.,]\d+)?/)?.[0].replace(',', '.')
    : normalized.replace(/[^\d]/g, '')
  const numericValue = Number(numericText)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null
  }

  if (isThousandUnit) {
    return numericValue * 1_000
  }

  if (isMillionUnit) {
    return numericValue * 1_000_000
  }

  return numericValue
}

const formatVndAmount = (value: number) => {
  if (value >= 1_000_000 && value % 1_000_000 === 0) {
    return `${VND_FORMATTER.format(value / 1_000_000)} triệu`
  }

  return VND_FORMATTER.format(value)
}

export const formatSalaryDisplay = (salary?: string | null) => {
  const rawSalary = salary?.trim()

  if (!rawSalary) {
    return null
  }

  if (/[$€£]|usd|eur|gbp/i.test(rawSalary)) {
    return rawSalary
  }

  const parts = rawSalary
    .split(/\s*[-–—]\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 1) {
    const value = parseSalaryValue(parts[0])
    return value ? `${formatVndAmount(value)} VND` : rawSalary
  }

  const [min, max] = parts.map(parseSalaryValue)

  if (!min && !max) {
    return rawSalary
  }

  if (min && max) {
    return `${formatVndAmount(min)} - ${formatVndAmount(max)} VND`
  }

  return min ? `Từ ${formatVndAmount(min)} VND` : `Đến ${formatVndAmount(max as number)} VND`
}
