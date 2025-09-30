const registro = document.getElementById("registro");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmeSenha = document.getElementById("confirmeSenha");

registro.addEventListener('submit', function(e) {
  e.preventDefault();

  // Validações básicas (campo vazio)
  const camposPreenchidos = verificarPreencher([nome, email, senha, confirmeSenha]);

  // Validações específicas
  const nomeValido = contador(nome, 3, 46);
  const emailValido = confirmeEmail(email);
  const senhaValida = contador(senha, 6, 25);
  const senhaValidaIgual = confirmarSenhaIgual(senha, confirmeSenha);

  // Resultado final (só é válido se TODAS passarem)
  const eValido = camposPreenchidos && nomeValido && emailValido && senhaValida && senhaValidaIgual;

  if (eValido) {
    alert('Registrado com sucesso!');
    registro.reset();

    // reseta os estilos
    document.querySelectorAll('.form-group').forEach(grupo => {
      grupo.className = 'form-group';
      const small = grupo.querySelector('small');
      if (small) small.innerText = '';
    });
  }
});

function confirmarSenhaIgual(input1, input2) {
  if (input1.value.trim() === '' || input2.value.trim() === '') {
    erro(input2, 'Confirmação de senha é obrigatória.');
    return false;
  }

  if (input1.value !== input2.value) {
    erro(input2, 'Senhas não são iguais.');
    return false;
  }

  sucesso(input2);
  return true;
}

function confirmeEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email.value.trim())) {
    sucesso(email);
    return true;
  } else {
    erro(email, 'Email não é válido');
    return false;
  }
}

function contador(input, min, max) {
  if (input.value.length < min) {
    erro(input, `${formato(input)} precisa ter no mínimo ${min} caracteres.`);
    return false;
  } else if (input.value.length > max) {
    erro(input, `${formato(input)} aceita no máximo ${max} caracteres.`);
    return false;
  } else {
    sucesso(input);
    return true;
  }
}

function verificarPreencher(inputArray) {
  let valido = true;

  inputArray.forEach(input => {
    if (input.value.trim() === '') {
      erro(input, `${formato(input)} é necessário`);
      valido = false;
    }
  });

  return valido;
}

function formato(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

function erro(input, message) {
  const grupo = input.parentElement;
  grupo.className = 'form-group error';
  const small = grupo.querySelector('small');
  small.innerText = message;
}

function sucesso(input) {
  const grupo = input.parentElement;
  grupo.className = 'form-group success';
}
