export const useCurrentWeek = () => {
  function isDateInCurrentWeek(date: Date): boolean {
    const now = new Date()

    const startOfWeek = new Date(now)
    const dayOfWeek = now.getDay() // 0-dimance 1-lundi 2-mardi ...
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startOfWeek.setDate(now.getDate() - daysSinceMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return date >= startOfWeek && date <= endOfWeek
  }

  return { isDateInCurrentWeek }
}
