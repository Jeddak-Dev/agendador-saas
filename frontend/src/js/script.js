document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const cpf = document.getElementById('cpf');
  const senha = document.getElementById('senha');

  // Foca no primeiro campo automaticamente
  cpf.focus();

  // Envia ao pressionar Enter
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cpfValue = cpf.value.trim();
    const senhaValue = senha.value.trim();

    if (!cpfValue || !senhaValue) {
      alert("Preencha todos os campos.");
      return;
    }

    // Aqui pode integrar com o backend
    alert(`Login enviado!\nCPF: ${cpfValue}`);
  });

  // Animação sutil ao clicar
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(0.96)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);
    });
  });
});
