const servicosEscolhidos = JSON.parse(localStorage.getItem('servicosSelecionados')) || [];

if (servicosEscolhidos.length === 0) {
  document.body.innerHTML = '<p style="text-align:center; margin-top:2rem;">Nenhum serviço selecionado. Por favor, volte e escolha algum serviço.</p>';
  throw new Error('Nenhum serviço selecionado.');
}

const horariosDisponiveis = {
  '2025-08-01': ['09:00', '10:00', '11:00', '13:30', '15:00', '16:00'],
  '2025-08-02': ['09:00', '10:00', '11:00'],
};

const agendamentosFeitos = [];

const calendarioInput = document.getElementById('calendario');
const horarioSelect = document.getElementById('horario');
const listaServicos = document.getElementById('lista-servicos');
const totalSpan = document.getElementById('total');
const form = document.getElementById('form-agendamento');
const resultado = document.getElementById('resultado');

function atualizarListaServicos() {
  listaServicos.innerHTML = '';
  let total = 0;
  servicosEscolhidos.forEach(servico => {
    const li = document.createElement('li');
    li.textContent = `${servico.nome} - R$ ${servico.preco}`;
    listaServicos.appendChild(li);
    total += servico.preco;
  });
  totalSpan.textContent = `R$ ${total}`;
}

function atualizarHorarios() {
  const dataSelecionada = calendarioInput.value;
  const horarios = horariosDisponiveis[dataSelecionada] || [];

  const ocupados = agendamentosFeitos
    .filter(ag => ag.data === dataSelecionada)
    .map(ag => ag.horario);

  const horariosDisponiveisFiltrados = horarios.filter(h => !ocupados.includes(h));

  horarioSelect.innerHTML = '';
  horariosDisponiveisFiltrados.forEach(horario => {
    const option = document.createElement('option');
    option.value = horario;
    option.textContent = horario;
    horarioSelect.appendChild(option);
  });
}

calendarioInput.addEventListener('change', atualizarHorarios);

document.addEventListener('DOMContentLoaded', () => {
  atualizarListaServicos();
  atualizarHorarios();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;
  const data = calendarioInput.value;
  const horario = horarioSelect.value;
  const pagamento = document.querySelector('input[name="pagamento"]:checked').value;

  agendamentosFeitos.push({ data, horario });

  resultado.innerHTML = `<p>Agendamento realizado com sucesso para <strong>${data}</strong> às <strong>${horario}</strong>.</p>
    <p>Nome: ${nome}</p>
    <p>Telefone: ${telefone}</p>
    <p>Email: ${email || 'Não informado'}</p>
    <p>Forma de pagamento: ${pagamento}</p>
    <p>O pagamento será feito no dia do atendimento. Esperamos você lá!</p>`;

  form.reset();
  atualizarHorarios();
});
