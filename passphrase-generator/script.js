const wordsRange = document.querySelector('.words-range');
const wordsQuantity = document.querySelector('.words-quantity');

wordsRange.addEventListener('input', function () {
  const value = this.value;
  const min = this.min;
  const max = this.max;

  const percentage = ((value - min) / (max - min)) * 100;

  this.style.background = `linear-gradient(to right, #0D3A7D ${percentage}%, #DBDBDB ${percentage}%)`;

  wordsQuantity.textContent = `${value} words`;
});

function generateKeys(length) {
  const keys = new Set();
  while (keys.size < length) {
    const randomValues = new Uint8Array(5);
    crypto.getRandomValues(randomValues);
    let key = '';
    for (let j = 0; j < 5; j++) {
      key += (randomValues[j] % 6) + 1;
    }
    keys.add(key);
  }
  return Array.from(keys);
}

function calculateStrength(passphrase, numOfWords, wordsType, plusNumbers) {
  let strength = 0;

  let passphraseString = passphrase;
  if (Array.isArray(passphrase)) {
    const separator = document.querySelector('input[name="separator"]:checked')?.value || '-';
    passphraseString = passphrase.join(separator);
  } else if (typeof passphrase !== 'string') {
    console.error('Invalid passphrase type:', typeof passphrase);
    return 0;
  }

  const length = passphraseString.length;

  if (numOfWords >= 7) strength += 30;
  else if (numOfWords >= 5) strength += 20;
  else strength += 10;

  if (length > 20) strength += 30;
  else if (length > 12) strength += 20;
  else strength += 10;

  if (wordsType === 'capitals' || wordsType === 'uppercase') strength += 20;
  if (plusNumbers) strength += 10;

  const separator = document.querySelector('input[name="separator"]:checked')?.value || '-';
  const words = passphraseString.split(separator);
  const hasSpecialChar = words.some(word => /[!?.]/.test(word));
  if (hasSpecialChar) strength += 10;

  return strength;
}

async function getPassphrase(lang) {
  const wordsRange = document.querySelector('.words-range');
  const numOfWords = Number(wordsRange.value);
  const separator = document.querySelector('input[name="separator"]:checked')?.value || '-';
  const wordsType = document.querySelector('input[name="text-option"]:checked')?.value || 'default';
  const plusNumbers = document.querySelector('input[name="num-option"]:checked');

  try {
    const module = await import(`/lists/${lang}.js`);
    const list = module.list;

    if (!list || typeof list !== 'object') {
      throw new Error(`Invalid or missing word list in /lists/${lang}.js`);
    }

    const keys = generateKeys(numOfWords);
    const passphrase = [];
    const usedKeys = new Set();

    for (let key of keys) {
      let attempts = 0;
      const maxAttempts = 1000;
      let currentKey = key;

      while (attempts < maxAttempts) {
        if (
          typeof list[currentKey] === 'string' &&
          /^[а-яА-Яa-zA-Z]+$/.test(list[currentKey]) &&
          list[currentKey].length >= 3
        ) {
          passphrase.push(list[currentKey]);
          usedKeys.add(currentKey);
          break;
        }

        const randomValues = new Uint8Array(5);
        crypto.getRandomValues(randomValues);
        currentKey = '';
        for (let j = 0; j < 5; j++) {
          currentKey += (randomValues[j] % 6) + 1;
        }

        if (usedKeys.has(currentKey)) {
          attempts++;
          continue;
        }

        usedKeys.add(currentKey);
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error(`Could not find a valid word for key ${key} after ${maxAttempts} attempts`);
      }
    }

    const passphraseOutput = document.getElementById('passphrase');

    if (!passphraseOutput) {
      throw new Error('Passphrase output element not found in the DOM');
    }

    let formattedPassphrase = passphrase.map(word => {
      switch (wordsType) {
        case 'uppercase':
          return word.toUpperCase();
        case 'lowercase':
          return word.toLowerCase();
        case 'capitals':
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        default:
          return word;
      }
    });

    if (plusNumbers) {
      const randomIndex = Math.floor(Math.random() * formattedPassphrase.length);
      const randomValue = crypto.getRandomValues(new Uint8Array(1))[0] % 100;
      formattedPassphrase[randomIndex] = `${formattedPassphrase[randomIndex]}${randomValue}`;
    }

    const joinedPassphrase = formattedPassphrase.join(separator);
    passphraseOutput.innerText = joinedPassphrase;

    const passphraseHide = document.getElementById('passphraseHide');
    if (passphraseHide) {
      passphraseHide.classList.add('blue');
    }
    delete passphraseOutput.dataset.originalText;

    const strength = calculateStrength(joinedPassphrase, numOfWords, wordsType, plusNumbers);
    const strengthBar = document.getElementById('strengthBar');
    const strengthTitle = document.getElementById('strengthTitle');
    if (strength >= 70) {
      strengthBar.style.width = '100%';
      strengthBar.className = 'strength-very-strong';
      strengthTitle.innerHTML = `
        <span class="strength-icon very-strong">✓</span>
        Very Strong
        `;
    } else if (strength >= 60) {
      strengthBar.style.width = '70%';
      strengthBar.className = 'strength-strong';
      strengthTitle.innerHTML = `
        <span class="strength-icon strong">✓</span>
        Strong
        `;
    } else if (strength >= 50) {
      strengthBar.style.width = '50%';
      strengthBar.className = 'strength-good';
      strengthTitle.innerHTML = `
        <span class="strength-icon good">✓</span>
        Good
        `;
    } else {
      strengthBar.style.width = '30%';
      strengthBar.className = 'strength-weak';
      strengthTitle.innerHTML = `
        <span class="strength-icon weak">-</span>
        Weak
        `;
    }

    return formattedPassphrase;
  } catch (error) {
    console.error('Error generating passphrase:', error.message);
    alert('Ошибка генерации пароля: ' + error.message);
    return null;
  }
}

const generateBtn = document.getElementById('generateBtn');

if (generateBtn) {
  generateBtn.addEventListener('click', () => {
    const language = 'english';
    generateBtn.classList.add('spin')

    setTimeout(() => {
      generateBtn.classList.remove('spin');
      getPassphrase(language);
    }, 300)
  });
} else {
  console.error('Generate button not found in the DOM');
}

const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const passphraseOutput = document.getElementById('passphrase');

    if (passphraseOutput) {
      try {
        const passphrase = passphraseOutput.dataset.originalText || passphraseOutput.textContent;
        await navigator.clipboard.writeText(passphrase);

        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.classList.remove('copied')
        }, 600);

      } catch (error) {
        console.error('Copy error:', error);
      }
    }
  });
}

const passphraseHide = document.getElementById('passphraseHide');

if (passphraseHide) {
  passphraseHide.classList.add('blue');

  passphraseHide.addEventListener('click', () => {
    const passphraseOutput = document.getElementById('passphrase');

    if (passphraseOutput) {
      if (passphraseHide.classList.contains('blue')) {
        passphraseOutput.dataset.originalText = passphraseOutput.textContent;
        const length = passphraseOutput.textContent.length;
        passphraseOutput.textContent = '*'.repeat(length);
        passphraseHide.classList.remove('blue');
      } else {
        passphraseOutput.textContent = passphraseOutput.dataset.originalText || '';
        passphraseHide.classList.add('blue');
      }
    }
  });
}