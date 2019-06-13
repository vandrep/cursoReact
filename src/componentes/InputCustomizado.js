import React, { Component } from 'react';

export default class InputCustomizado extends Component{
    render(){
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <input {...this.props}/>
            </div>
        );
    }
}