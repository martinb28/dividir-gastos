document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const participantsList = document.getElementById('participants');
    const calculateButton = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    let participants = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (name && !isNaN(amount)) {
            participants.push({ name, amount });
            const listItem = document.createElement('li');
            listItem.textContent = `${name}: $${amount.toFixed(2)}`;
            participantsList.appendChild(listItem);
            form.reset();
        }
    });

    calculateButton.addEventListener('click', () => {
        const totalAmount = participants.reduce((sum, participant) => sum + participant.amount, 0);
        const averageAmount = totalAmount / participants.length;
        const debts = participants.map(participant => ({
            name: participant.name,
            amount: participant.amount - averageAmount
        }));

        const creditors = debts.filter(debt => debt.amount > 0);
        const debtors = debts.filter(debt => debt.amount < 0);

        resultsDiv.innerHTML = '';

        creditors.forEach(creditor => {
            debtors.forEach(debtor => {
                if (creditor.amount === 0 || debtor.amount === 0) return;

                const debtToSettle = Math.min(creditor.amount, -debtor.amount);
                resultsDiv.innerHTML += `<p>${debtor.name} debe pagar a ${creditor.name} $${debtToSettle.toFixed(2)}</p>`;
                
                creditor.amount -= debtToSettle;
                debtor.amount += debtToSettle;
            });
        });
    });
});
