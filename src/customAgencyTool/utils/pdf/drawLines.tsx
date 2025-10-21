import { Line, Svg } from '@react-pdf/renderer';

interface ILineHorizontal {
	width: number;
	height?: number;
	color?: string;
}

export const LineHorizontal: React.FC<ILineHorizontal> = ({
	width,
	height = 2,
	color = 'black',
}) => {
	return (
		<svg width={width} height={height}>
			<line x1='0' y1='1' x2='550' y2='1' stroke={color} strokeWidth='1' />
		</svg>
	);
};

export const LineHorizontalSVG: React.FC<ILineHorizontal> = ({
	width,
	height = 2,
	color = 'black',
}) => {
	return (
		<Svg width={width} height={height}>
			<Line x1='0' y1='1' x2={width} y2='1' stroke={color} strokeWidth='1' />
		</Svg>
	);
};

interface ILineVertical {
	height: number;
	width?: number;
	color?: string;
}

export const LineVerticalSVG: React.FC<ILineVertical> = ({
	height,
	width = 2,
	color = 'black',
}) => {
	return (
		<Svg width={width} height={height}>
			<Line
				x1='0'
				y1='0'
				x2='0'
				y2={height}
				stroke={color}
				strokeWidth='2'
				//x1='0' y1='0' x2='1' y2={height} stroke={color} strokeWidth='1'
			/>
		</Svg>
	);
};
