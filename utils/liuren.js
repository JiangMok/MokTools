const GUA_NAMES = ['大安', '留连', '速喜', '赤口', '小吉', '空亡']

export function generateLiuren() {
  const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 12) + 1)
  let currentIndex = 0
  const steps = []
  const landings = []

  numbers.forEach((number, index) => {
    const from = GUA_NAMES[currentIndex]
    currentIndex = (currentIndex + number - 1) % GUA_NAMES.length
    const to = GUA_NAMES[currentIndex]
    landings.push(to)
    steps.push(`第${index + 1}个数 ${number}：从${from}数${number}位 → ${to}`)
  })

  return { numbers, steps, landings, final: GUA_NAMES[currentIndex] }
}
