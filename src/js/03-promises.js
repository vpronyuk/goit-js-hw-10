import Notiflix from 'notiflix';

const form = document.querySelector('.form');

const delayRef = document.getElementsByName('delay')[0];
const stepRef = document.getElementsByName('step')[0];
const amountRef = document.getElementsByName('amount')[0];
const formBtn = document.querySelector('button');

formBtn.addEventListener('click', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  let delay = 0;
  for (let position = 1; position <= amountRef.value; position++) {
    delay = delayRef.value + stepRef.value * (position - 1);
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      });
  }
  form.reset();
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
  return promise;
}
