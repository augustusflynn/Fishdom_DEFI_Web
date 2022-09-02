let SFEED_ANIMATION = {}
if (window.screen.availWidth > 576) {
    SFEED_ANIMATION = {
        "DURATION": 1000,
        "DELAY": 1000
    }
}
else {
    SFEED_ANIMATION = {
        "DURATION": 700,
        "DELAY": 0
    }
}
export {
    SFEED_ANIMATION
}