const puppeteer = require('puppeteer');
require('dotenv').config();
const loginLink = "https://www.hackerrank.com/auth/login"
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const codeObj = require('./codes')
let browserOpen = puppeteer.launch({
    headless: false,
    args : ['--start-maximized'],
    defaultViewport:null
})
let page;
browserOpen.then(function (browserObj){
    let browserOpenPromise = browserObj.newPage()
    return browserOpenPromise;
}).then(function(newTab){
    page = newTab
    let hackerRankOpenPromise = newTab.goto(loginLink)
    return hackerRankOpenPromise
}).then(function(){
    let emailEntered = page.type("input[type='text']", email)
    return emailEntered;
}).then(function(){
    let passwordEntered = page.type("input[type='password']", password)
    return [passwordEntered];
}).then(function(){
    let loginEntered = page.click('button[type="submit"]')
    return loginEntered;
}).then(function(){
    let clickedOnAlgo = waitAndClick(".topic-card a[data-attr1='algorithms']", page)
    return clickedOnAlgo;
}).then(function(){
    let easyProblems = waitAndClick("input[value='warmup']", page, {delay:100})
    return easyProblems
}).then(function(){
    let allChallanges = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", {delay:100})
    return allChallanges;
}).then(function(questionsArr){
    console.log('No Of Questions: ', questionsArr.length)
    let questionSolved = questionSolver(page, questionsArr[0], codeObj.answers[0])
    return questionSolved
})

function waitAndClick(selector, cPage){
    return new Promise(function (resolve, reject){
        let waitPromise = cPage.waitForSelector(selector)
        waitPromise.then(function(){
            let clickModel = cPage.click(selector)
            return clickModel;
        }).then (function(){
            resolve();
        }).catch(function(){
            reject();
        })
    })
}

function questionSolver(page, question, answer){
    return new Promise(function(resolve, reject){
        let questionClicked = question.click()
        questionClicked.then(function(){
            let EditorPromise = waitAndClick('.monaco-editor.no-user-select.vs', page, {delay:100})
            return EditorPromise
        }).then(function(){
            return waitAndClick('.checkbox-input', page, {delay:100})
        }).then(function(){
            return page.waitForSelector('textarea.custominput', page)
        }).then(function(){
            return page.type('textarea.custominput', answer)
        }).then(function(){
            let ctrlPress = page.keyboard.down('Control')
            return ctrlPress;
        }).then(function(){
            let ctrlA = page.keyboard.press('A', {delay : 100})
            return ctrlA
        }).then(function(){
            let ctrlX = page.keyboard.press('X', {delay : 100})
            return ctrlX
        }).then(function(){
            let ctrlUnPress = page.keyboard.up('Control')
            return ctrlUnPress
        }).then(function(){
            let mainEditor = waitAndClick('.monaco-editor.no-user-select.vs', page)
            return mainEditor
        }).then(function(){
            let ctrlPress = page.keyboard.down('Control')
            return ctrlPress;
        }).then(function(){
            let ctrlA = page.keyboard.press('A', {delay : 100})
            return ctrlA
        }).then(function(){
            let ctrlV = page.keyboard.press('V', {delay : 100})
            return ctrlV
        }).then(function(){
            let ctrlUnPress = page.keyboard.up('Control')
            return ctrlUnPress
        }).then(function(){
            let submitButton = waitAndClick('.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled', page)
            return submitButton
        }).catch(function(err){
            reject();
        })
    })
}