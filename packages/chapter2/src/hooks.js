export function createHooks(callback) {
  let states = []
  let stateIndex = 0
  const memorizedStates = []
  let cursor = 0

  const useState = (initState) => {
    if (!states[stateIndex]) {
      states[stateIndex] = initState // 초기값 설정
    }

    const currentIndex = stateIndex // 현재 상태 인덱스 저장

    const setState = (newValue) => {
      if (states[currentIndex] !== newValue) {
        states[currentIndex] = newValue // 상태 업데이트
        callback() // 콜백 실행
      }
    }

    stateIndex++ // 상태 인덱스 증가

    return [states[currentIndex], setState] // 상태 값과 setter 반환
  }

  function useMemo(nextCreate, deps) {
    if (!memorizedStates[cursor]) {
      const nextValue = nextCreate()
      memorizedStates[cursor] = [nextValue, deps]
      cursor++
      return nextValue
    }

    const nextDeps = deps
    const [prevValue, prevDeps] = memorizedStates[cursor]
    if (prevDeps.every((prev, idx) => prev === nextDeps[idx])) {
      cursor++
      return prevValue
    }

    const nextValue = nextCreate()
    memorizedStates[cursor] = [nextValue, nextDeps]
    cursor++
    return nextValue
  }

  const resetContext = () => {
    stateIndex = 0
    cursor = 0
  }

  return { useState, useMemo, resetContext }
}
