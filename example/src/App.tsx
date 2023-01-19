// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './App.css'
import img1 from './assets/1.jpg?magic=lqip'
import img2 from './assets/2.jpg?magic=lqip'
import img3 from './assets/3.jpg?magic=lqip'
import img4 from './assets/4.jpg?magic=lqip'
import img5 from './assets/5.jpg?magic=lqip'

import img6 from './assets/6.jpg?magic=sqip&numberOfPrimitives=100&blur=0'
import img7 from './assets/7.jpg?magic=sqip&numberOfPrimitives=100&blur=0'
import img8 from './assets/8.jpg?magic=sqip&numberOfPrimitives=100&blur=0'
import img9 from './assets/9.jpg?magic=sqip&numberOfPrimitives=150'
import img10 from './assets/10.jpg?magic=sqip&numberOfPrimitives=100&blur=0'

import img11 from './assets/11.jpg?magic=draw'
import img12 from './assets/12.jpg?magic=draw'
import img13 from './assets/13.jpg?magic=draw'
import img14 from './assets/14.jpg?magic=draw'
import img15 from './assets/15.jpg?magic=draw'

import img16 from './assets/16.jpg?magic=cucoloris'
import img17 from './assets/17.jpg?magic=cucoloris'
import img18 from './assets/18.jpg?magic=cucoloris'
import img19 from './assets/19.jpg?magic=cucoloris'
import img20 from './assets/20.jpg?magic=cucoloris'

function App() {

	const lqip: string[] = [
		img1,
		img2,
		img3,
		img4,
		img5,
	]

	const sqip: string[] = [
		img6,
		img7,
		img8,
		img9,
		img10
	]

	const draw: string[] = [
		img11,
		img12,
		img13,
		img14,
		img15
	]

	const cucoloris: string[] = [
		img16,
		img17,
		img18,
		img19,
		img20
	]

	const imgMap = new Map<string, string[]>([
		['lqip', lqip],
		['sqip', sqip],
		['cucoloris', cucoloris],
		['draw', draw],
	])

	return (
		<div className="App">
			<h1>magic-img</h1>
			<div className='header'>
				<a href="https://github.com/lishaobos/magic-img" target='_blank'>github</a>，
				<a href="https://juejin.cn/post/7122256732940107813" target='_blank'>掘金</a>，
				<a href="https://www.npmjs.com/package/magic-img" target='_blank'>npm</a>，
				<a href="https://github.com/lishaobos/magic-img/tree/main/example" target='_blank'>示例代码</a>
			</div>
			{Array.from(imgMap.entries()).map(([key, list]) => {
				return (
					<div key={key}>
						<h2>{key.toUpperCase()}</h2>
						{list.map((src, index) => (
							<div key={key + index}>
								<magic-img class={'magic'} src={src} />
							</div>
						))}
					</div>
				)
			})}
      
		</div>
	)
}

export default App
