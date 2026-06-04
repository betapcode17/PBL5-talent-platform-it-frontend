export type InterviewCalendarPayload = {
  id: number
  schedule: string
  endTime: string
  type: string
  link?: string | null
  company: { name: string }
  job: { title: string }
  interviewer: { fullName?: string | null }
}

const formatCalendarDate = (value: Date) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

const buildInterviewDescription = (interview: InterviewCalendarPayload) =>
  [
    `Company: ${interview.company.name}`,
    `Job: ${interview.job.title}`,
    `Interviewer: ${interview.interviewer.fullName || 'Interviewer'}`,
    `Type: ${interview.type}`,
    interview.link ? `Link: ${interview.link}` : null
  ]
    .filter(Boolean)
    .join('\\n')

export const downloadInterviewCalendarFile = (interview: InterviewCalendarPayload) => {
  const startDate = new Date(interview.schedule)
  const endDate = new Date(interview.endTime)
  const description = buildInterviewDescription(interview)
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PBL5//Seeker Interview Reminder//EN',
    'BEGIN:VEVENT',
    `UID:seeker-interview-${interview.id}@pbl5`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(startDate)}`,
    `DTEND:${formatCalendarDate(endDate)}`,
    `SUMMARY:${interview.job.title} Interview`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  const fileName = `interview-${interview.id}.ics`
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)

  return fileName
}

export const buildGoogleCalendarUrl = (interview: InterviewCalendarPayload) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${interview.job.title} Interview`,
    dates: `${formatCalendarDate(new Date(interview.schedule))}/${formatCalendarDate(new Date(interview.endTime))}`,
    details: buildInterviewDescription(interview).replace(/\\n/g, '\n'),
    location: interview.link || interview.company.name
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
