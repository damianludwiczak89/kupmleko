let ang = document.querySelector('#eng');
let pl = document.querySelector('#pl');

ang.style.display = 'none';

console.log('test')

let toggleLanguage = document.querySelector('#toggleLanguage');

toggleLanguage.innerText = "🇬🇧";

toggleLanguage.addEventListener('click', () => {
    console.log('click')
    if (toggleLanguage.innerText == "🇬🇧") {
        toggleLanguage.innerText = "🇵🇱"
        pl.style.display = 'none';
        ang.style.display = 'block';
    }
    else {
        toggleLanguage.innerText = "🇬🇧"
        pl.style.display = 'block';
        ang.style.display = 'none';
    }
    
})


