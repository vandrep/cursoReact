import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js'
import axios from 'axios';

class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: 0, autorId: 0, autor: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();

        axios.post('http://localhost:8080/api/livros/',
            JSON.stringify({
                titulo: this.state.titulo,
                preco: this.state.preco,
                autorId: this.state.autorId
            }))
            .then(response => {
                PubSub.publish('atualiza-lista-livros', response.data)
                this.setState({ titulo: '', preco: 0, autorId: 0 });
            })
            .catch(error => {
                console.log(error);
            });
    }

    alteraCampo(inputNome, evento) {
        var campoAlterado = {};
        campoAlterado[inputNome] = evento.target.value
        this.setState(campoAlterado);
    }

    render() {
        var autores = this.props.autores.map(function (autor) {
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
        });
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.alteraCampo.bind(this, 'titulo')} label="Título" />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} onChange={this.alteraCampo.bind(this, 'preco')} label="Preço" />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" onChange={this.alteraCampo.bind(this, 'autorId')}>
                            <option value="">Selecione</option>
                            {autores}
                        </select>
                    </div>
                    <BotaoSubmitCustomizado label="Gravar" />
                </form>

            </div>
        );
    }
}

class TabelaLivros extends Component {
    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(Livro => {
                                return (
                                    <tr key={Livro.id}>
                                        <td>{Livro.titulo}</td>
                                        <td>{Livro.preco}</td>
                                        <td>{Livro.autorNome}</td>
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

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = { lista: [], autores: [] };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/api/livros/")
            .then(response => {
                this.setState({ lista: response.data });
            })
            .catch(error => { console.log(error); });

        axios.get("http://localhost:8080/api/autores/")
            .then(response => {
                this.setState({ autores: response.data });
            })
            .catch(error => { console.log(error); });

        PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
            this.setState({ lista: novaLista });
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}