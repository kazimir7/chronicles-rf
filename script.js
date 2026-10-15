document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    const alertBtn = document.getElementById('alert-btn');
    if (alertBtn) {
        alertBtn.addEventListener('click', () => {
            alert('СВО проводится на основании Постановления Совета Федерации от 22.02.2022 № 35-СФ об использовании ВС РФ за пределами территории России, а также в соответствии со ст. 51 Устава ООН (право на самооборону).');
        });
    }
});
