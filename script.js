const buttons = document.querySelectorAll('button')
const historyInput = document.getElementById('history')
const resultInput = document.getElementById('result')
const clearButton = document.getElementById('clear')

let currentOperation = ''
let result = ''

let clearNextInput = false

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    clickButton(button.id)
    updateButtonC()
    button.blur()
  })
})

function clickButton (buttonId) {
  if (clearNextInput) {
    currentOperation = ''
    result = ''
    deleteHistory()
    clearNextInput = false
    updateResult()
  }

  const values = {
    'num-0': '0',
    'num-1': '1',
    'num-2': '2',
    'num-3': '3',
    'num-4': '4',
    'num-5': '5',
    'num-6': '6',
    'num-7': '7',
    'num-8': '8',
    'num-9': '9',
    decimal: '.',
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
    percent: '%'
  }

  if (values[buttonId] !== undefined) {
    const newChar = values[buttonId]

    if (isOperator(newChar) && isOperator(lastChar())) {
      currentOperation = currentOperation.slice(0, -1) + newChar
    } else if (newChar === '.') {
      if (!canAddDecimal()) return
      const lastCharValue = lastChar()
      if (lastCharValue === '' || isOperator(lastCharValue)) {
        currentOperation += '0.'
      } else {
        currentOperation += '.'
      }
    } else {
      currentOperation += newChar
    }
    updateResult()
    return
  }

  switch (buttonId) {
    case 'clear':
      buttonClear()
      break
    case 'delete':
      buttonDelete()
      break
    case 'equals':
      buttonEquals()
      break
  }
}

function updateResult () {
  resultInput.value = currentOperation
}

function updateHistory () {
  historyInput.value = currentOperation
}

function deleteHistory () {
  historyInput.value = ''
}

function buttonClear () {
  if (clearButton.textContent === 'AC') {
    deleteHistory()
  }
  currentOperation = ''
  result = ''
  updateResult()
}

function buttonDelete () {
  if (currentOperation.length > 0) {
    currentOperation = currentOperation.slice(0, -1)
    updateResult()
  }
}

function buttonEquals () {
  try {
    if (lastChar() === '.') {
      currentOperation = currentOperation.slice(0, -1)
    } else if (isOperator(lastChar())) {
      addZeroToLastPart()
    }
    /* eslint-disable-next-line no-eval */
    result = eval(currentOperation)
    updateHistory()
    currentOperation = result.toString()
    updateResult()
  } catch (error) {
    alert('Error en la operación: ' + error.message)
    currentOperation = 'Syntax Error'
    result = ''
    clearNextInput = true
    updateResult()
  }
}

function updateButtonC () {
  if (currentOperation === '') {
    clearButton.textContent = 'AC'
  } else {
    clearButton.textContent = 'C'
  }
}

function isOperator (char) {
  return ['+', '-', '*', '/', '%'].includes(char)
}

function lastChar () {
  return currentOperation[currentOperation.length - 1] || ''
}

function canAddDecimal () {
  const parts = currentOperation.split(/[+\-*/%]/)
  const lastPart = parts[parts.length - 1]
  return !lastPart.includes('.')
}

function addZeroToLastPart () {
  currentOperation += '0'
  updateResult()
}

document.addEventListener('keydown', (e) => {
  if (
    [
      'Backspace',
      'Enter',
      'Escape',
      'c',
      'C',
      '+',
      '-',
      '*',
      '/',
      '.',
      '%'
    ].includes(e.key) ||
    !isNaN(e.key)
  ) {
    e.preventDefault()
  }
  handleKeyboardInput(e.key)
})

function handleKeyboardInput (key) {
  const keyMap = {
    0: 'num-0',
    1: 'num-1',
    2: 'num-2',
    3: 'num-3',
    4: 'num-4',
    5: 'num-5',
    6: 'num-6',
    7: 'num-7',
    8: 'num-8',
    9: 'num-9',
    '.': 'decimal',
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'percent',
    Enter: 'equals',
    '=': 'equals',
    Backspace: 'delete',
    Escape: 'clear',
    c: 'clear',
    C: 'clear'
  }

  const buttonId = keyMap[key]
  if (buttonId) {
    clickButton(buttonId)
    updateButtonC()
  }
}
