document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const participantsList = document.getElementById('participants');
    const calculateButton = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    let participants = [];

    // Función para renderizar la lista de participantes
    const renderParticipants = () => {
        participantsList.innerHTML = '';
        participants.forEach((participant, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                ${participant.name}: $${participant.amount.toFixed(2)}
                <button class="btn btn-danger btn-sm" onclick="removeParticipant(${index})">Eliminar</button>
            `;
            participantsList.appendChild(listItem);
        });
    };

    // Función para agregar participante
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (name && !isNaN(amount)) {
            const existingParticipant = participants.find(participant => participant.name === name);
            if (existingParticipant) {
                existingParticipant.amount += amount;
            } else {
                participants.push({ name, amount });
            }
            renderParticipants();
            form.reset();
        }
    });

    // Función para eliminar participante
    window.removeParticipant = (index) => {
        participants.splice(index, 1);
        renderParticipants();
    };

    // Función para calcular la división de gastos
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
