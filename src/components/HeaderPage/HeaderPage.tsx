import { Link } from 'react-router-dom';
import './HeaderPage.scss';

const HeaderPage = () => {
	return (
		<header className='header'>
			<div className='container header__container'>
				<div className='header__wrap'>
					<svg width='40' height='40'>
						<use xlinkHref='/public/icons.svg#logo'></use>
					</svg>
					<Link to={'/'} style={{ color: '#dc3e22' }}>
						<h1 className='header__title'>pomodoro_box</h1>
					</Link>
				</div>
				<div className='header__statistic'>
					<svg width='24' height='24'>
						<use xlinkHref='/public/icons.svg#statistics'></use>
					</svg>

					<Link to={'/statistics'}>
						<button className='header__btn'>Статистика</button>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default HeaderPage;
