// 64卦名称表（行：上卦索引，列：下卦索引）
const guaNames = [
	["坤为地", "地山谦", "地水师", "地风升", "地雷复", "地火明夷", "地泽临", "地天泰"],
	["山地剥", "艮为山", "山火贲", "山风蛊", "山雷颐", "山火贲", "山泽损", "山天大畜"],
	["水地比", "水山蹇", "坎为水", "水风井", "水雷屯", "水火既济", "水泽节", "水天需"],
	["风地观", "风山渐", "风水涣", "巽为风", "风雷益", "风火家人", "风泽中孚", "风天小畜"],
	["雷地豫", "雷山小过", "雷水解", "雷风恒", "震为雷", "雷火丰", "雷泽归妹", "雷天大壮"],
	["火地晋", "火山旅", "火水未济", "火风鼎", "火雷噬嗑", "离为火", "火泽睽", "火天大有"],
	["泽地萃", "泽山咸", "泽水困", "泽风大过", "泽雷随", "泽火革", "兑为泽", "泽天夬"],
	["天地否", "天山遁", "天水讼", "天风姤", "天雷无妄", "天火同人", "天泽履", "乾为天"]
]
guaNames[1][5] = "山火贲"
guaNames[1][6] = "山泽损"
guaNames[1][7] = "山天大畜"

function throwCoins() {
	let sum = 0
	for (let i = 0; i < 3; i++) {
		sum += Math.random() < 0.5 ? 3 : 2
	}
	return sum
}

export function divine() {
	const scores = []
	const yaos = []
	const changes = []
	for (let i = 0; i < 6; i++) {
		const sum = throwCoins()
		scores.push(sum)
		if (sum === 6) {
			yaos.push(0)
			changes.push(true)
		} else if (sum === 9) {
			yaos.push(1)
			changes.push(true)
		} else if (sum === 7) {
			yaos.push(1)
			changes.push(false)
		} else {
			yaos.push(0)
			changes.push(false)
		}
		const index = i + 1
	}

	const lowerIdx = (yaos[0] << 2) | (yaos[1] << 1) | yaos[2]
	const upperIdx = (yaos[3] << 2) | (yaos[4] << 1) | yaos[5]
	const benGua = guaNames[upperIdx][lowerIdx]

	const hasChange = changes.some(v => v === true)
	let bianGua = null
	const changeList = []

	if (hasChange) {
		const newYaos = []
		for (let i = 0; i < 6; i++) {
			if (changes[i]) {
				newYaos.push(1 - yaos[i])
				const type = yaos[i] === 1 ? "老阳变阴" : "老阴变阳"
				changeList.push({
					position: i + 1,
					type
				})
			} else {
				newYaos.push(yaos[i])
			}
		}
		const lowerNew = (newYaos[0] << 2) | (newYaos[1] << 1) | newYaos[2]
		const upperNew = (newYaos[3] << 2) | (newYaos[4] << 1) | newYaos[5]
		bianGua = guaNames[upperNew][lowerNew]
	}

	return {
		scores,
		yaos,
		changes,
		benGua,
		bianGua,
		changeList
	}
}

export function makePureLines(yaos) {
	return yaos.map(y => y === 1 ? "——————" : "——  ——")
	// return yaos.map(y => y === 1 ? "======" : "==  ==")
}

export function getScoreLines(scores) {
	return scores.map(s => s.toString())
}

export function makePrompt(benGua, bianGua, changeList) {
	let prompt = "你是专业的易经大师和命理师，请你为我解释我刚占卜出来卦象："
	if (!bianGua) {
		prompt += `从“${benGua}”没有变卦，无需考虑变爻。`
	} else {
		prompt += `从“${benGua}”变卦成“${bianGua}”，`
		if (changeList.length === 1) {
			const c = changeList[0]
			prompt += `其中变卦的爻辞是整个爻辞从下往上数第${c.position}爻辞都是${c.type}。`
		} else {
			prompt += `其中变卦的爻辞是整个爻辞从下往上数第`
			changeList.forEach((c, idx) => {
				if (idx > 0) prompt += "、"
				prompt += c.position
			})
			prompt += `爻辞分别：`
			changeList.forEach((c, idx) => {
				if (idx > 0) prompt += "，"
				prompt += `${c.position}爻${c.type}`
			})
			prompt += `。`
		}
	}
	prompt += "请你解释这个卦象，并用大白话解释其中的专用名词,务必通俗易懂.不考虑其他各种因素,只解读卦象."
	return prompt
}