




// URL da API 

const API_URL = "https://site-cadastro-o9ix.onrender.com";

// Pegando os elementos do formulário
const registro = document.getElementById("registro");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmeSenha = document.getElementById("confirmeSenha");

// Ouvinte de evento: quando o usuário clicar em "Cadastrar"
registro.addEventListener('submit', function(e) {
    e.preventDefault(); // evita o recarregamento da página

    // Validações de campos
    const camposPreenchidos = verificarPreencher([nome, email, senha, confirmeSenha]);
    const nomeValido = contador(nome, 3, 46);
    const emailValido = confirmeEmail(email);
    const senhaValida = contador(senha, 6, 25);
    const senhaValidaIgual = confirmarSenhaIgual(senha, confirmeSenha);

    // Só envia se tudo for válido
    const eValido = camposPreenchidos && nomeValido && emailValido && senhaValida && senhaValidaIgual;

    if (eValido) {
        // Cria o objeto usuário
        const usuario = {
            nome: nome.value,
            email: email.value,
            senha: senha.value
        };

        // Faz a requisição POST para o backend
        fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })
        .then(res => {
            if (!res.ok) {
                // Se o servidor retornar erro, pega a mensagem
                return res.json().then(data => { 
                    throw new Error(data.error || 'Erro desconhecido'); 
                });
            }
            return res.json();
        })
        .then(data => {
            // Se tudo deu certo → mostra mensagem verde de sucesso
            mostrarMensagem(data.message, "sucesso");
            registro.reset(); // limpa os campos
        })
        .catch(err => {
            // Se deu erro → mostra mensagem vermelha
            console.error("Erro:", err);
            mostrarMensagem(err.message || "Erro ao registrar. Verifique a conexão.", "erro");
        });

        // Reseta os estados visuais dos inputs
        document.querySelectorAll('.form-group').forEach(grupo => {
            grupo.className = 'form-group';
            const small = grupo.querySelector('small');
            if (small) small.innerText = '';
        });
    }
});

// Função para exibir mensagens de sucesso/erro na tela (ao invés de alert)
function mostrarMensagem(texto, tipo = "sucesso") {
    const msg = document.getElementById("mensagem");
    msg.innerText = texto;
    msg.className = `mensagem ${tipo}`;
    msg.style.display = "block";

    // A mensagem some depois de 4 segundos
    setTimeout(() => {
        msg.style.display = "none";
    }, 4000);
}

// Verifica se as senhas coincidem
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

// Verifica se o email tem formato válido
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

// Valida comprimento mínimo e máximo de um campo
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

// Verifica se todos os campos foram preenchidos
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

// Pega o "nome" do campo a partir do ID (para mostrar nas mensagens)
function formato(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Exibe erro visual no input
function erro(input, message) {
    const grupo = input.parentElement;
    grupo.className = 'form-group error';
    const small = grupo.querySelector('small');
    small.innerText = message;
}

// Exibe sucesso visual no input
function sucesso(input) {
    const grupo = input.parentElement;
    grupo.className = 'form-group success';
}
