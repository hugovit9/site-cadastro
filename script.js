const registro = document.getElementById("registro");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmeSenha = document.getElementById("confirmeSenha");

registro.addEventListener('submit', function(e) {
  e.preventDefault();

  let eValido = verificarPreencher([nome, email, senha, confirmeSenha]);

  if (eValido) {
    const nomeValido = contador(nome, 3, 46);
    const emailValido = confirmeEmail(email);
    const senhaValida = contador(senha, 6, 25);
    const senhaValidaIgual = confirmarSenhaIgual(senha, confirmeSenha);

    eValido = nomeValido && emailValido && senhaValida && senhaValidaIgual;
  }

if (eValido) {
  alert('Registrado com sucesso!');
  registro.reset();
  
  document.querySelectorAll('.form-group').forEach(grupo => {
    grupo.className = 'form-group';
    const small = grupo.querySelector('small');
    if (small) small.innerText = '';
  });
}
});

function confirmarSenhaIgual(input1, input2) {
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
    } else {
      sucesso(input);
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
