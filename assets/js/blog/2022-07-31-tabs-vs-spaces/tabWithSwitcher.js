const tabSliders = document.querySelectorAll('.tabSlider');

for (const tabSlider of tabSliders) {
  tabSlider.addEventListener('input', () => {
    tabSlider.parentElement.style.setProperty('--tab-spaces', tabSlider.value);
  });
}
