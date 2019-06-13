import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js'
import axios from 'axios';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();

        axios.post('http://localhost:8080/api/autores/',
            JSON.stringify({
                nome: this.state.nome,
                email: this.state.email,
                senha: this.state.senha
            }))
            .then(response => {
                PubSub.publish('atualiza-lista-autores', response.data)
                this.setState({ nome: '', email: '', senha: '' });
            })
            .catch(error => {
                console.log(error);
            });
    }

    alteraCampo(nomeInput, evento) {
        var campoAlterado = {};
        campoAlterado[nomeInput] = evento.target.value;
        this.setState(campoAlterado);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.alteraCampo.bind(this, 'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.alteraCampo.bind(this, 'email')} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.alteraCampo.bind(this, 'senha')} label="Senha" />
                    <BotaoSubmitCustomizado label="Gravar" />
                </form>

            </div>
        );
    }
}

class TabelaAutores extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(autor => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {
    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/autores/")
            .then(response => {
                this.setState({ lista: response.data });
            })
            .catch(error => { console.log(error); });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
            this.setState({ lista: novaLista });
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista} />
                </div>
            </div>
        );
    }
}