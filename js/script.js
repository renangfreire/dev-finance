const Modal = {
    toggle() {
        //Abrir Modal
        //Adicionar class active ao modal
        document.querySelector('.modal-overlay')
        .classList
        .toggle("active")
    }
    /*
    Esse é um dos modos, COM o REMOVE E ADD, mas tem que utilizar DUAS funções para o mesmo resultado da acima, utilizando TOGGLE.
    close() {
        //Fechar Modal
        //Remover class active do modal
        document.querySelector('.modal-overlay')
        .classList
        .remove("active")
        */   
    }

const Storage = {
        get(){
            return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
        },
        set(transaction){
            localStorage.setItem("dev.finance:transactions", JSON.stringify(transaction))
        }
}

const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(position){
        Transaction.all.splice(position, 1)
        App.reload()
    },

    incomes(){
        let income = 0;
        //pegar todas transações
        //para cada transação
        Transaction.all.forEach(transaction => {
            //verificar se é + que 0
            if(transaction.amount > 0){
                //somar a uma variavel
                income += transaction.amount
            }
        }) 
        //retornar
   
        return income
    },

    expenses(value){
        let expense = 0;
        //pegar todas transações
        //para cada transação
        Transaction.all.forEach(transaction => {
            //verificar se é - que 0
            if(transaction.amount < 0){
                //somar a uma variavel
                expense += transaction.amount
            }
        })
        return expense
    },

    total(value){
        let total = 0;

        //pegar todas transações
        Transaction.all.forEach(transaction => {
            total += transaction.amount
        })
        //somar a uma variavel
        //retornar
        Utils.colorTotal(total)
        
       return total

       //Dava pra encurtar tudo isso por somente
       // return Transaction.income() + transaction.expense()
    }
}

const Form = {
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector("#date"),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        } 
    },
    validadeFields(){
        //console.log("validando informações")
        const { description, amount, date} = Form.getValues()
        if( description.trim() === '' || 
        amount.trim() === '' ||
        date.trim() === '' ){
                throw new Error("Por Favor, preencha todos os campos")
        }
    },
    formatDate(){
     //console.log("formatando dados")
     let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return{
            description,
            amount,
            date
        }
    },
    clearForm(){
       // console.log("limpando formulario")
       Form.description.value = ''
       Form.amount.value = ''
       Form.date.value = ''
    },
    
    submit(event){
        event.preventDefault()
        try {
        // verificar se todas informações foram preenchidas
        Form.validadeFields()

        // formatar os dados para salvar
        const transaction = Form.formatDate()
        
        // salvar os dados
        Transaction.add(transaction)
 
        // limpar form
        Form.clearForm()
 
        // fechar o modal
        Modal.toggle()
        } catch (error) {
            alert(error.message)
        }
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody")
    ,
    addTransaction(transaction, index) {
    const tr = document.createElement("tr")
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    
    DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrence(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})"class="button" src="./assets/minus.svg" alt="Remover Transação">
        </td>

        `
        return html
    },
    updateBalance(transaction){
        // const amount = Utils.formatCurrence(transaction.amount)
        document.getElementById('incomeDisplay')
        .innerHTML =  Utils.formatCurrence(Transaction.incomes())
        document.getElementById('expenseDisplay')
        .innerHTML =  Utils.formatCurrence(Transaction.expenses())
        document.getElementById('totalDisplay')
        .innerHTML =  Utils.formatCurrence(Transaction.total())
    },
    clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        // value = Number(value.replace(/\,?\.?/g, "")) * 100
        //Aqui utilizamos um REGEX para retirar a virgula, mas como o JS já retira, ao mudarmos o valor, não precisa, mas se precisar faça isso.

        value = Number(value) * 100 
        console.log(value)
        return Math.round(value)
    },
    formatDate(value){
        const spliceDate = value.split("-")
        return `${spliceDate[2]}/${spliceDate[1]}/${spliceDate[0]}`
    },
    formatCurrence(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
    colorTotal(total){
        const color = total < 0 ? "red" : "lime"
        if(color == "red"){
            document.querySelector(".card.total")
            .classList
            .add("negative")
        }
        else{
            document.querySelector(".card.total")
            .classList
            .remove("negative")
        }
    }
}

const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)
            //Esse acima faz as mesmas coisas do abaixo, muda que como estamos passando os mesmos parametros que estamos puxando, colocamos a função como ATALHO.

            //Transaction.all.forEach((transaction, index )=> {
            //DOM.addTransaction(transaction, index) })

        DOM.updateBalance()

    Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()