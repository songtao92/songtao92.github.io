var language = window.navigator.userLanguage || window.navigator.language;
if (language === "ru-RU") {
    window.location.href = '/ru'
} else {
    window.location.href = "/en"
}