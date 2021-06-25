'use strict';

// Elements

const inputUser = document.querySelector('.username');
const inputPass = document.querySelector('.password');
const inputMail = document.querySelector('.email');
const formContainer = document.querySelector('.forms');
const loginForm = document.querySelector('.login');
const registerForm = document.querySelector('.register');
const oldUser = document.querySelector('.oldUser');
const newUser = document.querySelector('.newUser');
const registerBtn = document.querySelector('.registerBtn');
const loginBtn = document.querySelector('.loginBtn');
const logoutBtn = document.querySelector('.logout');
const closeModal = document.querySelector('.close');
const overlay = document.querySelector('.overlay');
const cryptoContainer = document.querySelector('.crypto');
const buyCoinForm = document.querySelector('.getCoin');
const getCoinBtn = document.querySelector('.buyCrypto');
const amount = document.querySelector('.quantity');
const buyBTC = document.querySelector('.buyBTC');
const buyETH = document.querySelector('.buyETH');
const usdSummary = document.querySelector('.usdSum');
const btcSummary = document.querySelector('.btcSum');
const ethSummary = document.querySelector('.ethSum');
const welcomeMsg = document.querySelector('.welcome');
const option = document.querySelector('select');
const mainContainer = document.querySelector('.rates');
const acctBalance = document.querySelector('.balance');
const btcSlug = 'btc';
const ethSlug = 'eth';

const currDate = (new Date).getFullYear;
let curAcct, btc2Dollar, eth2Dollar;

// Sample Accounts

const acct1 = {
    username: 'Dare',
    email: 'dare@for.more',
    balance: [200, 50, -70, -150, 6000],
    password: 3456,
    btc: 5,
    eth: 930,
}

const acct2 = {
    username: 'Nike',
    email: 'nikeagboola@hairdesignscare.com',
    balance: [2000, 500, 750, -150, 650, 1700, 25000],
    password: 8394,
    btc: 25,
    eth: 450,
}

// Main Class

class App {

    // private field
    #accts = [acct1, acct2];

    // public field
    id = (Date.now() + '').slice(-10);

    constructor() {
        // Values and method to load 

        this._showLogin();
        this._hideMain();
        this.displayRate();

        // // Load data from local storage
        // this._getLocalStorage();

        // Event Handlers
        newUser.addEventListener('click', this._showRegister.bind(this));
        oldUser.addEventListener('click', this._showLogin.bind(this));
        loginBtn.addEventListener('click', this._login.bind(this));
        registerBtn.addEventListener('click', this._register.bind(this));
        logoutBtn.addEventListener('click', this._logout.bind(this));
        getCoinBtn.addEventListener('click', this._buyCoin.bind(this));
        buyBTC.addEventListener('click', this._showBuyForm.bind(this));
        buyETH.addEventListener('click', this._showBuyForm.bind(this));
        closeModal.addEventListener('click', this._hideBuyForm.bind(this));
        overlay.addEventListener('click', this._hideBuyForm.bind(this));
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !buyCoinForm.classList.contains('hidden'))
                this._hideBuyForm();
        })
    }

    // Show Register or Login form
    _showRegister() {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        inputUser.focus();
    }

    _showLogin() {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        inputUser.focus();
    }

    _showLogout() {
        logoutBtn.classList.remove('hidden');
    }

    _hide(any) {
        any.classList.add('hidden');
    }

    _hideMain() {
        mainContainer.classList.add('hide');
    }
    _login(e) {
        // prevent default submission
        e.preventDefault();

        // check for the input values 
        curAcct = this.#accts.find(acc => acc.username === inputUser.value);

        // Return if no value entered
        if (inputUser.value === "" || inputPass.value === "") return;

        if (curAcct && curAcct.password === Number(inputPass.value)) {
            this._hide(formContainer);
            this.welcomeMessage();
            this.displayAccDetails(curAcct);
            this._showMain();
        }

        // Clear form field
        inputPass.value = inputUser.value = '';
        inputPass.blur();

        // Display log out button
        this._showLogout();
        console.log('clicked', inputPass.value, curAcct.password);
    }

    _register(e) {
        e.preventDefault();
        const inputText = document.querySelector('.user');
        const inputPassword = document.querySelector('.pass');
        // Getting values from input field
        const username = inputText.value;
        const password = inputPassword.value;
        const email = inputMail.value;
        const bonus = 2000;
        let newAcct;

        // let index = this.#accts.findIndex(acc => acc.username === inputText.value)
        // console.log(index);
        // if (this.#accts.contains(inputText.value)) return alert('username exist')
        // if (inputMail.value === this.#accts[index].email) return alert('email taken already')
        // Return if one field is blank
        if (
            username === '' &&
            password === '' &&
            email === ''
        ) return;

        // creating new child class
        newAcct = new User(username, password, email);

        // Gift balance for new users
        newAcct.balance = [bonus];
        newAcct.btc = 1;
        newAcct.eth = 1;
        curAcct = newAcct;
        this.#accts.push(curAcct);
        this._hide(formContainer);
        this._showMain();
        console.log(newAcct);
        // Display current account balance
        this.displayAccDetails(curAcct);
        let self = this.#accts
        console.log(self)
        // Add new acct to local storage
        this._setLocalStorage();

        this._showLogout();

        // // Clear input field
        // inputMail.value = inputPass.value = inputUser.value = '';
        welcomeMsg.textContent = `Welcome to the crypto family, ${curAcct.username}`;
    }

    _setLocalStorage() {
        // Add value to localstorage and turn it to string
        localStorage.setItem('accts', JSON.stringify(this.#accts));
    }

    _getLocalStorage() {
        // Get data from local storage
        const data = JSON.parse(localStorage.getItem('accts'));

        // Return if no field available
        if (!data) return;

        // Assign the data value to the acct array
        this.#accts = data;

        this.#accts.forEach((acct) => this._displayAccDetails(acct))
    }

    _reset() {
        // clear the values from the localstorage
        localStorage.removeItem('accts');
        location.reload();
    }


    _renderCoin(data) {
        // Slug for the data 
        const slugUpper = data[0].name === 'Bitcoin' ? 'BTC' : 'ETH';
        const slugLower = data[0].name === 'Bitcoin' ? 'btc' : 'eth';

        let coin = `
            <div class="${slugLower}">
                <h3>${(data[0].name).toUpperCase()}</h3>
                <h4>USD: <span class="dollar">${Number(data[0].price).toFixed(2)}</span></h4>
                <h4>NAIRA: <span class="na1ra">${Number(data[0].price * 409).toFixed(2)}</span></h4>
                <p>% change in 24 hrs: <span class="hours24">0.2</span></p >
                <p>% Change 1 month: <span class="month1">0.01</span></p>
                <p>Date: <span class="curDate">${data[0].price_date}</span></p>
                <button class="buy${slugUpper}">BUY ${slugUpper}</button>
            </div >
    `;

        // Add the html file to the container
        cryptoContainer.insertAdjacentHTML('beforeend', coin);
    }

    errorMsg(msg) {
        return document.body.insertAdjacentText('afterbegin', msg)
    }

    _fetchRate() {
        // create a promise by getting data from the link
        return fetch(`https://api.nomics.com/v1/currencies/ticker?key=f2288a45e7ea5b72c5d5d82d2567d9c7&ids=BTC&interval=1d,30d&convert=USD&per-page=100&page=1`)
            .then(res => {
                // check for the response for error
                if (!res.ok) throw new Error('Enter the correct coin name!');
                // process the data received
                return res.json()
            })
            .then(data => {
                // check the data received for error 
                if (!data) throw new Error('Coin details not available!');
                this._renderCoin(data)
                btc2Dollar = Number(data[0].price).toFixed(2);
                return fetch(`https://api.nomics.com/v1/currencies/ticker?key=f2288a45e7ea5b72c5d5d82d2567d9c7&ids=ETH&interval=1d,30d&convert=USD&per-page=100&page=1`)
            })
            .then(res => {
                // check for the response for error
                if (!res.ok) throw new Error('Enter the correct coin name!');
                // process the data received
                return res.json()
            })
            .then(data => {
                // check the data received for error 
                if (!data) throw new Error('Coin details not available!');
                eth2Dollar = Number(data[0].price).toFixed(2)
                this._renderCoin(data)
            })
            .catch(err => {
                // Show the error caught from the promise
                console.error(err);
                this.errorMsg(err);
            });
    }

    displayRate() {
        // Display the bitcoin rates
        this._fetchRate();
    }

    renderBuy() {
        // Show the coin modal
        buyCoinForm.classList.remove('hidden');
    }


    _buyCoin(e) {
        e.preventDefault();
        // curAcct.btc++;
        // eth2Dollar = 80;
        // btc2Dollar = 100;
        // Loop through option Element Node list
        console.log(curAcct);
        if (option.value === '') return;
        console.log(option.value)

        if (option.value === 'btc') {
            const price = (+(amount.value) * btc2Dollar).toFixed(2)
            console.log(curAcct.usd, price)
            if (Number(curAcct.usd) < price) { alert('Current balance too low'); }
            else {
                curAcct.balance.push(-price);
                curAcct.btc += +(amount.value);
            }
        }

        if (option.value === 'eth') {
            const price = +(amount.value) * eth2Dollar;
            console.log(curAcct, price, +amount.value, eth2Dollar)
            if (curAcct.usd < price) { alert('Current balance too low') }
            else {
                console.log(curAcct.balance)
                curAcct.balance.push(-price);
                curAcct.eth += +(amount.value);
            }
        }
        // Hide coin form 
        buyCoinForm.classList.add('hidden');

        // Hide overlay 
        document.querySelector('.overlay').classList.add('hidden');

        // Show current acc balance
        this.displayAccDetails(curAcct);
    }

    _showBuyForm(e) {
        // e.preventDefault();

        // Show coin form 
        buyCoinForm.classList.remove('hidden');

        // Show overlay
        overlay.classList.remove('hidden');
    }

    _hideBuyForm(e) {
        e.preventDefault();

        // Hide coin form
        buyCoinForm.classList.add('hidden');

        // Hide overlay 
        overlay.classList.add('hidden');
    }

    welcomeMessage() {
        return welcomeMsg.textContent = `Welcome back, ${curAcct.username}!`;
    }


    _showMain() {
        mainContainer.classList.remove('hide');
    }

    displayAccDetails(acc) {
        // get current balance
        let curBalance = acc.balance.reduce((acc, money) => acc + parseInt(money), 0)
        btcSummary.textContent = `${acc.btc} BTC`;
        ethSummary.textContent = `${acc.eth} ETH`;
        usdSummary.textContent = `${curBalance} USD`;
        curAcct.usd = curBalance;
        console.log(curBalance)
        return curBalance;
    }

    _logout() {
        // Hide the main content
        this._hideMain()
        //Clear input field
        inputMail.value = inputPass.value = inputUser.value = '';
        this._hide(logoutBtn);
        // Reload url
        location.reload()
        // this._showLogin();
    }
}

// Run class App
const app = new App();

// create from another class
class User extends App {
    constructor(username, password, email) {
        // Passing values from the parent class
        super(username, password, email)
        // Assigning values to the chld class variables
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
