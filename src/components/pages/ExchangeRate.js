import React, { Component }  from "react";
import { connect } from "react-redux";
import TopNav from "../../containers/navs/Topnav";
import Footer from "../../containers/navs/Footer";
import InputGroup from 'react-bootstrap/InputGroup'



class ExchangeRate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'data':'',
            'currencyRate':{}
        };
        this.currency = ['USD', 'EUR', 'RUB']
        this.getRate()
    }
    getRate = () => {
        fetch('https://api.exchangeratesapi.io/latest?base=USD')
            .then(data => {return data.json()})
            .then(data => {console.log(data);
            this.setState({date : data.date})
            let result = {};
            for (let i = 0; i<this.currency.length; i++) {
                result[this.currency[i]] = data.rates[this.currency[i]]
            }
            console.log(result)
            this.setState({currencyRate: result })
        })
    }
    calcRate = (e) => {
        e.preventDefault();
        let element = e.target.elements;
        let countCurrensy = element['count-currensy'].value
        let typeCurrensy = element['type-currensy'].value
        this.setState({result : (countCurrensy / this.state.currencyRate[typeCurrensy])})
    }

    render() {
        const { containerClassnames } = this.props;
        return (
            <div id="app-container" className={containerClassnames}>
                <TopNav history={this.props.history} />
                <main>
                    <div className="container-fluid">
                        {this.props.children}
                        <h2 className="mb-3 bd-text-purple-bright">Лучшие курсы обмена валют в России на {this.state.date}</h2>
                        <div className="flex-container">
                            {Object.keys(this.state.currencyRate).map( (keyName,i) =>
                                (
                                <div className="block flex-item" key={keyName}>
                                    <div className="curency-name">{keyName}</div>
                                    <div className="curency-in">{this.state.currencyRate[keyName].toFixed(2)}</div>
                                    <p>* Можно купить за 1 USD</p>
                                </div>
                                )
                            )}
                        </div>
                        <h3>Калькулятор обмена</h3>
                        <div className="block">
                            <div>
                                <form onSubmit={this.calcRate}>
                                <input type="number" defaultValue="100" name="count-currensy"/>
                                <select name="type-currensy" id="">
                                    {Object.keys(this.state.currencyRate).map( (keyName,i) =>
                                        (
                                            <option key={keyName} value={keyName}>{keyName}</option>
                                        )
                                    )}
                                </select>
                                    <input type="submit" defaultValue="calc"/>
                                </form>
                            </div>
                            <div>
                                <h4>Результат</h4>
                                <ul className="calc-res">
                                    <li>USD {this.state.result}</li>
                                </ul>
                            </div>
                        </div>


                            <div className="row align-items-start justify-content-start">
                                <div className="col-md-8 order-md-1  text-md-left">
                                    <p className="blockquote">
                                        На сайте используются следующие обозначения: USD — Доллары США, EUR — Евро, RUR — Российские Рубли. Термин Покупка Долларов или Евро обозначает цену, по которой банки готовы купить у вас валюту, заплатив вам российские рубли. Продажа Долларов или Евро означает цену, по которой Банк готов продать вам валюту и получить от вас российские рубли.
                                        Перед поездкой в банк обязательно уточните курс по телефону. Не забывайте, что в зависимости от суммы банком может быть предложен льготный курс.
                                    </p>
                                </div>
                            </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = ({ authUser }) => {
    const { authLocation } = authUser;
    return { authLocation };
};

export default connect(
    mapStateToProps,
)(ExchangeRate);