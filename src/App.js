import React, { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
	const [fromCurrency, setFromCurrency] = useState('EUR');
	const [toCurrency, setToCurrency] = useState('USD');
	const [fromPrice, setFromPrice] = useState(0);
	const [toPrice, setToPrice] = useState(0);

	const ratesRef = useRef({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('https://www.cbr-xml-daily.ru/daily_json.js')
			.then(res => res.json())
			.then(json => {
				setLoading(false);
				ratesRef.current = json.Valute;
				onChangeToPrice(1);
			})
			.catch(err => {
				console.warn(err);
				alert('Не удалось получить информацию');
			});
	}, []);

	const onChangeFromPrice = value => {
		const price = value * ratesRef.current[fromCurrency].Value;
		const result = price / ratesRef.current[toCurrency].Value;
		setToPrice(result.toFixed(4));
		setFromPrice(value);
	};

	const onChangeToPrice = value => {
		const price = value * ratesRef.current[toCurrency].Value;
		const result = price / ratesRef.current[fromCurrency].Value;
		setFromPrice(result.toFixed(4));
		setToPrice(value);
	};

	useEffect(() => {
		!loading && onChangeFromPrice(fromPrice);
	}, [fromCurrency]);

	useEffect(() => {
		!loading && onChangeToPrice(toPrice);
	}, [toCurrency]);

	return (
		<div className='App'>
			{loading && <div>Loading</div>}
			<Block
				value={fromPrice}
				onChangeValue={onChangeFromPrice}
				currency={fromCurrency}
				onChangeCurrency={setFromCurrency}
			/>
			<Block
				value={toPrice}
				onChangeValue={onChangeToPrice}
				currency={toCurrency}
				onChangeCurrency={setToCurrency}
			/>
		</div>
	);
}

export default App;
