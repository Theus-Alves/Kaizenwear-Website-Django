document.addEventListener("DOMContentLoaded", function () {
    const html = document.querySelector("html");
    const checkbox = document.querySelector("#dark");
    const logoNavbar = document.querySelector("#logo-navbar");
    const deezerLofi = document.querySelector("#deezer-lofi");
    const deezerMelhores = document.querySelector("#deezer-melhores");


    checkbox.addEventListener("change", () => {
        html.classList.toggle("dark-mode");
        if (checkbox.checked) {
            logoNavbar.setAttribute("src", staticLogoDark);
            let srcDark = deezerLofi.getAttribute("src").replace("dark", "light");
            deezerLofi.setAttribute("src", srcDark);
            let srcDark2 = deezerMelhores
                .getAttribute("src")
                .replace("dark", "light");
            deezerMelhores.setAttribute("src", srcDark2);
        } else {
            logoNavbar.setAttribute("src", staticLogoLight);
            let srcLight = deezerLofi
                .getAttribute("src")
                .replace("light", "dark");
            deezerLofi.setAttribute("src", srcLight);
            let srcLight2 = deezerMelhores
                .getAttribute("src")
                .replace("light", "dark");
            deezerMelhores.setAttribute("src", srcLight2);
        }
    });
});

