// Formata o número de telefone para exibição
export const formatPhone = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

// Remove a formatação do número de telefone
export const cleanPhone = (value) => {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

// Verifica se o telefone está no formato correto
export const isValidPhone = (phone) => {
  const cleaned = cleanPhone(phone)
  return cleaned.length === 11 || cleaned.length === 0
}
