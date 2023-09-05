function showContent(contentId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        if (content.id === contentId) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });

    const buttons = document.querySelectorAll('.pill-button');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(contentId)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
