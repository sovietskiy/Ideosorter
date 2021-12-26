var lang
var questions
var questionId
var buttons
var answerpath = []

function next_question(sel) {
    if (questions[questionId].results[sel] == null) {
        answerpath.push(questionId)
        questionId = questions[questionId].nextquestion[sel]
        init_question()
    } else {
        location.href = `results.html?${lang}&${questions[questionId].results[sel]}`
    }
}

function prev_question(){
    if(answerpath.length == 0){
        location.href = `index.html?${lang}`
    } else {
        questionId = answerpath.at(-1)
        answerpath.pop()
        init_question()
    }
}

function init_question() {
    document.getElementById("question").innerHTML = questions[questionId]["question"]
    let buttonHTML = ""
    let answers = questions[questionId].answers
    for(let i = 0; i<answers.length; i++) {
        let button = buttons[answers[i]]
        buttonHTML += `<button class="button" onclick="next_question('${answers[i]}')" style="background-color:${button.bgcolor}; color:${button.textcolor};">${button.text}</button>`
    }
    document.getElementById("buttonholder").innerHTML = buttonHTML
}

function load_questions(data){
    questions = data
    questionId = Object.keys(data)[0]
    init_question()
}

async function load_ui(quiz){
    document.getElementById("quiz_title").innerHTML = quiz.title
    if(Array.prototype.at){
        document.getElementById("back_button").innerHTML = quiz.back
    } else {
        document.getElementById("back_button").style.display = "none"
    }
    await fetch(`./json/${lang}/buttons-${lang}.json`)
        .then(response => response.json())
        .then(data => buttons = data)
        .catch(document.getElementById("question").innerHTML = "An error has occurred loading this page, please reload.")
    fetch(`./json/${lang}/questions-${lang}.json`)
        .then(response => response.json())
        .then(data => load_questions(data))
}

function parse_langs(data){
    let langs = []
    for(let i=0; i < data.length; i++){
        langs.push(data[i].id)
    }
    if (langs.some(element => element === window.location.search.substring(1))){
        lang = window.location.search.substring(1)
    } else {
        lang = "en"
    }
    fetch(`./json/${lang}/ui-${lang}.json`)
        .then(response => response.json())
        .then(data => load_ui(data.quiz))
}

window.onload = () => fetch(`./json/langs.json`)
    .then(response => response.json())
    .then(data => parse_langs(data))