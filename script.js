const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

// Formatação do valor
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    value = Number(value) / 100; // Divide por 100 para ajustar como centavos
    amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

// Evento de envio do formulário
form.onsubmit = (event) => {
    event.preventDefault(); // Evita o comportamento padrão

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    };

    expenseAdd(newExpense);
};

// Função para adicionar a despesa à lista
function expenseAdd(newExpense) {
    try {
        // Criação do elemento da lista
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Adição do ícone da categoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        // Adição do texto da despesa
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = `(${newExpense.category_name})`;

        expenseInfo.append(expenseName, expenseCategory);

        // Adicionando o valor ao item
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", " ")}`;

        const expenseRemove = document.createElement("img");
        expenseRemove.classList.add("remove-icon");
        expenseRemove.setAttribute("src", "./img/remove.svg");

        // Adiciona os itens ao item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove);
        expenseList.append(expenseItem);

        // Atualiza totais da lista
        updateTotals();
        //limpa o formulario
        formClear();
    } catch (error) {
        alert("Erro ao adicionar despesa");
        console.log(error);
    }
}

// Atualiza os totais
function updateTotals() {
    try {
        if (!expensesQuantity || !expensesTotal) {
            console.log("Elementos para exibição de totais não foram encontrados.");
            return;
        }

        const items = expenseList.children;

        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

        let total = 0;

        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount").textContent;

            let value = itemAmount.replace(/[^\d,]/g, "").replace(",", "."); // Remove caracteres indesejados e ajusta para número
            value = parseFloat(value);

            if (isNaN(value)) {
                return alert("Valor inválido");
            }

            total += value;
        }

        expensesTotal.textContent = formatCurrencyBRL(total);
    } catch (error) {
        console.log(error);
    }
}

// Evento para remover despesas
expenseList.onclick = (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("remove-icon")) {
        clickedElement.parentElement.remove();
        updateTotals();
    }
};

function formClear(){
    expense.value = "";
    amount.value = "";
    category.value = "";
}