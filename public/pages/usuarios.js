import { isPreenchido, validarEmail, validarCPF } from '../utils/validationUtils.js';
import {limparTelefone} from '../utils/stringUtils.js';
import { checkCredentials, cadastrarUsuario } from '../services/usuarios.js'

if (document.getElementById('botao-login')) {
    document.getElementById('botao-login').addEventListener('click', checarCredenciais);
}
async function checarCredenciais() {


    const email = document.getElementById("input_email").value;
    const password = document.getElementById("input_password").value;

    if (isPreenchido([email, password])) {
        if (!validarEmail(email)) {
            mostrarMensagem('E-mail inválido.', 'erro');
            return;
        }
        try {
            const response = await checkCredentials(email, password);

            if (response.sucesso) {

                sessionStorage.setItem('usuario', JSON.stringify(response.usuario));


                window.location.href = '/';

            } else {

                console.log("aqui tambem")
                mostrarMensagem(response.mensagem, 'erro');
            }

        } catch (error) {

            mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
        }
    } else {
        mostrarMensagem('Por favor, preencha email e senha.', 'aviso');
    }
}
if (document.getElementById('botao-cadastro')) {
    document.getElementById('botao-cadastro').addEventListener('click', cadastrar);
}

async function cadastrar() {
    const nome = document.getElementById("name").value;
    let cpf = document.getElementById("cpf").value;
    const email = document.getElementById("signupEmail").value;
    const telefone = limparTelefone(document.getElementById("signupTelefone").value);
    const senha = document.getElementById("signupPassword").value;
    const confirmSenha = document.getElementById("confirmPassword").value;
    const tipoUsuario = document.getElementById("userType").value;

    console.log(telefone)

    if (isPreenchido([nome, email, telefone, cpf, senha, tipoUsuario])) {
        const cpfTratado = validarCPF(cpf)
        if (cpfTratado.cpfValido) {
            cpf = cpfTratado.cpf;
        } else {
            mostrarMensagem('CPF inválido.', 'erro');
            return;
        }

        if (!validarEmail(email)) {
            mostrarMensagem('E-mail inválido.', 'erro');
            return;
        }

        if (senha !== confirmSenha) {
            mostrarMensagem('As senhas não coincidem.', 'erro');
            return;
        }

        try {
            const response = await cadastrarUsuario(nome, email, telefone, cpf, senha, tipoUsuario);

            if (response.sucesso) {
                window.location.href = '/login';

            } else {
                mostrarMensagem(response.mensagem, 'erro');
            }

        } catch (error) {

            mostrarMensagem('Erro de conexão. Tente novamente.', 'erro');
        }
    } else {
        mostrarMensagem('Preencha todos os campos.', 'aviso');
    }

}





function mostrarMensagem(mensagem, tipo) {

    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
    }


    const classe = tipo === 'erro' ? 'message-error' :
        tipo === 'sucesso' ? 'message-success' : 'message-warning';

    messageContainer.innerHTML = `<div class="${classe}">${mensagem}</div>`;


    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}
