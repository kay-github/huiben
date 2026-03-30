(function (factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory()
    return
  }

  window.HuibenCalculatorWeb = factory()
}(function () {
  const QUICK_LOSS_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 50, 70]

  function calculateRecovery(lossValue) {
    return (1 / (1 - lossValue / 100) - 1) * 100
  }

  function formatRecovery(lossValue) {
    return calculateRecovery(lossValue).toFixed(2) + '%'
  }

  function sanitizeInput(value) {
    const source = String(value || '')
    const stripped = source.replace(/[^\d.]/g, '')
    let dotSeen = false
    let sanitized = ''
    let hasExtraDot = false

    for (let index = 0; index < stripped.length; index += 1) {
      const char = stripped[index]

      if (char === '.') {
        if (!dotSeen) {
          dotSeen = true
          sanitized += char
        } else {
          hasExtraDot = true
        }
        continue
      }

      sanitized += char
    }

    if (sanitized.startsWith('.')) {
      sanitized = '0' + sanitized
    }

    const hasDot = sanitized.includes('.')
    const parts = sanitized.split('.')
    const integerPart = parts[0] || ''
    const decimalPart = parts[1] || ''
    const limitedDecimalPart = decimalPart.slice(0, 2)
    const hasExtraDecimalDigits = decimalPart.length > limitedDecimalPart.length

    if (hasDot) {
      sanitized = integerPart + '.' + limitedDecimalPart
    }

    return {
      value: sanitized,
      hint: hasExtraDecimalDigits
        ? '最多保留两位小数'
        : (stripped !== source || hasExtraDot ? '已自动忽略无效字符' : '')
    }
  }

  function getResultFontClass(resultNumber) {
    if (resultNumber.length >= 9) {
      return 'result-number--small'
    }

    if (resultNumber.length >= 7) {
      return 'result-number--compact'
    }

    return ''
  }

  function getSelectedLoss(inputValue, numericValue) {
    if (!inputValue || inputValue.endsWith('.')) {
      return ''
    }

    return QUICK_LOSS_VALUES.includes(numericValue) ? String(numericValue) : ''
  }

  function getDisplayState(inputValue) {
    if (!inputValue) {
      return {
        state: 'empty',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      }
    }

    const numericValue = Number.parseFloat(inputValue)

    if (Number.isNaN(numericValue)) {
      return {
        state: 'empty',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      }
    }

    if (numericValue >= 100) {
      return {
        state: 'abnormal',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      }
    }

    const resultNumber = calculateRecovery(numericValue).toFixed(2)

    return {
      state: 'normal',
      resultNumber: resultNumber,
      resultUnit: '%',
      resultFontClass: getResultFontClass(resultNumber),
      selectedLoss: getSelectedLoss(inputValue, numericValue)
    }
  }

  function buildQuickReferenceList() {
    return QUICK_LOSS_VALUES.map(function (loss) {
      return {
        loss: String(loss),
        recovery: formatRecovery(loss)
      }
    })
  }

  function createApp(doc) {
    if (!doc) {
      return null
    }

    const inputPanel = doc.getElementById('inputPanel')
    const lossInput = doc.getElementById('lossInput')
    const clearAction = doc.getElementById('clearAction')
    const inlineHint = doc.getElementById('inlineHint')
    const resultValue = doc.getElementById('resultValue')
    const resultNumber = doc.getElementById('resultNumber')
    const resultUnit = doc.getElementById('resultUnit')
    const abnormalState = doc.getElementById('abnormalState')
    const quickGrid = doc.getElementById('quickGrid')

    if (!inputPanel || !lossInput || !clearAction || !inlineHint || !resultValue || !resultNumber || !resultUnit || !abnormalState || !quickGrid) {
      return null
    }

    const runtime = typeof window !== 'undefined' ? window : globalThis
    let hintTimer = null
    let currentInputValue = ''
    let currentSelectedLoss = ''

    const quickReferenceList = buildQuickReferenceList()

    quickReferenceList.forEach(function (item) {
      const button = doc.createElement('button')
      const loss = doc.createElement('span')
      const recovery = doc.createElement('span')

      button.type = 'button'
      button.className = 'quick-item'
      button.dataset.loss = item.loss

      loss.className = 'quick-loss'
      loss.textContent = '跌 ' + item.loss + '%'
      recovery.className = 'quick-result'
      recovery.textContent = item.recovery

      button.appendChild(loss)
      button.appendChild(recovery)
      button.addEventListener('click', function () {
        lossInput.value = item.loss
        applyInputValue(item.loss)
        clearInlineHint()
      })

      quickGrid.appendChild(button)
    })

    function updateQuickSelection(selectedLoss) {
      const quickItems = quickGrid.querySelectorAll('.quick-item')

      quickItems.forEach(function (item) {
        item.classList.toggle('quick-item--active', item.dataset.loss === selectedLoss)
      })
    }

    function showInlineHint(message) {
      clearHintTimer()
      inlineHint.textContent = message
      inlineHint.classList.remove('is-hidden')

      hintTimer = runtime.setTimeout(function () {
        inlineHint.textContent = ''
        inlineHint.classList.add('is-hidden')
        hintTimer = null
      }, 1600)
    }

    function clearHintTimer() {
      if (!hintTimer) {
        return
      }

      runtime.clearTimeout(hintTimer)
      hintTimer = null
    }

    function clearInlineHint() {
      clearHintTimer()
      inlineHint.textContent = ''
      inlineHint.classList.add('is-hidden')
    }

    function renderState(displayState) {
      clearAction.classList.toggle('is-hidden', !currentInputValue)
      currentSelectedLoss = displayState.selectedLoss
      updateQuickSelection(currentSelectedLoss)

      if (displayState.state === 'abnormal') {
        resultValue.classList.add('is-hidden')
        abnormalState.classList.remove('is-hidden')
        return
      }

      abnormalState.classList.add('is-hidden')
      resultValue.classList.remove('is-hidden')

      if (displayState.state === 'empty') {
        resultValue.className = 'result-value result-value--placeholder'
        resultNumber.className = 'result-number result-number--placeholder'
        resultUnit.className = 'result-unit result-unit--placeholder'
        resultNumber.textContent = '--.--'
        resultUnit.textContent = '%'
        return
      }

      resultValue.className = 'result-value'
      resultNumber.className = 'result-number' + (displayState.resultFontClass ? ' ' + displayState.resultFontClass : '')
      resultUnit.className = 'result-unit'
      resultNumber.textContent = displayState.resultNumber
      resultUnit.textContent = displayState.resultUnit
    }

    function applyInputValue(inputValue) {
      currentInputValue = inputValue
      renderState(getDisplayState(inputValue))
    }

    function handleInput(event) {
      const sanitized = sanitizeInput(event.target.value)

      lossInput.value = sanitized.value
      applyInputValue(sanitized.value)

      if (sanitized.hint) {
        showInlineHint(sanitized.hint)
        return
      }

      clearInlineHint()
    }

    function handleFocus() {
      inputPanel.classList.add('input-panel--focus')
    }

    function handleBlur() {
      inputPanel.classList.remove('input-panel--focus')
    }

    function handleClear() {
      clearInlineHint()
      lossInput.value = ''
      applyInputValue('')
    }

    lossInput.addEventListener('input', handleInput)
    lossInput.addEventListener('focus', handleFocus)
    lossInput.addEventListener('blur', handleBlur)
    clearAction.addEventListener('click', handleClear)

    applyInputValue('')

    return {
      applyInputValue: applyInputValue,
      clearInlineHint: clearInlineHint,
      handleClear: handleClear,
      sanitizeInput: sanitizeInput,
      getDisplayState: getDisplayState
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        createApp(document)
      })
    } else {
      createApp(document)
    }
  }

  return {
    QUICK_LOSS_VALUES: QUICK_LOSS_VALUES,
    calculateRecovery: calculateRecovery,
    formatRecovery: formatRecovery,
    sanitizeInput: sanitizeInput,
    getResultFontClass: getResultFontClass,
    getSelectedLoss: getSelectedLoss,
    getDisplayState: getDisplayState,
    buildQuickReferenceList: buildQuickReferenceList,
    createApp: createApp
  }
}))
