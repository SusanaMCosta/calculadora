import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Botao from './src/componentes/Botao';
import Display from './src/componentes/Display';

const initialState = {
  //estado inicial da calculadora
  displayValue: '0', //valor inicial que será apresentado
  clearDisplay: false, //indica se o display deve ser limpo, ou seja, deve voltar a ser igual a 0
  operation: null, //guarda qual a operação que deverá ser realizada ('+', '-', '/', '*')
  values: [0, 0], //armazena dois valores os quais serão aplicados alguma das operações
  current: 0, //indica o ìndice do array para ser setado
};

export default class App extends Component {
  state = {...initialState}; //clone do objeto initialState contendo os mesmos valores

  addDigit = n => {
    const clearDisplay =
      this.state.displayValue === '0' || this.state.clearDisplay; //substitui o valor '0' pelo valor digitado

    if (n === '.' && !clearDisplay && this.state.displayValue.includes('.')) {
      return;
    } //garante que o número só possa ter um ponto

    //botões de dígitos
    const currentValue = clearDisplay ? '' : this.state.displayValue; //o valor corrente passa a ser o que está no display
    const displayValue = currentValue + n; //vai concatenando os números digitados ao valor corrente
    this.setState({displayValue, clearDisplay: false});

    if (n !== '.') {
      //guarda valores com casas decimais (floats)
      const newValue = parseFloat(displayValue);
      const values = [...this.state.values];
      values[this.state.current] = newValue;
      this.setState({values});
    }
  };

  clearMemory = () => {
    //Limpa a memória da calculadora / restaura o estado inicial
    this.setState({...initialState});
  };

  setOperation = operation => {
    console.log(`operation: ${operation}`);
    //botões de operações
    if (this.state.current === 0) {
      //se o índice corrente for o primeiro, seta a operação digitada, a guarda e depois limpa o display
      this.setState({operation, current: 1, clearDisplay: true});
    } else {
      //caso contrário, é um sinal de que os valores e a operação foram informados, então o cálculo é feito
      const equals = operation === '=';
      const values = [...this.state.values];
      try {
        // eslint-disable-next-line no-eval
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`); //avalia/executa o cálculo, sem o 'eval' apareceria uma
        //string contendo os valores informados (Ex.: 25 + 5) e não o resultado (30)
      } catch (e) {
        values[0] = this.state.values[0];
      }

      values[1] = 0; //já prepara para receber um novo valor
      this.setState({
        //reinicializa o estado
        displayValue: `${values[0]}`,
        operation: equals ? null : operation, //se for um '=' ele finaliza, se não, recebe a próxima operação
        current: equals ? 0 : 1, //caso não seja '=', continua setando para a nova operação
        // clearDisplay: !equals,
        clearDisplay: true,
        values,
      });
    }
  };

  render() {
    //os estilos e propriedades são aplicados a cada botão, e por padrão os labels dos
    //botões são passados para as funções especificadas
    return (
      <View style={styles.container}>
        <Display value={this.state.displayValue} />
        <View style={styles.buttons}>
          <Botao label="AC" triple onClick={this.clearMemory} />
          <Botao label="/" operation onClick={this.setOperation} />
          <Botao label="7" onClick={this.addDigit} />
          <Botao label="8" onClick={this.addDigit} />
          <Botao label="9" onClick={this.addDigit} />
          <Botao label="*" operation onClick={this.setOperation} />
          <Botao label="4" onClick={this.addDigit} />
          <Botao label="5" onClick={this.addDigit} />
          <Botao label="6" onClick={this.addDigit} />
          <Botao label="-" operation onClick={this.setOperation} />
          <Botao label="1" onClick={this.addDigit} />
          <Botao label="2" onClick={this.addDigit} />
          <Botao label="3" onClick={this.addDigit} />
          <Botao label="+" operation onClick={this.setOperation} />
          <Botao label="0" double onClick={this.addDigit} />
          <Botao label="." onClick={this.setOperation} />
          <Botao label="=" onClick={this.setOperation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
