import React, { useRef } from 'react';

/**
 * Composant OTP (One-Time Password) réutilisable
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.length - Nombre de champs pour le code OTP
 * @param {string} props.value - Valeur actuelle du code OTP
 * @param {function} props.onChange - Fonction appelée lors du changement de valeur
 * @param {React.ReactNode} props.separator - Élément séparateur entre les champs (optionnel)
 * @param {Object} props.inputProps - Props additionnelles pour personnaliser les inputs (optionnel)
 * @param {string} props.className - Classes CSS additionnelles pour le conteneur (optionnel)
 * @param {string} props.inputClassName - Classes CSS additionnelles pour les inputs (optionnel)
 * @returns {React.ReactElement}
 */
const OTPInput = ({
  length = 4,
  value = '',
  onChange,
  separator = <span className="mx-1"></span>,
  inputProps = {},
  className = '',
  inputClassName = '',
}) => {
  const inputRefs = useRef(Array(length).fill(null));

  const focusInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) targetInput.focus();
  };

  const selectInput = (targetIndex) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) targetInput.select();
  };

  const handleKeyDown = (event, currentIndex) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (event, currentIndex) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter].value && 
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }

    onChange((prev) => {
      const otpArray = prev.split('');
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      return otpArray.join('');
    });

    if (currentValue !== '') {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (event, currentIndex) => {
    selectInput(currentIndex);
  };

  const handlePaste = (event, currentIndex) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (
          inputRefs.current[indexToEnter].value && 
          indexToEnter < currentIndex
        ) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split('');

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' ';
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(''));
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array(length)
        .fill(null)
        .map((_, index) => (
          <React.Fragment key={index}>
            <input
              ref={(ele) => {
                inputRefs.current[index] = ele;
              }}
              className={`w-10 h-10 text-center rounded text-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${inputClassName}`}
              type="text"
              maxLength={1}
              aria-label={`Digit ${index + 1} of OTP`}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onChange={(event) => handleChange(event, index)}
              onClick={(event) => handleClick(event, index)}
              onPaste={(event) => handlePaste(event, index)}
              value={value[index] ?? ''}
              {...inputProps}
            />
            {index === length - 1 ? null : separator}
          </React.Fragment>
        ))}
    </div>
  );
};

export default OTPInput;