const QUICK_LOSS_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 50, 70]

function calculateRecovery(lossValue) {
  return (1 / (1 - lossValue / 100) - 1) * 100
}

function formatRecovery(lossValue) {
  return `${calculateRecovery(lossValue).toFixed(2)}%`
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
    sanitized = `0${sanitized}`
  }

  const hasDot = sanitized.includes('.')
  const parts = sanitized.split('.')
  const integerPart = parts[0] || ''
  const decimalPart = parts[1] || ''
  const limitedDecimalPart = decimalPart.slice(0, 2)
  const hasExtraDecimalDigits = decimalPart.length > limitedDecimalPart.length

  if (hasDot) {
    sanitized = `${integerPart}.${limitedDecimalPart}`
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

Page({
  hintTimer: null,

  data: {
    statusBarHeight: 20,
    navContentHeight: 44,
    headerOffset: 108,
    pageBottomPadding: 32,
    inputValue: '',
    state: 'empty',
    isInputFocused: false,
    resultNumber: '0.00',
    resultUnit: '%',
    resultFontClass: '',
    selectedLoss: '',
    inlineHint: '',
    quickReferenceList: QUICK_LOSS_VALUES.map((loss) => ({
      loss: String(loss),
      recovery: formatRecovery(loss)
    }))
  },

  onLoad() {
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const menuButton = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    const statusBarHeight = windowInfo.statusBarHeight || 20
    const safeArea = windowInfo.safeArea || null
    const bottomInset = safeArea ? Math.max(windowInfo.windowHeight - safeArea.bottom, 0) : 0
    const navContentHeight = menuButton
      ? menuButton.height + Math.max((menuButton.top - statusBarHeight) * 2, 12)
      : 44

    this.setData({
      statusBarHeight,
      navContentHeight,
      headerOffset: statusBarHeight + navContentHeight + 24,
      pageBottomPadding: bottomInset + 28
    })
  },

  onUnload() {
    this.clearHintTimer()
  },

  handleFocus() {
    this.setData({
      isInputFocused: true
    })
  },

  handleBlur() {
    this.setData({
      isInputFocused: false
    })
  },

  handleInput(event) {
    const { value, hint } = sanitizeInput(event.detail.value)

    this.applyInputValue(value)

    if (hint) {
      this.showInlineHint(hint)
      return
    }

    this.clearInlineHint()
  },

  handleQuickSelect(event) {
    const loss = String(event.currentTarget.dataset.loss)

    this.applyInputValue(loss)
    this.clearInlineHint()
  },

  handleClear() {
    this.clearHintTimer()
    this.setData({
      inputValue: '',
      state: 'empty',
      resultNumber: '0.00',
      resultUnit: '%',
      resultFontClass: '',
      selectedLoss: '',
      inlineHint: ''
    })
  },

  applyInputValue(inputValue) {
    if (!inputValue) {
      this.setData({
        inputValue: '',
        state: 'empty',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      })
      return
    }

    const numericValue = Number.parseFloat(inputValue)

    if (Number.isNaN(numericValue)) {
      this.setData({
        inputValue,
        state: 'empty',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      })
      return
    }

    if (numericValue >= 100) {
      this.setData({
        inputValue,
        state: 'abnormal',
        resultNumber: '0.00',
        resultUnit: '%',
        resultFontClass: '',
        selectedLoss: ''
      })
      return
    }

    const resultNumber = calculateRecovery(numericValue).toFixed(2)

    this.setData({
      inputValue,
      state: 'normal',
      resultNumber,
      resultUnit: '%',
      resultFontClass: getResultFontClass(resultNumber),
      selectedLoss: getSelectedLoss(inputValue, numericValue)
    })
  },

  showInlineHint(message) {
    this.clearHintTimer()
    this.setData({
      inlineHint: message
    })

    this.hintTimer = setTimeout(() => {
      this.setData({
        inlineHint: ''
      })
      this.hintTimer = null
    }, 1600)
  },

  clearInlineHint() {
    if (!this.data.inlineHint) {
      return
    }

    this.clearHintTimer()
    this.setData({
      inlineHint: ''
    })
  },

  clearHintTimer() {
    if (!this.hintTimer) {
      return
    }

    clearTimeout(this.hintTimer)
    this.hintTimer = null
  }
})
